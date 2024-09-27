import Game from './application-logic/game';
import InterfaceManager from './interface-logic/interface-manager';

export default class MainManager {
  constructor() {
    this.game = new Game();
    this.interfaceManager = new InterfaceManager();
  }

  startApplication() {
    this.game.startGame();

    // Populate interface
    const players = this.game.getPlayers();
    this.interfaceManager.renderGameboards(players);
  }
}
