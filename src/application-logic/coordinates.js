import captureHumanPlayerShips from './utils/human-ships';
import generateCoordinates from './utils/computer-ships';

// Exports to gamne.js
export default class Coordinates {
  constructor() {
    this.playerShipPlacements = [];
  }

  getPlayerShipPlacements() {
    const playerShips = captureHumanPlayerShips();
    playerShips.forEach((fleet) => {
      this.playerShipPlacements.push(fleet);
    });

    // Check if single human player, play computer
    if (playerShips.length === 1) {
      this.playerShipPlacements.push(generateCoordinates());
    }
    return this.playerShipPlacements;
  }
}
