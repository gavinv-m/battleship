class Cell {
  constructor() {
    this.occupied = false;
    this.ship = null;
    this.hitCount = 0;
  }
}

export default class Gameboard {
  constructor() {
    this.boardSize = 10;
    this.board = this.initialiseBoard(this.boardSize);
    this.missedShots = [];
    this.fleet = [];
  }

  placeShip(ship, coordinates, orientation) {
    const [row, column] = coordinates;
    const length = ship.length;
    let endRow, endCol, rowIncrement, colIncrement;

    if (orientation === 'horizontal') {
      endRow = row;
      endCol = column + length - 1;
      rowIncrement = 0;
      colIncrement = 1;
    } else if (orientation === 'vertical') {
      endRow = row + length - 1;
      endCol = column;
      rowIncrement = 1;
      colIncrement = 0;
    }

    const addShipToFleet = this.validateAndPlaceShip(
      ship,
      row,
      column,
      endRow,
      endCol,
      rowIncrement,
      colIncrement,
    );

    if (addShipToFleet === true) {
      this.fleet.push({
        id: ship,
        length: length,
        sunk: false,
      });
    }
  }

  receiveAttack(coordinates) {
    const [row, column] = coordinates;
    const cell = this.board[row][column];

    if (cell.occupied === false && cell.hitCount > 0) return false;

    if (cell.occupied === false && cell.hitCount === 0) {
      cell.hitCount += 1;
      this.missedShots.push(coordinates);
      return false;
    }

    cell.ship.hit();
    const sunk = cell.ship.isSunk();
    if (sunk === true) {
      this.fleet.filter((shipDetails, index, arr) => {
        if (shipDetails.id === cell.ship) {
          this.fleet[index].sunk = true;
        }
      });
    }

    return this.areAllShipsSunk();
  }

  areAllShipsSunk() {
    return this.fleet.every((shipDetails) => shipDetails.sunk === true);
  }

  initialiseBoard(size) {
    const board = Array(10)
      .fill(null)
      .map(() => []);

    board.forEach((row) => {
      while (row.length < size) {
        row.push(new Cell());
      }
    });

    return board;
  }

  validateAndPlaceShip(ship, row, column, endRow, endCol, rowInc, colInc) {
    // Base case for successfully reaching the end of the ship
    if (row === endRow + rowInc && column === endCol + colInc) return true;

    // Base case for out-of-bounds check
    if (row < 0 || row >= this.boardSize) return false;
    if (column < 0 || column >= this.boardSize) return false;

    const currentCell = this.board[row][column];
    if (currentCell.occupied === true) return false;

    const update = this.validateAndPlaceShip(
      ship,
      row + rowInc,
      column + colInc,
      endRow,
      endCol,
      rowInc,
      colInc,
    );

    if (update === true) {
      currentCell.occupied = true;
      currentCell.ship = ship;
      return true;
    }

    return false;
  }
}
