import { GAME_CONFIG } from '../config.js';
import { Camera } from './Camera.js';
import { InputManager } from './InputManager.js';
import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { PhysicsSystem } from '../systems/PhysicsSystem.js';
import { LevelLoader } from '../systems/LevelLoader.js';
import { RenderSystem } from '../systems/RenderSystem.js';
import { UIManager } from '../ui/UIManager.js';
import { LEVELS } from '../levels/levels.js';
import { aabbIntersects } from '../utils/math.js';

/** @public */
export class Game {
  constructor({ canvas, hudEl, messagesEl }) {
    this.config = GAME_CONFIG;
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;

    this.input = new InputManager();
    this.physics = new PhysicsSystem(this.config);
    this.renderer = new RenderSystem(this.ctx, this.config);
    this.ui = new UIManager(hudEl, messagesEl);
    this.levelLoader = new LevelLoader(this.config, LEVELS, (enemyData) => new Enemy(this.config.enemy, enemyData));

    this.player = new Player(this.config.player, { x: 0, y: 0 });
    this.levelIndex = 0;
    this.level = null;
    this.camera = null;
    this.running = false;
    this.paused = false;
    this.lastTime = 0;
    this.accumulatorMs = 0;

    this.#loadLevel(0, true);
  }

  start() {
    this.input.attach();
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.#loop(t));
  }

  #loadLevel(index, fullReset = false) {
    const loaded = this.levelLoader.create(index);
    if (!loaded) return;
    this.levelIndex = index;
    this.level = loaded;

    if (fullReset) {
      this.player.lives = this.config.player.maxLives;
      this.player.score = 0;
    }

    this.player.setSpawn(loaded.spawn);

    this.camera = new Camera(
      this.canvas.width,
      this.canvas.height,
      loaded.meta.size.width,
      loaded.meta.size.height,
      this.config.rendering.cameraLerp,
    );

    this.ui.setMessage('Уровень загружен', `Текущий уровень: ${this.levelIndex + 1}`);
  }

  #restartCurrentLevel() {
    this.#loadLevel(this.levelIndex, false);
  }

  #loop(now) {
    if (!this.running) return;
    const dt = Math.min((now - this.lastTime) / 1000, 0.033);
    this.lastTime = now;

    if (this.input.consume('pause')) {
      this.paused = !this.paused;
      this.ui.setMessage(this.paused ? 'Пауза' : 'Продолжение', 'ESC переключает паузу.');
    }

    if (this.input.consume('restart')) {
      this.#restartCurrentLevel();
    }

    if (!this.paused) {
      this.#update(dt, now);
    }

    this.#render(now);
    this.input.endFrame();
    requestAnimationFrame((t) => this.#loop(t));
  }

  #update(dt, nowMs) {
    this.physics.applyPlayerInput(this.player, this.input);
    this.physics.simulate(this.player, this.level.platforms, dt);

    for (const enemy of this.level.enemies.filter((e) => e.active)) enemy.update(dt);

    for (const coin of this.level.coins) {
      if (coin.active && aabbIntersects(this.player.bounds, coin.bounds)) {
        coin.active = false;
        this.player.score += coin.value;
      }
    }

    const tookDamage = this.level.enemies.some((enemy) => enemy.active && aabbIntersects(this.player.bounds, enemy.bounds)) ||
      this.level.hazards.some((hazard) => aabbIntersects(this.player.bounds, hazard.bounds));

    if (tookDamage && this.player.takeHit(nowMs)) {
      if (this.player.lives <= 0) {
        this.ui.setMessage('Поражение', 'Жизни закончились. Нажмите R для рестарта уровня.');
        this.paused = true;
      } else {
        this.player.resetToSpawn();
        this.ui.setMessage('Получен урон', `Осталось жизней: ${this.player.lives}`);
      }
    }

    if (this.player.y > this.level.meta.size.height + 200 && this.player.takeHit(nowMs)) {
      if (this.player.lives <= 0) {
        this.ui.setMessage('Поражение', 'Вы упали слишком много раз. Нажмите R.');
        this.paused = true;
      } else {
        this.player.resetToSpawn();
      }
    }

    this.level.coins = this.level.coins.filter((coin) => coin.active);

    if (this.player.x >= this.level.triggers.levelEndX) {
      const nextIndex = this.levelIndex + 1;
      if (nextIndex >= LEVELS.length) {
        this.ui.setMessage('Победа', `Вы прошли игру! Итоговый счёт: ${this.player.score}. Нажмите R для повтора.`);
        this.paused = true;
        this.levelIndex = 0;
      } else {
        this.#loadLevel(nextIndex, false);
      }
    }

    this.camera.follow(this.player);
  }

  #render(nowMs) {
    this.renderer.render({
      level: this.level,
      player: this.player,
      camera: this.camera,
      nowMs,
    });

    this.ui.renderHUD({
      levelNumber: this.levelIndex + 1,
      totalLevels: LEVELS.length,
      score: this.player.score,
      lives: this.player.lives,
      paused: this.paused,
    });
  }
}
