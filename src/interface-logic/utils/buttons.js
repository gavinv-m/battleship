import validateShipPlacement from './validate-placement';
import showPlacementWarning from './placement-warning';
import removeListeners from './remove-listeners';

export default function createButtons(container) {
  const btnsContainer = document.createElement('div');
  btnsContainer.className = 'btns-container';

  const playButton = document.createElement('button');
  playButton.id = 'play-btn';
  playButton.textContent = 'Play!';
  btnsContainer.appendChild(playButton);

  const resetButton = document.createElement('button');
  resetButton.id = 'reset-btn';
  resetButton.textContent = 'Reset';
  resetButton.style.visibility = 'hidden'; // Initially hidden
  btnsContainer.appendChild(resetButton);

  container.appendChild(btnsContainer);

  playButton.addEventListener('click', () => {
    const areAllShipsPlaced = validateShipPlacement();
    if (areAllShipsPlaced === false) {
      showPlacementWarning();
      return;
    }
    // Remove event listeners for placing and dragging ships
    removeListeners();

    const playEvent = new CustomEvent('startGame'); // to main-controller.js
    document.dispatchEvent(playEvent);

    playButton.style.visibility = 'hidden';
    resetButton.style.visibility = 'visible';
  });

  resetButton.addEventListener('click', () => {
    const resetEvent = new CustomEvent('resetGame'); // to main-controller.js
    document.dispatchEvent(resetEvent);

    resetButton.style.visibility = 'hidden';
    playButton.style.visibility = 'visible';
  });
}
