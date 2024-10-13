import Player from './player';
import Ship from './ship';
import Coordinates from './coordinates';
import ComputerPlayer from './computer';

export default class Game {
  constructor() {
    this.player1 = null;
    this.player2 = null;
    this.computerPlayer = new ComputerPlayer();

    this.gameWon = false;
    this.gameActive = false;

    this.coordinates = new Coordinates();
  }

  startGame() {
    this.player1 = new Player();
    this.player2 = new Player();
    this.computerPlayer.generatePossibleAttacks(this.player1.gameboard.board);
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
    const attackCoords = this.computerPlayer.getAttackCoordinates();

    const computerWon = this.player1.gameboard.receiveAttack(
      attackCoords,
      'computer',
    );

    // Query for number of hits on player board
    const hitTarget = this.checkHits();
    this.computerPlayer.processAttackResult(hitTarget, attackCoords);

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

    return occupiedHits !== this.computerPlayer.hits;
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
