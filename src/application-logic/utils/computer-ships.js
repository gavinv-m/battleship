const alignment = function decideOrientation() {
  return Math.round(Math.random()) === 0 ? 'horizontal' : 'vertical';
};

const startCoordinates = function getCoordinates(board, length, orientation) {
  let validCoordinates = false;
  let start;

  while (validCoordinates === false) {
    let row = Math.floor(Math.random() * 10);
    let col = Math.floor(Math.random() * 10);
    const validPlacement = [];

    if (board[row][col] === 0) {
      for (let i = 0; i < length; i++) {
        // prettier-ignore
        if (row < 10 && col < 10 && board[row][col] === 0) validPlacement.push([row, col]);
        else break;

        orientation === 'horizontal' ? (col += 1) : (row += 1);
      }

      if (validPlacement.length === length) {
        validCoordinates = true;
        start = validPlacement[0];

        // Update board
        validPlacement.forEach(([r, c]) => {
          board[r][c] = 1;
        });
      }
    }
  }

  return start;
};

// Exports to coordinates.js
export default function generateCoordinates() {
  const board = Array(10)
    .fill(null)
    .map(() => Array(10).fill(0));

  const ships = [
    { name: 'Carrier', length: 5 },
    { name: 'Battleship', length: 4 },
    { name: 'Cruiser', length: 3 },
    { name: 'Submarine', length: 3 },
    { name: 'Destroyer', length: 2 },
  ];

  const fleetDetails = ships.map((ship) => {
    const orientation = alignment();
    const start = startCoordinates(board, ship.length, orientation);
    return {
      start,
      orientation,
      length: ship.length,
    };
  });

  return fleetDetails;
}
