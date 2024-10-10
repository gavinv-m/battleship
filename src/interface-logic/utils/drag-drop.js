import rotateShips from './rotate';
import drop from './drop-logic';
import { removeShipOnReDrag } from './place-ships';
import { clear, highlight } from './highlight';

// Exports to generateGameboard.js
export function addShipDragListener(ships, gameboard) {
  ships.forEach((ship) => {
    let startX = 0;
    let startY = 0;
    let newX = 0;
    let newY = 0;
    let draggedShip = null;
    let draggedShipContainer = null;

    const updatePosition = (event) => {
      newX = startX - event.clientX;
      newY = startY - event.clientY;

      startX = event.clientX;
      startY = event.clientY;

      draggedShip.style.top = startY + 'px';
      draggedShip.style.left = startX + 'px';
    };

    const getElementBelow = (event) => {
      // Temporarily hide the dragged ship to get cell below
      draggedShip.style.display = 'none';
      const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      // Re-show the dragged ship
      draggedShip.style.display = '';
      return elemBelow;
    };

    const resetShipPosition = () => {
      draggedShip.style.position = '';
      draggedShip.style.top = '';
      draggedShip.style.left = '';
      draggedShip.style.transform = '';
      draggedShip.setAttribute('data-orientation', 'horizontal');

      draggedShip.remove();
      draggedShipContainer.appendChild(draggedShip);
      draggedShip.style.opacity = '1';

      startX = 0;
      startY = 0;
      newX = 0;
      newY = 0;
    };

    const onMouseUp = (event) => {
      const elemBelow = getElementBelow(event);
      let validDrop = false;

      // Drop on cell valid or invalid
      if (elemBelow && elemBelow.classList.contains('cell')) {
        const { size, orientation } = draggedShip.dataset;

        // prettier-ignore
        validDrop = drop({ size, orientation, draggedShip: ship }, gameboard);
        if (validDrop === false) {
          resetShipPosition();
        }
      }

      // Drop not on cell
      else {
        removeShipOnReDrag(gameboard, { draggedShip: ship });
        resetShipPosition();
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (event) => {
      document.addEventListener('mouseup', onMouseUp);

      updatePosition(event);

      draggedShip.style.opacity = '0.5';
      const elemBelow = getElementBelow(event);

      if (elemBelow && elemBelow.classList.contains('cell')) {
        draggedShip.style.opacity = '0';
        const { size, orientation } = ship.dataset;
        const customEvent = new CustomEvent('customdragover', {
          detail: { size, orientation },
        });
        elemBelow.dispatchEvent(customEvent);
      } else {
        // prettier-ignore
        if (draggedShip.getAttribute('data-orientation') === 'vertical') draggedShip.style.opacity = '0'; // Vertical positioning not aligning with mouse
        clear();
      }
    };

    ship.addEventListener('mousedown', (event) => {
      draggedShip = event.target.closest('.ship');
      draggedShipContainer = draggedShip.parentNode;

      // Positioning:
      draggedShip.style.position = 'absolute';
      startX = event.clientX;
      startY = event.clientY;

      document.addEventListener('mousemove', onMouseMove);
    });
  });
}

// Exports to generateGameboard.js
export function addCellDropListener(cells, gameboard) {
  cells.forEach((cell) => {
    cell.addEventListener('customdragover', (event) => {
      highlight(cell, event.detail, gameboard);
    });

    // Trigger mousedown or double click
    let clickTimeOut = null;

    cell.addEventListener('mousedown', () => {
      if (clickTimeOut === null) {
        clickTimeOut = setTimeout(() => {
          if (cell.classList.contains('occupied')) {
            const shipId = cell.getAttribute('data-ship-id');
            const ship = document.querySelector(`[data-ship-id="${shipId}"]`);
            if (ship !== null) {
              ship.style.visibility = 'visible';
              const mousedownEvent = new MouseEvent('mousedown');
              ship.dispatchEvent(mousedownEvent);
            }
          }
          clickTimeOut = null;
        }, 200);
      }
    });

    cell.addEventListener('dblclick', () => {
      // Don't trigger mousedown event
      if (clickTimeOut !== null) {
        clearTimeout(clickTimeOut);
        clickTimeOut = null;
      }

      if (cell.classList.contains('occupied')) {
        rotateShips(cell, gameboard);
      }
    });
  });
}
