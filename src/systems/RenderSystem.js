export class RenderSystem {
  constructor(ctx, config) {
    this.ctx = ctx;
    this.config = config;
  }

  render(state) {
    const { ctx } = this;
    const { camera, level, player } = state;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = this.config.rendering.clearColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.save();
    ctx.translate(-camera.position.x, -camera.position.y);

    this.#drawPlatforms(level.platforms);
    this.#drawHazards(level.hazards);
    this.#drawCoins(level.coins);
    this.#drawEnemies(level.enemies);
    this.#drawPlayer(player, state.nowMs);

    ctx.restore();
  }

  #drawPlatforms(platforms) {
    this.ctx.fillStyle = '#334155';
    for (const p of platforms) this.ctx.fillRect(p.x, p.y, p.width, p.height);
  }

  #drawHazards(hazards) {
    this.ctx.fillStyle = '#ef4444';
    for (const h of hazards) this.ctx.fillRect(h.x, h.y, h.width, h.height);
  }

  #drawCoins(coins) {
    this.ctx.fillStyle = '#f59e0b';
    for (const c of coins.filter((coin) => coin.active)) {
      this.ctx.beginPath();
      this.ctx.arc(c.x + c.width / 2, c.y + c.height / 2, c.width / 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  #drawEnemies(enemies) {
    this.ctx.fillStyle = '#f97316';
    for (const e of enemies.filter((enemy) => enemy.active)) {
      this.ctx.fillRect(e.x, e.y, e.width, e.height);
    }
  }

  #drawPlayer(player, nowMs) {
    this.ctx.fillStyle = nowMs < player.invulnerableUntil ? '#93c5fd' : '#22c55e';
    this.ctx.fillRect(player.x, player.y, player.width, player.height);
  }
}
