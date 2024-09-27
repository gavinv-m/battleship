import Game from '../game';
import Player from '../player';
import Ship from '../ship';
import Gameboard from '../gameboard';

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
  }));
});

let game;
beforeAll(() => {
  game = new Game();
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

    // Verify the total number of calls made to Ship
    expect(Ship).toHaveBeenCalledTimes(10); // 5 ships for Player 1 and 5 for Player 2
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

  test('players receive opponent attacks', () => {
    const p1SpyAttack = jest.spyOn(game.player1.gameboard, 'receiveAttack');
    const p2SpyAttack = jest.spyOn(game.player2.gameboard, 'receiveAttack');
    const possibleAttacksLength = game.computerAttackCoords.length;

    game.attack([5, 9]);
    expect(game.computerAttackCoords.length).toBe(possibleAttacksLength - 1);
    game.attack([6, 6]);
    expect(game.computerAttackCoords.length).toBe(possibleAttacksLength - 2);

    expect(p2SpyAttack).toHaveBeenCalledWith([5, 9]);
    expect(p2SpyAttack).toHaveBeenCalledWith([6, 6]);
    expect(p1SpyAttack).toHaveBeenCalledTimes(2);
  });
});
