import * as THREE from 'three';

export function setupLights(scene: THREE.Scene) {
  const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  const helper = new THREE.HemisphereLightHelper(light, 1);
  scene.add(light);
  scene.add(helper);
}
