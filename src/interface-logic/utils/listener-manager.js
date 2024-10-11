export default class EventListenerManager {
  static shipListeners = [];
  static cellListeners = [];

  static addShipEventListeners(listenersArray) {
    this.shipListeners = listenersArray;
  }

  static addCellListeners(listenersArray) {
    this.cellListeners = listenersArray;
  }

  static removeShipEventListeners() {
    this.shipListeners.forEach(({ ship, listener }) => {
      ship.removeEventListener('mousedown', listener);
    });
    this.shipListeners = [];
  }

  static removeCellListeners() {
    // prettier-ignore
    this.cellListeners.forEach(({ cell, mouseDownListener, rotateListener }) => {
        cell.removeEventListener('mousedown', mouseDownListener);
        cell.removeEventListener('dblclick', rotateListener);
      },
    );
    this.cellListeners = [];
  }
}
