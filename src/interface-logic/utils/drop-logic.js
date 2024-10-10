import { placeShipsOnBoard, removeShipOnReDrag } from './place-ships';

const canDrop = function isVaidTarget(shipData, gameboard) {
  const highlightedCells = gameboard.querySelectorAll('.highlighted');
  return highlightedCells.length === Number(shipData.size);
};

export default function drop(shipData, gameboard) {
  const canDropHere = canDrop(shipData, gameboard);
  if (canDropHere === true) {
    placeShipsOnBoard(gameboard, shipData);
    return true;
  }
  removeShipOnReDrag(gameboard, shipData);
  return false;
}
