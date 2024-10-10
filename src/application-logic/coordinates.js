import captureHumanPlayerShips from './utils/human-ships';

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
    return this.playerShipPlacements;
  }
}
