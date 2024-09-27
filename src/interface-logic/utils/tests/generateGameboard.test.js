import generateGameboards from '../generateGameboard';
import Game from '../../../application-logic/game';
import '@testing-library/jest-dom';

let container;
let mockGame;

beforeEach(() => {
  mockGame = new Game();
  mockGame.startGame();

  container = document.createElement('div');
  generateGameboards(mockGame.getPlayers(), container, mockGame);
});

test('generates player boards and adds to container', () => {
  const player1Board = container.querySelector('#player1');
  expect(player1Board.querySelectorAll('.row').length).toBe(10);
  expect(player1Board.querySelectorAll('.cell').length).toBe(100);

  const player2Board = container.querySelector('#player2');
  expect(player2Board.children.length).toBe(2); // Board heading and board
  expect(player2Board.querySelectorAll('.cell').length).toBe(100);
});

test('clicking a cell on the computer board triggers an attack on that cell', () => {
  const board = container.querySelector('#player2 .gameboard');
  const receiveAttackSpy = jest.spyOn(
    mockGame.player2.gameboard,
    'receiveAttack',
  );

  const coordinates = [
    [0, 0],
    [1, 1],
    [2, 2],
    [0, 0], // Repeat attack
  ];

  coordinates.forEach((coord) => {
    const [row, col] = coord;
    const cell = board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.click();
    expect(receiveAttackSpy).toHaveBeenCalledWith([row, col]);
  });

  expect(receiveAttackSpy).toHaveBeenCalledTimes(coordinates.length - 1);
});
