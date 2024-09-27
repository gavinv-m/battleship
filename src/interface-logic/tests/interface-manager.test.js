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
  });

  test('expect generate gameboards to have been called', () => {
    manager.renderGameboards();
    expect(generateGameboards).toHaveBeenCalled();
  });
});
