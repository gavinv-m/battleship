export default function placeShipsOnBoard(gameboard, shipData) {
  const cells = gameboard.querySelectorAll('.highlighted');
  cells.forEach((cell) => {
    cell.classList.remove('highlighted');
    cell.classList.add('occupied');
  });

  const shipId = shipData.draggedShip.getAttribute('data-ship-id');
  const shipToHide = document.querySelector(`[data-ship-id="${shipId}"]`); // Potential issue where computer ship is identified
  shipToHide.style.visibility = 'hidden';
}
