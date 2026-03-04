import { Game } from './core/Game.js';

const canvas = document.getElementById('gameCanvas');
const hud = document.getElementById('hud');
const messages = document.getElementById('messages');

const game = new Game({ canvas, hudEl: hud, messagesEl: messages });
game.start();
