export class UIManager {
  constructor(hudEl, messagesEl) {
    this.hudEl = hudEl;
    this.messagesEl = messagesEl;
  }

  renderHUD({ levelNumber, totalLevels, score, lives, paused }) {
    this.hudEl.innerHTML = `
      <h2>Статус</h2>
      <ul>
        <li>Уровень: ${levelNumber}/${totalLevels}</li>
        <li>Очки: ${score}</li>
        <li>Жизни: ${lives}</li>
        <li>Пауза: ${paused ? 'Да' : 'Нет'}</li>
      </ul>
    `;
  }

  setMessage(title, body) {
    this.messagesEl.innerHTML = `<strong>${title}</strong><p>${body}</p>`;
  }
}
