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

const attack = function addCellListeners(gameboard, boardElement, currentGame) {
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
    const board = boardUI(player.gameboard.board);

    playerWrapper.appendChild(boardHeading);
    playerWrapper.appendChild(board);
    playersContainer.appendChild(playerWrapper);

    // Add listeners on computer's board
    if (playerIndex === 1) {
      attack(player.gameboard, board, currentGame);
    }
  });

  container.appendChild(playersContainer);
}
