import { Entity } from './Entity.js';

export class Hazard extends Entity {
  constructor(data) {
    super({ x: data.x, y: data.y, width: data.width, height: data.height, type: data.hazardType || 'hazard' });
    this.trigger = true;
  }
}
