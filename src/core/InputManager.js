const DEFAULT_BINDINGS = {
  left: ['ArrowLeft'],
  right: ['ArrowRight'],
  jump: ['Space'],
  restart: ['KeyR'],
  pause: ['Escape'],
};

/** @public */
export class InputManager {
  #onKeyDown = (event) => {
    if (!this.pressed.has(event.code)) {
      this.justPressed.add(event.code);
    }
    this.pressed.add(event.code);
  };

  #onKeyUp = (event) => {
    this.pressed.delete(event.code);
  };

  constructor(bindings = DEFAULT_BINDINGS) {
    this.bindings = bindings;
    this.pressed = new Set();
    this.justPressed = new Set();
  }

  attach() {
    window.addEventListener('keydown', this.#onKeyDown);
    window.addEventListener('keyup', this.#onKeyUp);
  }

  detach() {
    window.removeEventListener('keydown', this.#onKeyDown);
    window.removeEventListener('keyup', this.#onKeyUp);
  }

  isDown(action) {
    return this.bindings[action].some((code) => this.pressed.has(code));
  }

  consume(action) {
    const code = this.bindings[action].find((key) => this.justPressed.has(key));
    if (!code) return false;
    this.justPressed.delete(code);
    return true;
  }

  endFrame() {
    this.justPressed.clear();
  }
}
