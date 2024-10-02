import Game from './application-logic/game';
import InterfaceManager from './interface-logic/interface-manager';

export default class MainManager {
  constructor() {
    this.game = new Game();
    this.interfaceManager = new InterfaceManager();
    this.setupPlayListener();
    this.setupResetListener();
  }

  startApplication() {
    this.game.startGame();

    // Populate interface
    const players = this.game.getPlayers();
    this.interfaceManager.renderGameboards(players, this.game);
  }

  resetGame() {
    this.game = new Game();
    this.startApplication();
  }

  setupPlayListener() {
    document.addEventListener('startGame', () => {
      this.game.gameActive = true;
      this.game.placeShips();
    });
  }

  setupResetListener() {
    document.addEventListener('resetGame', () => {
      this.resetGame();
    });
  }
}
