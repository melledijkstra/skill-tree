import * as THREE from 'three';
import type { GUI } from 'dat.gui';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const params = {
  threshold: 0.85,
  strength: 0.7,
  radius: 0.5,
  exposure: 1,
};

export function useEffectComposer(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  gui?: dat.GUI,
  renderTarget?: THREE.WebGLRenderTarget<THREE.Texture> | undefined
): EffectComposer {
  const composer = new EffectComposer(renderer, renderTarget);

  const renderPass = new RenderPass(scene, camera);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0,
    0,
    0
  );
  bloomPass.threshold = params.threshold;
  bloomPass.strength = params.strength;
  bloomPass.radius = params.radius;
  composer.addPass(bloomPass);

  const outputPass = new OutputPass();

  composer.addPass(renderPass);
  composer.addPass(bloomPass);
  composer.addPass(outputPass);

  if (gui) {
    addGuiParams(gui, renderer, bloomPass);
  }

  return composer;
}

export function addGuiParams(gui: GUI, renderer: THREE.WebGLRenderer, bloomPass: UnrealBloomPass) {
  const bloomFolder = gui.addFolder('bloom');

  bloomFolder
    .add(params, 'threshold', 0.0, 1.0)
    .onChange((value) => (bloomPass.threshold = Number(value)));

  bloomFolder
    .add(params, 'strength', 0.0, 3.0)
    .onChange((value) => (bloomPass.strength = Number(value)));

  bloomFolder
    .add(params, 'radius', 0.0, 1.0)
    .step(0.01)
    .onChange((value) => (bloomPass.radius = Number(value)));
}
