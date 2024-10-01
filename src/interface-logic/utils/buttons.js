export default function createButtons(container) {
  const btnsContainer = document.createElement('div');
  btnsContainer.className = 'btns-container';

  const playButton = document.createElement('button');
  playButton.id = 'play-btn';
  playButton.textContent = 'Play!';
  btnsContainer.appendChild(playButton);
  container.appendChild(btnsContainer);
}
