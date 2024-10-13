import Player from './player';
import Ship from './ship';
import Coordinates from './coordinates';

export default class Game {
  constructor() {
    this.player1 = null;
    this.player2 = null;

    this.computerAttackCoords = [];
    this.computerHits = 0;
    this.precision = false;
    this.preciseCoords = [];
    this.firstHit = [];
    this.removed = false;

    this.gameWon = false;
    this.gameActive = false;

    this.coordinates = new Coordinates();
  }

  startGame() {
    this.player1 = new Player();
    this.player2 = new Player();
    this.generatePossibleAttacks();
  }

  placeShips() {
    const playerShipPlacements = this.coordinates.getPlayerShipPlacements();
    playerShipPlacements.forEach((playerShips, index) => {
      const player = index === 0 ? this.player1 : this.player2;
      playerShips.forEach((ship) => {
        const newShip = new Ship(ship.length);
        player.gameboard.placeShip(newShip, ship.start, ship.orientation);
      });
    });
  }

  attack(coordinates) {
    if (this.gameWon === true || this.gameActive === false) return;
    const humanWon = this.player2.gameboard.receiveAttack(coordinates, 'human');

    // Dispatch to update ui
    this.dispatchAttackEvent('human', coordinates, this.player2.gameboard);

    humanWon === true ? (this.gameWon = true) : this.playComputerTurn();
  }

  playComputerTurn() {
    let attackCoords;

    if (this.preciseCoords.length > 0) {
      attackCoords = this.preciseCoords.pop();
      const index = this.computerAttackCoords.findIndex(
        (coord) => coord[0] === attackCoords[0] && coord[1] === attackCoords[1],
      );
      this.computerAttackCoords.splice(index, 1);
    } else {
      this.precision = false;
      this.removed = false;
      this.shuffle();
      attackCoords = this.computerAttackCoords.pop(); // Returns to us the last element
    }

    const computerWon = this.player1.gameboard.receiveAttack(
      attackCoords,
      'computer',
    );

    // Query for number of hits on player board
    const hitTarget = this.checkHits();

    // Hit target using precision, determine orientation, remove misaligned coords
    if (hitTarget && this.precision && !this.removed) {
      // First coordinates are the ones that enabled precision
      const [row, col] = this.firstHit;
      const [r, c] = attackCoords;

      const isHorizontal = row === r;
      const isVertical = col === c;

      this.preciseCoords = this.preciseCoords.filter(([x, y]) => {
        return (isHorizontal && x === row) || (isVertical && y === col);
      });

      const newCoords = [];
      if (isVertical === true) {
        if (r - 1 >= 0) newCoords.push([r - 1, col]);
        if (r + 1 < 10) newCoords.push([r + 1, col]);
      } else {
        if (c - 1 >= 0) newCoords.push([row, c - 1]);
        if (c + 1 < 10) newCoords.push([row, c + 1]);
      }

      // Check if the coordinate not attacked and not already in precise coords
      newCoords.forEach((coord) => {
        const isInComputerAttackCoords = this.computerAttackCoords.some(
          ([x, y]) => x === coord[0] && y === coord[1],
        );
        const isInPreciseCoords = this.preciseCoords.some(
          ([x, y]) => x === coord[0] && y === coord[1],
        );
        if (isInComputerAttackCoords && !isInPreciseCoords) {
          this.preciseCoords.push(coord);
        }
      });

      this.removed = true;
      this.computerHits += 1;
    }

    // First hit
    if (hitTarget === true && this.precision === false) {
      this.computerHits += 1;
      this.firstHit = attackCoords;
      this.precision = true;
      this.predictCoordinates(attackCoords);
    }

    // Dispatch to update ui
    this.dispatchAttackEvent('computer', attackCoords, this.player1.gameboard);

    computerWon === true ? (this.gameWon = true) : this.gameWon;
  }

  checkHits() {
    const occupiedHits = this.player1.gameboard.board.reduce(
      (totalHits, row) => {
        const rowHits = row.reduce((cellHits, cell) => {
          if (cell.occupied === true && cell.hitCount >= 1) {
            return (cellHits += 1);
          }
          return cellHits;
        }, 0);
        return totalHits + rowHits;
      },
      0,
    );

    return occupiedHits !== this.computerHits;
  }

  predictCoordinates(recentCoordinates) {
    const [row, col] = recentCoordinates;

    // Horizontal coordinates
    for (let i = col - 1; i < col + 2; i += 2) {
      if (i >= 0 && i <= 9) {
        const target = [row, i];
        const notAttacked = this.computerAttackCoords.some(
          (coord) => coord[0] === target[0] && coord[1] === target[1],
        );
        if (notAttacked === true) this.preciseCoords.push(target);
      }
    }

    // Vertical coordinates
    for (let i = row - 1; i < row + 2; i += 2) {
      if (i >= 0 && i <= 9) {
        const target = [i, col];
        const notAttacked = this.computerAttackCoords.some(
          (coord) => coord[0] === target[0] && coord[1] === target[1],
        );
        if (notAttacked === true) this.preciseCoords.push(target);
      }
    }
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

  dispatchAttackEvent(player, coordinates, gameboard) {
    const attackEvent = new CustomEvent('attackMade', {
      detail: {
        player,
        coordinates,
        gameboard,
      },
    });
    document.dispatchEvent(attackEvent);
  }
}
