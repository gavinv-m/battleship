import generateGameboards from './utils/generateGameboard';
import createButtons from './utils/buttons';
import generateXMark from './utils/x-mark';
import displayInstructions from './utils/instructions';

// Exports to main-controller.js
export default class InterfaceManager {
  constructor() {
    this.container = document.getElementById('main');
    this.currentGame = null;
    this.attackHandler = null;
  }

  renderGameboards(players, currentGame) {
    this.clearInterface();
    this.currentGame = currentGame;
    generateGameboards(players, this.container, this.currentGame);
    createButtons(this.container);
    displayInstructions();

    // Attach event listeners for attack events
    this.listenToGameEvents();
  }

  setupInstructions() {}

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
    // Renmove previous listeners, avoid replicate x marks
    if (this.attackHandler !== null) {
      document.removeEventListener('attackMade', this.attackHandler);
    }

    this.attackHandler = (event) => {
      const { player, coordinates, gameboard } = event.detail;
      this.updateBoardUI(player, coordinates, gameboard);
    };

    document.addEventListener('attackMade', this.attackHandler);
  }

  clearInterface() {
    // Remove previous gameboard
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
  }
}
