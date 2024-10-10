export default function showPlacementWarning() {
  const dialog = document.createElement('dialog');
  dialog.id = 'placement-warning';
  dialog.textContent = 'Place ships to start';

  document.body.appendChild(dialog);
  dialog.show();

  setTimeout(() => {
    dialog.close();
    dialog.remove();
  }, 600);
}
