export default function hideShip(length) {
  // prettier-ignore
  const computerShip = document.querySelector(`#player2 [data-size='${length}']`);

  // Selecting second ship of size 3
  if (length === 3 && computerShip.style.visibility === 'hidden') {
    const secondShip = computerShip.nextElementSibling;
    secondShip.style.visibility = 'hidden';
  }

  computerShip.style.visibility = 'hidden';
}
