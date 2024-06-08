import * as THREE from 'three';

export const createNode = (name: string, x: number, y: number, z: number) => {
  const geometry = new THREE.SphereGeometry(0.2, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(x, y, z);
  sphere.userData = { name };
  return sphere;
};
