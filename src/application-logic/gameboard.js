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
  }

  placeShip(ship, coordinates, orientation) {
    checkAndPlace = (row, column, endRow, endCol, rowInc, colInc) => {
      // Base case for successfully reaching the end of the ship
      if (row === endRow + rowInc && column === endCol + colInc) return true;

      // Base case for out-of-bounds check
      if (row < 0 || row >= this.boardSize) return false;
      if (column < 0 || column >= this.boardSize) return false;

      const currentCell = this.board[row][column];
      if (currentCell.occupied === true) return false;

      const update = checkAndPlace(
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
    };

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

    checkAndPlace(row, column, endRow, endCol, rowIncrement, colIncrement);
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
}
