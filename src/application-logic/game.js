import Player from './player';
import Ship from './ship';

const playerShipPlacements = [
  // Player 1
  [
    { name: 'Carrier', start: [0, 0], orientation: 'horizontal', length: 5 },
    { name: 'Battleship', start: [1, 2], orientation: 'vertical', length: 4 },
    { name: 'Cruiser', start: [4, 5], orientation: 'horizontal', length: 3 },
    { name: 'Submarine', start: [7, 8], orientation: 'vertical', length: 3 },
    { name: 'Destroyer', start: [3, 3], orientation: 'horizontal', length: 2 },
  ],
  // Player 2
  [
    { name: 'Carrier', start: [5, 9], orientation: 'vertical', length: 5 }, // Adjusted starting point
    { name: 'Battleship', start: [6, 6], orientation: 'horizontal', length: 4 },
    { name: 'Cruiser', start: [2, 4], orientation: 'vertical', length: 3 },
    { name: 'Submarine', start: [5, 0], orientation: 'horizontal', length: 3 },
    { name: 'Destroyer', start: [8, 2], orientation: 'vertical', length: 2 },
  ],
];

export default class Game {
  constructor() {
    this.player1 = null;
    this.player2 = null;
    this.activePlayer = null;
  }

  startGame() {
    this.player1 = new Player();
    this.player2 = new Player();
    this.activePlayer = this.player1;
    this.placeShips();
  }

  placeShips() {
    playerShipPlacements.forEach((playerShips, index) => {
      const player = index === 0 ? this.player1 : this.player2;
      playerShips.forEach((ship) => {
        const newShip = new Ship(ship.length);
        player.gameboard.placeShip(newShip, ship.start, ship.orientation);
      });
    });
  }

  attack(coordinates) {
    this.player2.gameboard.receiveAttack(coordinates);
    this.playComputerTurn();
  }

  playComputerTurn() {
    let attack = false;
    while (attack === false) {
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      const attackCoords = [row, col];

      const matchFound = this.player1.gameboard.missedShots.some(
        (coords) => coords[0] === row && coords[1] === col,
      );

      if (matchFound === true) continue;
      this.player1.gameboard.receiveAttack(attackCoords);
      attack = true;
    }
  }
}
