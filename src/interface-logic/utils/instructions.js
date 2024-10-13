export default function displayInstructions() {
  const dialog = document.createElement('dialog');
  dialog.id = 'instructions';
  dialog.textContent =
    'Drag ships to board.\nOnce placed, double-click to rotate.';

  document.body.appendChild(dialog);
  dialog.show();

  setTimeout(() => {
    dialog.close();
    dialog.remove();
  }, 3000);
}
