import { addShipDragListener, addCellDropListener } from './drag-drop';

const wrapper = function createPlayerWrapper(playerIndex) {
  const playerWrapper = document.createElement('div');
  playerWrapper.className = 'player-wrapper';
  playerWrapper.id = playerIndex === 0 ? 'player1' : 'player2';
  return playerWrapper;
};

const heading = function createBoardHeading(playerIndex) {
  const boardHeading = document.createElement('h1');
  boardHeading.textContent = playerIndex === 0 ? 'Human' : 'Computer';
  boardHeading.className = 'player-heading';
  return boardHeading;
};

const boardUI = function createBoard(gameboard) {
  const boardContainer = document.createElement('div');
  boardContainer.className = 'gameboard-container';

  const board = document.createElement('div');
  board.className = 'gameboard';

  gameboard.forEach((row, rowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.className = 'row';

    row.forEach((cell, colIndex) => {
      const cellElement = document.createElement('div');
      cellElement.className = 'cell';
      cellElement.setAttribute('data-row', rowIndex);
      cellElement.setAttribute('data-col', colIndex);
      rowElement.appendChild(cellElement);
    });

    board.appendChild(rowElement);
  });

  boardContainer.appendChild(board);
  return boardContainer;
};

const shipsContainer = function createShips() {
  const sectionContainer = document.createElement('div');
  sectionContainer.className = 'fleet-container';
  const fleetContainer = document.createElement('div');
  fleetContainer.className = 'fleet';

  const shipSizes = [5, 4, 3, 3, 2];

  shipSizes.forEach((size, index) => {
    const shipElement = document.createElement('div');
    shipElement.className = 'ship';
    shipElement.setAttribute('data-size', `${size}`);
    shipElement.setAttribute('data-orientation', 'horizontal');
    shipElement.setAttribute('data-ship-id', `ship-${index}`);

    let partsRemaining = size;
    while (partsRemaining > 0) {
      const shipPart = document.createElement('div');
      shipPart.className = 'ship-part';
      shipElement.appendChild(shipPart);
      partsRemaining -= 1;
    }

    fleetContainer.appendChild(shipElement);
  });

  sectionContainer.appendChild(fleetContainer);
  return sectionContainer;
};

const shipsAndBoard = function createShipsBoardContainer(
  gameboard,
  playerIndex,
) {
  const container = document.createElement('div');
  container.className = 'ships-and-board';
  const ships = shipsContainer();
  const playerBoard = boardUI(gameboard);

  if (playerIndex === 0) {
    container.appendChild(ships);
    container.appendChild(playerBoard);
    return container;
  }

  container.appendChild(playerBoard);
  container.appendChild(ships);
  return container;
};

const attack = function addCellListeners(boardElement, currentGame) {
  const cells = boardElement.querySelectorAll('.cell');

  cells.forEach((cell) => {
    const rowIndex = Number(cell.getAttribute('data-row'));
    const colIndex = Number(cell.getAttribute('data-col'));
    cell.addEventListener('click', () => {
      if (currentGame.gameActive && !cell.hasAttribute('data-attacked')) {
        cell.setAttribute('data-attacked', 'true');
        currentGame.attack([rowIndex, colIndex]);
      }
    });
  });
};

// Exports to interface-manager.js
export default function generateGameboards(players, container, currentGame) {
  const playersContainer = document.createElement('div');
  playersContainer.id = 'players-container';

  players.forEach((player, playerIndex) => {
    const playerWrapper = wrapper(playerIndex);
    const boardHeading = heading(playerIndex);
    const fleetAndBoard = shipsAndBoard(player.gameboard.board, playerIndex);

    playerWrapper.appendChild(boardHeading);
    playerWrapper.appendChild(fleetAndBoard);
    playersContainer.appendChild(playerWrapper);

    if (playerIndex === 0) {
      const ships = playerWrapper.querySelectorAll('.ship');
      const gameboard = playerWrapper.querySelector('.gameboard');
      addShipDragListener(ships, gameboard);

      const cells = playerWrapper.querySelectorAll('.cell');
      addCellDropListener(cells, gameboard);
    }

    // Add listeners on computer's board
    if (playerIndex === 1) {
      const boardElement = playerWrapper.querySelector('.gameboard');
      attack(boardElement, currentGame);
    }
  });

  container.appendChild(playersContainer);
}
