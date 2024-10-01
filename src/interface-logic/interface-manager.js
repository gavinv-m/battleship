import generateGameboards from './utils/generateGameboard';
import createButtons from './utils/buttons';
import generateXMark from './utils/x-mark';

// Exports to main-controller.js
export default class InterfaceManager {
  constructor() {
    this.container = document.getElementById('main');
    this.currentGame = null;
  }

  renderGameboards(players, currentGame) {
    this.currentGame = currentGame;
    generateGameboards(players, this.container, this.currentGame);
    createButtons(this.container);

    // Attach event listeners for attack events
    this.listenToGameEvents();
  }

  updateBoardUI(player, coordinates, gameboard) {
    const opponentBoardId = player === 'human' ? 'player2' : 'player1';
    const [row, column] = coordinates.map(Number);
    const cell = document.querySelector(
      `#${opponentBoardId} .cell[data-row="${row}"][data-col="${column}"]`,
    );

    // Mark the occupied cells
    const targetCell = gameboard.board[row][column]; // Accessing gameboard's board property
    if (targetCell.occupied === true) {
      cell.classList.add('hit');
    }

    const xMark = generateXMark();
    cell.appendChild(xMark);
  }

  listenToGameEvents() {
    document.addEventListener('attackMade', (event) => {
      const { player, coordinates, gameboard } = event.detail;
      this.updateBoardUI(player, coordinates, gameboard);
    });
  }
}
