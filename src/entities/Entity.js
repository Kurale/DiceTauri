/** @public */
export class Entity {
  constructor({ x, y, width, height, type }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.velocity = { x: 0, y: 0 };
    this.active = true;
    this.solid = false;
    this.trigger = false;
  }

  get bounds() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  update() {}
}
