const clear = function clearHighlightedCells() {
  const cells = document.querySelectorAll('.highlighted');
  cells.forEach((cell) => {
    cell.classList.remove('highlighted');
  });
};

const highlight = function highlightCells(cell, shipData, gameboard) {
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
};

const canDrop = function isVaidTarget(shipData, gameboard) {
  const highlightedCells = gameboard.querySelectorAll('.highlighted');
  return highlightedCells.length === Number(shipData.size);
};

const drop = function handleDrop(cell, shipData, gameboard, placeShipsOnBoard) {
  const canDropHere = canDrop(shipData, gameboard);
  placeShipsOnBoard(gameboard, shipData);
};

// Exports to generateGameboard.js
export function addShipDragListener(ships) {
  ships.forEach((ship) => {
    let offsetX = 0,
      offsetY = 0;
    let draggedShip = null;
    let draggedShipContainer = null;

    const onMouseMove = (event) => {
      offsetX -= event.movementX;
      offsetY -= event.movementY;
      ship.style.transform = `translate(${-offsetX}px, ${-offsetY}px)`;

      // Temporarily hide the dragged ship
      ship.style.display = 'none';
      const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      // Re-show the dragged ship
      ship.style.display = '';

      if (elemBelow && elemBelow.classList.contains('cell')) {
        const { size, orientation } = ship.dataset;
        const customEvent = new CustomEvent('customdragover', {
          detail: { size, orientation },
        });
        elemBelow.dispatchEvent(customEvent);
      } else {
        clear();
      }
    };

    const onMouseUp = (event) => {
      ship.style.display = 'none';
      const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      ship.style.display = '';

      // Drop on cell
      if (elemBelow && elemBelow.classList.contains('cell')) {
        const { size, orientation } = ship.dataset;
        const dropEvent = new CustomEvent('customdrop', {
          detail: { size, orientation, draggedShip: ship },
        });
        elemBelow.dispatchEvent(dropEvent);
        draggedShip = null;
      }

      // Drop not on cell
      else {
        draggedShip.style.removeProperty('transform');
        draggedShip.remove();
        draggedShipContainer.appendChild(draggedShip);
        (offsetX = 0), (offsetY = 0);
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    ship.addEventListener('mousedown', (event) => {
      draggedShip = event.target.closest('.ship');
      draggedShipContainer = draggedShip.parentNode;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  });
}

export function addCellDropListener(cells, gameboard, placeShipsOnBoard) {
  cells.forEach((cell) => {
    cell.addEventListener('customdragover', (event) => {
      highlight(cell, event.detail, gameboard);
    });
  });

  cells.forEach((cell) => {
    cell.addEventListener('customdrop', (event) => {
      drop(cell, event.detail, gameboard, placeShipsOnBoard);
    });
  });
}
