import { Entity } from './Entity.js';

export class Platform extends Entity {
  constructor(data) {
    super({ x: data.x, y: data.y, width: data.width, height: data.height, type: 'platform' });
    this.solid = true;
  }
}
