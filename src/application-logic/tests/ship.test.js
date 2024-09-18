import Ship from '../ship';

describe('Ship', () => {
  let ship;
  beforeEach(() => {
    ship = new Ship(3);
  });

  test('should be able to create a ship with a length', () => {
    expect(ship.length).toBe(3);
  });

  test('should start with no hits', () => {
    expect(ship.hits).toBe(0);
  });

  test('should be able to be hit', () => {
    ship.hit();
    expect(ship.hits).toBe(1);
  });

  test('should be able to be hit multiple times', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.hits).toBe(3);
  });

  test('should not be sunk initially', () => {
    expect(ship.isSunk()).toBe(false);
  });

  test('should be sunk when hits equal length', () => {
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test('should not allow hits after being sunk', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(() => ship.hit()).toThrow('Ship is already sunk');
  });
});
