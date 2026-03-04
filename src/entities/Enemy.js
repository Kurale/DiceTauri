import { Entity } from './Entity.js';

export class Enemy extends Entity {
  constructor(config, data) {
    super({ x: data.x, y: data.y, width: config.width, height: config.height, type: data.enemyType || 'enemy' });
    this.solid = false;
    this.speed = data.speed ?? config.speed;
    this.minX = data.patrol.minX;
    this.maxX = data.patrol.maxX;
    this.direction = 1;
  }

  update(dt) {
    this.x += this.direction * this.speed * dt;
    if (this.x < this.minX) {
      this.x = this.minX;
      this.direction = 1;
    } else if (this.x + this.width > this.maxX) {
      this.x = this.maxX - this.width;
      this.direction = -1;
    }
  }
}
