// exports to buttons.js
export default function validateShipPlacement() {
  // Occupied cells should be 17
  const occupiedCells = document.querySelectorAll('.occupied');
  return occupiedCells.length === 17;
}
