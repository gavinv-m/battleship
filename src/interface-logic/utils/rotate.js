const rotate = function validateRotation(cells, shipOrientation, gameboard) {
  const cellsLength = cells.length;
  const cellArray = Array.from(cells);
  const validCells = [cellArray[0]];
  let row = Number(cellArray[0].getAttribute('data-row'));
  let col = Number(cellArray[0].getAttribute('data-col'));

  const isHorizontal = shipOrientation === 'horizontal';

  for (let i = 1; i < cellsLength; i++) {
    if (isHorizontal === true) row += 1;
    else col += 1;

    // prettier-ignore
    const newCell = gameboard.querySelector(`[data-row='${row}'][data-col='${col}']`);
    if (!newCell || newCell.classList.contains('occupied')) return null;

    validCells.push(newCell);
  }

  return validCells;
};

export default function rotateShips(cell, gameboard) {
  const shipId = cell.getAttribute('data-ship-id');
  const ship = document.querySelector(`[data-ship-id="${shipId}"]`);
  const shipOrientation = ship.getAttribute('data-orientation');
  const shipCells = gameboard.querySelectorAll(`[data-ship-id="${shipId}"]`);

  const newCells = rotate(shipCells, shipOrientation, gameboard);
  if (newCells !== null) {
    shipCells.forEach((cell) => {
      cell.classList.remove('occupied');
      cell.removeAttribute('data-ship-id');
    });

    newCells.forEach((cell) => {
      cell.classList.add('occupied');
      cell.setAttribute('data-ship-id', shipId);
    });

    // Rotate ship element based on new orientation
    if (shipOrientation === 'horizontal') {
      ship.style.transform = 'rotate(90deg)';
      ship.setAttribute('data-orientation', 'vertical');
    } else {
      ship.style.transform = 'rotate(0deg)';
      ship.setAttribute('data-orientation', 'horizontal');
    }
  }
}
