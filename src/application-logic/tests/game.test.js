import Game from '../game';
import Player from '../player';
import Ship from '../ship';
import Gameboard from '../gameboard';
import Coordinates from '../coordinates';

// Mock the Ship & Gameboard classes globally
jest.mock('../ship', () => {
  return jest.fn().mockImplementation((length) => ({
    length,
    hit: jest.fn(),
    isSunk: jest.fn().mockReturnValue(false),
  }));
});

jest.mock('../gameboard', () => {
  return jest.fn().mockImplementation(() => ({
    board: Array(10)
      .fill(null)
      .map(() => Array(10).fill(null)),

    placeShip: jest.fn(),
    receiveAttack: jest.fn(),
    missedShots: [],
    fleet: [
      { length: 5, sunk: false },
      { length: 4, sunk: false },
      { length: 3, sunk: false },
      { length: 3, sunk: false },
      { length: 2, sunk: false },
    ],
    areAllShipsSunk: jest.fn(function () {
      return this.fleet.every((ship) => ship.sunk === true);
    }),
  }));
});

// prettier-ignore
jest.mock('../coordinates', () => {
  return jest.fn().mockImplementation(() => ({
    getPlayerShipPlacements: jest.fn().mockReturnValue([
      // Player 1's ship placements
      [
        { name: 'Carrier', start: [0, 0], orientation: 'horizontal', length: 5 },
        { name: 'Battleship', start: [1, 2], orientation: 'vertical', length: 4 },
        { name: 'Cruiser', start: [4, 5], orientation: 'horizontal', length: 3 },
        { name: 'Submarine', start: [7, 8], orientation: 'vertical', length: 3 },
        { name: 'Destroyer', start: [3, 3], orientation: 'horizontal', length: 2 },
      ],
      // Player 2's ship placements
      [
        { name: 'Carrier', start: [5, 9], orientation: 'vertical', length: 5 },
        { name: 'Battleship', start: [6, 2], orientation: 'horizontal', length: 4 },
        { name: 'Cruiser', start: [2, 4], orientation: 'vertical', length: 3 },
        { name: 'Submarine', start: [5, 0], orientation: 'horizontal', length: 3 },
        { name: 'Destroyer', start: [8, 2], orientation: 'vertical', length: 2 },
      ],
    ]),
  }));
});

let game;
beforeEach(() => {
  game = new Game();
  game.gameActive = true;
  game.startGame();
});

describe('Game initialization', () => {
  test('expect playersto be instances of Player ', () => {
    expect(game.player1).toBeInstanceOf(Player);
    expect(game.player2).toBeInstanceOf(Player);
  });
});

describe('Ships created and placed on board', () => {
  test('create a new instance of Ship for each ship', () => {
    // Verify that Ship was called with the correct lengths
    expect(Ship).toHaveBeenCalledWith(5); // Player 1's first ship (Carrier)
    expect(Ship).toHaveBeenCalledWith(4); // Player 1's second ship (Battleship)

    expect(Ship).toHaveBeenCalledWith(5); // Player 2's first ship (Carrier)
    expect(Ship).toHaveBeenCalledWith(4); // Player 2's second ship (Battleship)
  });

  test('ships created on gameboard', () => {
    const placeShipSpyP1 = jest.spyOn(game.player1.gameboard, 'placeShip');
    const placeShipSpyP2 = jest.spyOn(game.player2.gameboard, 'placeShip');

    expect(placeShipSpyP1).toHaveBeenCalledWith(
      expect.anything(),
      [0, 0],
      'horizontal',
    );

    expect(placeShipSpyP2).toHaveBeenCalledWith(
      expect.anything(),
      [5, 9],
      'vertical',
    );
  });
});

describe('Simulate attacks and responses', () => {
  let p1SpyAttack;
  let p2SpyAttack;

  beforeEach(() => {
    p1SpyAttack = jest.spyOn(game.player1.gameboard, 'receiveAttack');
    p2SpyAttack = jest.spyOn(game.player2.gameboard, 'receiveAttack');
  });

  afterEach(() => {
    p1SpyAttack.mockRestore();
    p2SpyAttack.mockRestore();
  });

  test('players receive opponent attacks', () => {
    const possibleAttacksLength = game.computerAttackCoords.length;

    game.attack([5, 9]);
    expect(game.computerAttackCoords.length).toBe(possibleAttacksLength - 1);
    game.attack([6, 6]);
    expect(game.computerAttackCoords.length).toBe(possibleAttacksLength - 2);

    expect(p2SpyAttack).toHaveBeenCalledWith([5, 9]);
    expect(p2SpyAttack).toHaveBeenCalledWith([6, 6]);
    expect(p1SpyAttack).toHaveBeenCalledTimes(2);
  });

  test('human wins', () => {
    const fleetSize = game.player2.gameboard.fleet.length;

    // Sink all except last ship
    game.player2.gameboard.fleet.forEach((ship, index) => {
      if (index <= fleetSize - 2) {
        ship.sunk = true;
      }
    });

    expect(game.player2.gameboard.areAllShipsSunk()).toBe(false);

    // Sink last ship
    game.player2.gameboard.fleet[fleetSize - 1].sunk = true;
    expect(game.player2.gameboard.areAllShipsSunk()).toBe(true);

    game.gameWon = true;
    expect(game.gameWon).toBe(true);

    // Try to attack again, receiveAttack shouldn't be called
    game.attack([1, 1]);
    expect(p2SpyAttack).not.toHaveBeenCalled();
  });

  test('computer wins', () => {
    const fleetSize = game.player1.gameboard.fleet.length;

    // Sink all except last ship
    game.player1.gameboard.fleet.forEach((ship, index) => {
      if (index <= fleetSize - 2) {
        ship.sunk = true;
      }
    });

    expect(game.player1.gameboard.areAllShipsSunk()).toBe(false);

    // Sink last ship
    game.player1.gameboard.fleet[fleetSize - 1].sunk = true;
    expect(game.player1.gameboard.areAllShipsSunk()).toBe(true);

    game.gameWon = true;
    expect(game.gameWon).toBe(true);

    // ReceiveAttack shouldn't be called
    game.attack([1, 1]);
    expect(p1SpyAttack).not.toHaveBeenCalled();
  });
});
