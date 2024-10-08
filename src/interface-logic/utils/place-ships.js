export function removeShipOnReDrag(gameboard, shipData) {
  const shipId = shipData.draggedShip.getAttribute('data-ship-id');
  const previousCells = gameboard.querySelectorAll(
    `[data-ship-id="${shipId}"]`,
  );

  if (previousCells !== null) {
    previousCells.forEach((cell) => {
      cell.classList.remove('occupied');
      cell.removeAttribute('data-ship-id');
    });
  }
}

export function placeShipsOnBoard(gameboard, shipData) {
  removeShipOnReDrag(gameboard, shipData);
  const shipId = shipData.draggedShip.getAttribute('data-ship-id');
  const cells = gameboard.querySelectorAll('.highlighted');
  cells.forEach((cell) => {
    cell.classList.remove('highlighted');
    cell.classList.add('occupied');
    cell.setAttribute('data-ship-id', shipId);
  });

  shipData.draggedShip.style.visibility = 'hidden';
}
