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
    { name: 'Battleship', start: [6, 2], orientation: 'horizontal', length: 4 },
    { name: 'Cruiser', start: [2, 4], orientation: 'vertical', length: 3 },
    { name: 'Submarine', start: [5, 0], orientation: 'horizontal', length: 3 },
    { name: 'Destroyer', start: [8, 2], orientation: 'vertical', length: 2 },
  ],
];

export default class Game {
  constructor() {
    this.player1 = null;
    this.player2 = null;
    this.computerAttackCoords = [];
    this.gameWon = false;
  }

  startGame() {
    this.player1 = new Player();
    this.player2 = new Player();
    this.placeShips();
    this.generatePossibleAttacks();
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
    if (this.gameWon === true) return;
    const humanWon = this.player2.gameboard.receiveAttack(coordinates);

    // Dispatch to update ui
    const attackEvent = new CustomEvent('attackMade', {
      detail: {
        player: 'human',
        coordinates,
        gameboard: this.player2.gameboard, // Computer gameboard
      },
    });
    document.dispatchEvent(attackEvent);

    humanWon === true ? (this.gameWon = true) : this.playComputerTurn();
  }

  playComputerTurn() {
    this.shuffle();
    let attackCoords = this.computerAttackCoords.pop(); // Returns to us the last element
    const computerWon = this.player1.gameboard.receiveAttack(attackCoords);

    // Dispatch to update ui
    const attackEvent = new CustomEvent('attackMade', {
      detail: {
        player: 'computer',
        coordinates: attackCoords,
        gameboard: this.player1.gameboard, // Human gameboard
      },
    });
    document.dispatchEvent(attackEvent);

    computerWon === true ? (this.gameWon = true) : this.gameWon;
  }

  generatePossibleAttacks() {
    this.player1.gameboard.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        this.computerAttackCoords.push([rowIndex, colIndex]);
      });
    });
  }

  shuffle() {
    for (let i = this.computerAttackCoords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.computerAttackCoords[i], this.computerAttackCoords[j]] = [
        this.computerAttackCoords[j],
        this.computerAttackCoords[i],
      ];
    }
  }

  getPlayers() {
    return [this.player1, this.player2];
  }
}
