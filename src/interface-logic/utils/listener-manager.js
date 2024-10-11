export default class EventListenerManager {
  static shipListeners = [];

  static addShipEventListeners(listenersArray) {
    this.shipListeners = listenersArray;
  }

  static removeShipEventListeners() {
    this.shipListeners.forEach(({ ship, listener }) => {
      ship.removeEventListener('mousedown', listener);
    });
  }
}
