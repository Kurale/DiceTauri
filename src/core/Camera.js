import { clamp } from '../utils/math.js';

export class Camera {
  constructor(viewportWidth, viewportHeight, worldPixelWidth, worldPixelHeight, lerp) {
    this.viewport = { width: viewportWidth, height: viewportHeight };
    this.world = { width: worldPixelWidth, height: worldPixelHeight };
    this.position = { x: 0, y: 0 };
    this.lerp = lerp;
  }

  follow(target) {
    const desiredX = target.x + target.width / 2 - this.viewport.width / 2;
    const desiredY = target.y + target.height / 2 - this.viewport.height / 2;
    this.position.x += (desiredX - this.position.x) * this.lerp;
    this.position.y += (desiredY - this.position.y) * this.lerp;
    this.position.x = clamp(this.position.x, 0, Math.max(0, this.world.width - this.viewport.width));
    this.position.y = clamp(this.position.y, 0, Math.max(0, this.world.height - this.viewport.height));
  }
}
