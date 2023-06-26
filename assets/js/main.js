// Three js entry
import waveInit from './three/three-waves.js'

function init() {
  document.querySelectorAll('div.three-container').forEach((container) => {
    waveInit(container);
  });
}

window.addEventListener('load', init);
