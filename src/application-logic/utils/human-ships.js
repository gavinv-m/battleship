const coordinates = function getShipCoordinates(shipId, gameboard) {
  let startCoordinates = gameboard.querySelector(`[data-ship-id="${shipId}"]`);
  startCoordinates = [
    Number(startCoordinates.getAttribute('data-row')),
    Number(startCoordinates.getAttribute('data-col')),
  ];
  return startCoordinates;
};

// Exports to coordinates.js
export default function captureHumanPlayerShips() {
  const players = ['player1'];
  const gameboards = document.querySelectorAll('.gameboard');
  const playerShips = [];

  players.forEach((player, index) => {
    const fleet = document.querySelector(`#${player} .fleet`);
    if (fleet !== null) {
      const ships = fleet.querySelectorAll('.ship');
      const playerFleet = Array.from(ships).map((ship) => ({
        size: parseInt(ship.dataset.size),
        orientation: ship.dataset.orientation,
        id: ship.dataset.shipId,
      }));

      // Get coordinates on gameboard interface
      const playerGameboard = index === 0 ? gameboards[0] : gameboards[1];
      const fleetDetails = playerFleet.map((ship) => {
        const start = coordinates(ship.id, playerGameboard);
        return {
          start,
          orientation: ship.orientation,
          length: ship.size,
        };
      });

      playerShips.push(fleetDetails);
    }
  });

  return playerShips;
}
