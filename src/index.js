import './styles/styles.css';
import MainManager from './main-controller';

document.addEventListener('DOMContentLoaded', () => {
  const manager = new MainManager();
  manager.startApplication();
});
