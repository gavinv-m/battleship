// Exports to drag-drop.js
export function clear() {
  const cells = document.querySelectorAll('.highlighted');
  cells.forEach((cell) => {
    cell.classList.remove('highlighted');
  });
}

// Exports to drag-drop.js
export function highlight(cell, shipData, gameboard) {
  const { orientation } = shipData;
  const size = Number(shipData.size);
  const validCells = [];
  let rowIndex = Number(cell.getAttribute('data-row'));
  let colIndex = Number(cell.getAttribute('data-col'));

  // Clear previous highlights
  clear();

  for (let i = 0; i < size; i++) {
    const currentCell = gameboard.querySelector(
      `[data-row='${rowIndex}'][data-col='${colIndex}']`,
    );

    if (currentCell !== null) {
      validCells.push(currentCell);

      if (orientation === 'horizontal') {
        colIndex++;
      } else if (orientation === 'vertical') {
        rowIndex++;
      }
    }
  }

  if (validCells.length === size) {
    validCells.forEach((cell) => {
      cell.classList.add('highlighted');
    });
  }
}
