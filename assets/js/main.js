import waveInit from './three/three-waves.js'
import projectsInit from './three/three-projects.js'
import menuInit from './menu/menu-controls.js'
import './loading/page-load.js'

function init() {
  document.querySelectorAll('div.three-container').forEach((container) => {
    waveInit(container);
  });
  projectsInit();
  menuInit();
}

window.addEventListener('load', init);
