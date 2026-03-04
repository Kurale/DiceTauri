export const GAME_CONFIG = {
  world: {
    width: 120,
    height: 24,
    tileSize: 32,
    gravity: 1800,
    maxFallSpeed: 1600,
    scale: 1,
  },
  player: {
    width: 26,
    height: 30,
    moveSpeed: 290,
    jumpVelocity: 700,
    invulnerabilityMs: 900,
    maxLives: 3,
    respawnDelayMs: 450,
  },
  enemy: {
    width: 28,
    height: 28,
    speed: 90,
  },
  rendering: {
    clearColor: '#0b1020',
    cameraLerp: 0.12,
  },
  scoring: {
    coin: 100,
  },
  assets: {
    atlas: {
      image: null,
      frames: {},
    },
    audio: {
      jump: null,
      hit: null,
      coin: null,
      win: null,
    },
  },
};
