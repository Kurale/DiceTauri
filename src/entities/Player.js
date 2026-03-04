import { Entity } from './Entity.js';

export class Player extends Entity {
  constructor(config, spawn) {
    super({ x: spawn.x, y: spawn.y, width: config.width, height: config.height, type: 'player' });
    this.config = config;
    this.spawn = { ...spawn };
    this.onGround = false;
    this.lives = config.maxLives;
    this.score = 0;
    this.invulnerableUntil = 0;
  }

  resetToSpawn() {
    this.x = this.spawn.x;
    this.y = this.spawn.y;
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.onGround = false;
  }

  setSpawn(spawn) {
    this.spawn = { ...spawn };
    this.resetToSpawn();
  }

  takeHit(nowMs) {
    if (nowMs < this.invulnerableUntil) return false;
    this.lives -= 1;
    this.invulnerableUntil = nowMs + this.config.invulnerabilityMs;
    return true;
  }

  canTakeDamage(nowMs) {
    return nowMs >= this.invulnerableUntil;
  }
}
