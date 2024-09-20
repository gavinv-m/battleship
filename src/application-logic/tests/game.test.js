import Game from '../game';
import Player from '../player';
import Ship from '../ship';
import Gameboard from '../gameboard';

// Mock the Ship & Gameboard classes globally
jest.mock('../ship');
jest.mock('../gameboard');

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
});
