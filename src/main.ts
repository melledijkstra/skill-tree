import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import * as dat from 'dat.gui';
import Stats from 'three/addons/libs/stats.module.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { setupConstellations } from './constellation';
import { useEffectComposer } from './effect';

// import skills from './skills.json';

const width = window.innerWidth,
  height = window.innerHeight;

// Camera, lights, action!
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const stats = new Stats();
document.body.appendChild(stats.dom);

const camera = new THREE.PerspectiveCamera(75, width / height);

const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.0;
controls.panSpeed = 0.8;
controls.enabled = true;

const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

const geometry = new THREE.SphereGeometry(500, 60, 40);
// invert the geometry on the x-axis so that all of the faces point inward
geometry.scale(-1, 1, 1);

const texture = new THREE.TextureLoader().load('textures/starry-background.jpg');
texture.colorSpace = THREE.SRGBColorSpace;
const material = new THREE.MeshBasicMaterial({ map: texture });

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// setupLights(scene);

const cubes = setupConstellations(scene);
let cubeFocusIndex = 0;
controls.target.copy(cubes[cubeFocusIndex].position);

const gui = new dat.GUI();
gui.width = 500;
const controlFolder = gui.addFolder('controls');
controlFolder.add(controls, 'enabled');

document.addEventListener('keydown', onKeyPress);

function onKeyPress(event: KeyboardEvent) {
  switch (event.key) {
    case 'i':
      console.log('camera', camera.position);
      break;
    case 'r':
      console.log('renderer', renderer.toneMappingExposure);
      break;
    case 'l':
      console.log('looking at 0,0,0');
      controls.target = new THREE.Vector3(0, 0, 0);
      break;
    case 't':
      console.log(controls.target);
      break;
    case 'ArrowLeft':
      cubeFocusIndex = (cubeFocusIndex - 1 + cubes.length) % cubes.length;
      focusOnCurrentCube();
      break;
    case 'ArrowRight':
      cubeFocusIndex = (cubeFocusIndex + 1) % cubes.length;
      focusOnCurrentCube();
      break;
    case 'ArrowUp':
      zoomInOnConstellation();
      break;
    case 'ArrowDown':
      if (camera.position.distanceTo(new THREE.Vector3(0, 0, 0)) !== 0) {
        zoomOutToCenter();
      }
      break;
  }
}

function zoomInOnConstellation() {
  const oldEnabledValue = controls.enabled;
  controls.enabled = false;
  const target = cubes[cubeFocusIndex];
  const offsetDistance = 15; // Distance to stay before the cube

  // Calculate the direction from the camera to the target cube
  const direction = new THREE.Vector3().subVectors(target.position, camera.position).normalize();

  // Calculate the new camera position just before the cube
  const newCameraPosition = new THREE.Vector3().addVectors(
    target.position,
    direction.multiplyScalar(-offsetDistance)
  );

  const from = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
  const to = { x: newCameraPosition.x, y: newCameraPosition.y, z: newCameraPosition.z };

  console.log('zooming in on', controls.target);
  console.log('setting up animation');
  new TWEEN.Tween(from)
    .to(to, 800)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onStart(() => {
      console.log('animation start!');
    })
    .onUpdate((delta) => {
      camera.position.set(delta.x, delta.y, delta.z);
    })
    .onComplete(() => {
      console.log('animation complete!');
      controls.enabled = oldEnabledValue;
    })
    .start();
}

function zoomOutToCenter() {
  const oldEnabledValue = controls.enabled;
  controls.enabled = false;

  // Calculate the new camera position just before the cube
  const newCameraPosition = new THREE.Vector3(0, 0, 0);

  console.log('zooming out back to center');
  console.log('setting up animation');
  new TWEEN.Tween(camera.position)
    .to(newCameraPosition, 800)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onStart(() => {
      console.log('animation start!');
    })
    .onUpdate((delta) => {
      camera.position.set(delta.x, delta.y, delta.z);
    })
    .onComplete(() => {
      console.log('animation complete!');
      controls.enabled = oldEnabledValue;
    })
    .start();
}

function focusOnCurrentCube() {
  const oldEnabledValue = controls.enabled;
  controls.enabled = false;
  const newTarget = cubes[cubeFocusIndex];
  console.log('focussing on', cubeFocusIndex, newTarget.position);
  const to = {
    x: newTarget.position.x,
    y: 0,
    z: newTarget.position.z,
  };
  console.log('setting up animation');
  new TWEEN.Tween(controls.target)
    .to(to, 800)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onStart(() => {
      console.log('animation start!');
    })
    .onUpdate((delta) => {
      console.log('updating camera!');
      // camera.position.set(from.x, from.y, from.z);
      controls.target.copy(delta);
      controls.update();
    })
    .onComplete(() => {
      console.log('animation complete!');
      controls.enabled = oldEnabledValue;
    })
    .start();
}

const composer = useEffectComposer(renderer, scene, camera, gui);
const toneMappingFolder = gui.addFolder('tone mapping');

const params = {
  exposure: 0.7,
};

toneMappingFolder
  .add(params, 'exposure', 0.1, 2)
  .onChange((value) => (renderer.toneMappingExposure = Math.pow(value, 4.0)));

// animation
function animate() {
  TWEEN.update();
  controls.update();
  gui.updateDisplay();
  composer.render();
  stats.update();
}

renderer.setAnimationLoop(animate);
