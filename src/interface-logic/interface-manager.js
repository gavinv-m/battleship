import generateGameboards from './utils/generateGameboard';

// Exports to main-controller.js
export default class InterfaceManager {
  constructor() {
    this.container = document.getElementById('player-boards');
  }

  renderGameboards(players) {
    generateGameboards(players, this.container);
  }
}
