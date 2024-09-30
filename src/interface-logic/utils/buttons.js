export default function createButtons(container) {
  const btnsContainer = document.createElement('div');
  btnsContainer.className = 'btns-container';

  const playButton = document.createElement('button');
  playButton.id = 'play-btn';
  btnsContainer.appendChild(playButton);
  container.appendChild(btnsContainer);
}
