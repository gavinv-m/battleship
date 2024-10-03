import generateGameboards from '../utils/generateGameboard';
import InterfaceManager from '../interface-manager';

jest.mock('../utils/generateGameboard', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Interface Manager', () => {
  let manager;
  beforeEach(() => {
    manager = new InterfaceManager();

    manager.container = {
      firstChild: null,
      removeChild: jest.fn(),
      appendChild: jest.fn(),
    };
  });

  test('expect generate gameboards to have been called', () => {
    manager.renderGameboards();
    expect(generateGameboards).toHaveBeenCalled();
  });
});
