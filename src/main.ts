import * as THREE from 'three';
import { Application } from './app';

function main() {
  const width = window.innerWidth,
    height = window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  const app = new Application(renderer);

  app.start();
}

main();
