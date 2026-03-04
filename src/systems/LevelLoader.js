import { Platform } from '../entities/Platform.js';
import { Enemy } from '../entities/Enemy.js';
import { Coin } from '../entities/Coin.js';
import { Hazard } from '../entities/Hazard.js';

export class LevelLoader {
  constructor(gameConfig, levels, enemyFactory) {
    this.config = gameConfig;
    this.levels = levels;
    this.enemyFactory = enemyFactory;
  }

  create(levelIndex) {
    const level = this.levels[levelIndex];
    if (!level) return null;

    return {
      meta: level,
      spawn: { ...level.playerSpawn },
      platforms: level.platforms.map((p) => new Platform(p)),
      enemies: level.enemies.map((e) => this.enemyFactory(e)),
      coins: level.coins.map((c) => new Coin({ ...c, value: this.config.scoring.coin })),
      hazards: level.hazards.map((h) => new Hazard(h)),
      triggers: level.triggers,
    };
  }
}
