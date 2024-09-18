import Gameboard from '../gameboard';
import Ship from '../ship';

let gameboard;
beforeEach(() => {
  gameboard = new Gameboard();
});

describe('Gameboard initialisation', () => {
  test('initialise a board of size 10x10', () => {
    const data = {
      occupied: false,
      ship: null,
      hitCount: 0,
    };

    expect(gameboard.board[0][0]).toBeDefined();
    expect(gameboard.board[0][0]).toEqual(data);
    expect(gameboard.board[9][9]).toBeDefined();
    expect(gameboard.board[9][9]).toEqual(data);
  });
});

describe('Placing at co-ordinates', () => {
  const size = 3;
  let ship;

  beforeEach(() => {
    ship = new Ship(size);
  });

  test('placing a ship at valid horizontal co-ordinates', () => {
    gameboard.placeShip(ship, [0, 0], 'horizontal');

    for (let i = 0; i < size; i++) {
      expect(gameboard.board[0][i].occupied).toBeTruthy();
      expect(gameboard.board[0][i].ship).toEqual(ship);
      expect(gameboard.board[0][i].hitCount).toBe(0);
    }
  });

  test('placing a ship at valid vertical co-ordinates', () => {
    gameboard.placeShip(ship, [1, 0], 'vertical');

    for (let i = 1; i < size; i++) {
      expect(gameboard.board[i][0].occupied).toBeTruthy();
      expect(gameboard.board[i][0].ship).toEqual(ship);
      expect(gameboard.board[i][0].hitCount).toBe(0);
    }
  });

  test('placing a ship at occupied co-ordinates', () => {
    gameboard.placeShip(ship, [0, 0], 'horizontal'); // [0, 0] to [0, 2]

    const submarine = new Ship(size);
    gameboard.placeShip(submarine, [0, 2], 'horizontal'); // [0, 2] to [0, 4]
    expect(gameboard.board[0][2]).toBeTruthy();
    expect(gameboard.board[0][3].occupied).toBeFalsy();
  });

  test('placing a ship outside the grid row bounds', () => {
    gameboard.placeShip(ship, [-1, 0], 'vertical');
    for (let i = 0; i < size; i++) {
      expect(gameboard.board[0][i].occupied).toBeFalsy();
      expect(gameboard.board[0][i].ship).toBeFalsy();
    }

    const submarine = new Ship(size);
    gameboard.placeShip(submarine, [8, 0], 'vertical'); // [8, 0] to [10, 0]
    for (let i = 0; i < size; i++) {
      expect(gameboard.board[0][i].occupied).toBeFalsy();
      expect(gameboard.board[0][i].ship).toBeFalsy();
    }
  });

  test('placing a ship outside the grid column bounds', () => {
    gameboard.placeShip(ship, [0, -1], 'horizontal');
    for (let i = 0; i < size; i++) {
      expect(gameboard.board[0][i].occupied).toBeFalsy();
      expect(gameboard.board[0][i].ship).toBeFalsy();
    }

    const submarine = new Ship(size);
    gameboard.placeShip(submarine, [0, 8], 'horizontal'); // [0, 8] to [0, 10]
    for (let i = 0; i < size; i++) {
      expect(gameboard.board[0][i].occupied).toBeFalsy();
      expect(gameboard.board[0][i].ship).toBeFalsy();
    }
  });
});
