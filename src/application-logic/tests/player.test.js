import Player from '../player';
import Gameboard from '../gameboard';

describe('Player class', () => {
  let player;

  beforeEach(() => {
    player = new Player();
  });

  test('should create an instance of Player', () => {
    expect(player).toBeInstanceOf(Player);
  });

  test('should initialize a new Gameboard for each player', () => {
    expect(player.gameboard).toBeInstanceOf(Gameboard);
  });
});
