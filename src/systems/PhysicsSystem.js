import { clamp } from '../utils/math.js';

export class PhysicsSystem {
  constructor(config) {
    this.config = config;
  }

  applyPlayerInput(player, input) {
    const movingLeft = input.isDown('left');
    const movingRight = input.isDown('right');
    if (movingLeft === movingRight) {
      player.velocity.x = 0;
    } else {
      player.velocity.x = movingLeft ? -player.config.moveSpeed : player.config.moveSpeed;
    }

    if (input.consume('jump') && player.onGround) {
      player.velocity.y = -player.config.jumpVelocity;
      player.onGround = false;
    }
  }

  simulate(player, solids, dt) {
    player.velocity.y += this.config.world.gravity * dt;
    player.velocity.y = clamp(player.velocity.y, -Infinity, this.config.world.maxFallSpeed);

    player.x += player.velocity.x * dt;
    this.#resolveAxis(player, solids, 'x');

    player.y += player.velocity.y * dt;
    player.onGround = false;
    this.#resolveAxis(player, solids, 'y');
  }

  #resolveAxis(player, solids, axis) {
    for (const platform of solids) {
      if (!this.#intersects(player, platform)) continue;

      if (axis === 'x') {
        if (player.velocity.x > 0) player.x = platform.x - player.width;
        else if (player.velocity.x < 0) player.x = platform.x + platform.width;
        player.velocity.x = 0;
      } else {
        if (player.velocity.y > 0) {
          player.y = platform.y - player.height;
          player.onGround = true;
        } else if (player.velocity.y < 0) {
          player.y = platform.y + platform.height;
        }
        player.velocity.y = 0;
      }
    }
  }

  #intersects(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }
}
