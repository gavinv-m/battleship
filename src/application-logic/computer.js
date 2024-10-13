export default class ComputerPlayer {
  constructor() {
    this.attackCoords = [];
    this.hits = 0;
    this.precision = false;
    this.preciseCoords = [];
    this.firstHit = [];
    this.removed = false;
  }

  shuffle() {
    for (let i = this.attackCoords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.attackCoords[i], this.attackCoords[j]] = [
        this.attackCoords[j],
        this.attackCoords[i],
      ];
    }
  }

  getAttackCoordinates() {
    if (this.preciseCoords.length > 0) {
      const attackCoords = this.preciseCoords.pop();
      const index = this.attackCoords.findIndex(
        (coord) => coord[0] === attackCoords[0] && coord[1] === attackCoords[1],
      );
      this.attackCoords.splice(index, 1);
      return attackCoords;
    } else {
      this.precision = false;
      this.removed = false;
      this.shuffle();
      return this.attackCoords.pop();
    }
  }

  addNewPreciseCoords(isVertical, r, c, row, col) {
    const newCoords = [];
    if (isVertical) {
      if (r - 1 >= 0) newCoords.push([r - 1, col]);
      if (r + 1 < 10) newCoords.push([r + 1, col]);
    } else {
      if (c - 1 >= 0) newCoords.push([row, c - 1]);
      if (c + 1 < 10) newCoords.push([row, c + 1]);
    }

    newCoords.forEach((coord) => {
      const isInAttackCoords = this.attackCoords.some(
        ([x, y]) => x === coord[0] && y === coord[1],
      );
      const isInPreciseCoords = this.preciseCoords.some(
        ([x, y]) => x === coord[0] && y === coord[1],
      );
      if (isInAttackCoords && !isInPreciseCoords) {
        this.preciseCoords.push(coord);
      }
    });
  }

  refineAttackStrategy(attackCoords) {
    const [row, col] = this.firstHit;
    const [r, c] = attackCoords;

    const isHorizontal = row === r;
    const isVertical = col === c;

    this.preciseCoords = this.preciseCoords.filter(([x, y]) => {
      return (isHorizontal && x === row) || (isVertical && y === col);
    });

    this.addNewPreciseCoords(isVertical, r, c, row, col);

    this.removed = true;
    this.hits += 1;
  }

  addCoordIfNotAttacked(target) {
    const notAttacked = this.attackCoords.some(
      (coord) => coord[0] === target[0] && coord[1] === target[1],
    );
    if (notAttacked) this.preciseCoords.push(target);
  }

  predictCoordinates(recentCoordinates) {
    const [row, col] = recentCoordinates;

    // Horizontal coordinates
    for (let i = col - 1; i < col + 2; i += 2) {
      if (i >= 0 && i <= 9) {
        this.addCoordIfNotAttacked([row, i]);
      }
    }

    // Vertical coordinates
    for (let i = row - 1; i < row + 2; i += 2) {
      if (i >= 0 && i <= 9) {
        this.addCoordIfNotAttacked([i, col]);
      }
    }
  }

  initiatePrecisionAttack(attackCoords) {
    this.hits += 1;
    this.firstHit = attackCoords;
    this.precision = true;
    this.predictCoordinates(attackCoords);
  }

  processAttackResult(hitTarget, attackCoords) {
    if (hitTarget && this.precision && this.removed) {
      this.refineAttackStrategy(attackCoords);
    }
    /**
     * Check if precision is, and another part was hit
     * If another part hit determine direction to continue attack
     */
    if (hitTarget && this.precision && !this.removed) {
      this.refineAttackStrategy(attackCoords);
    }

    // If first hit on a ship enable precision
    if (hitTarget && !this.precision) {
      this.initiatePrecisionAttack(attackCoords);
    }
  }

  generatePossibleAttacks(gameboard) {
    gameboard.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        this.attackCoords.push([rowIndex, colIndex]);
      });
    });
  }
}
