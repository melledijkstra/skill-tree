import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import * as dat from 'dat.gui';
import { createNode } from './node';
import { createLine } from './line';
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
camera.position.z = 10;

const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.0;
controls.panSpeed = 0.8;

const scene = new THREE.Scene();

const geometry = new THREE.SphereGeometry(500, 60, 40);
// invert the geometry on the x-axis so that all of the faces point inward
geometry.scale(-1, 1, 1);

const texture = new THREE.TextureLoader().load('textures/starry-background.jpg');
texture.colorSpace = THREE.SRGBColorSpace;
const material = new THREE.MeshBasicMaterial({ map: texture });

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
const helper = new THREE.HemisphereLightHelper(light, 5);
scene.add(light);
scene.add(helper);

const rootNode = createNode('Skill 1', 0, 0, 0);
const childNode1 = createNode('Skill 1.1', 1, 1, 0);
const childNode2 = createNode('Skill 1.2', -1, 1, 0);
scene.add(rootNode, childNode1, childNode2);

const line1 = createLine(rootNode, childNode1);
const line2 = createLine(rootNode, childNode2);

scene.add(line1, line2);

const gui = new dat.GUI();
gui.width = 500;

// animation
function animate() {
  controls.update();
  renderer.render(scene, camera);
  stats.update();
}

renderer.setAnimationLoop(animate);
