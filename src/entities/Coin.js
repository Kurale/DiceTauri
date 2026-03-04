import { Entity } from './Entity.js';

export class Coin extends Entity {
  constructor(data) {
    super({ x: data.x, y: data.y, width: data.width ?? 18, height: data.height ?? 18, type: 'coin' });
    this.trigger = true;
    this.value = data.value;
  }
}
