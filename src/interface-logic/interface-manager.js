import generateGameboards from './utils/generateGameboard';

// Exports to main-controller.js
export default class InterfaceManager {
  constructor() {
    this.container = document.getElementById('player-boards');
  }

  renderGameboards(players, currentGame) {
    generateGameboards(players, this.container, currentGame);
  }
}
