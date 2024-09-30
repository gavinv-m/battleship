import generateGameboards from './utils/generateGameboard';
import createButtons from './utils/buttons';

// Exports to main-controller.js
export default class InterfaceManager {
  constructor() {
    this.container = document.getElementById('player-boards');
  }

  renderGameboards(players, currentGame) {
    generateGameboards(players, this.container, currentGame);
    createButtons(this.container);
  }
}
