import * as THREE from 'three';

export const createSkillNode = (name: string, x: number, y: number, z: number) => {
  const geometry = new THREE.SphereGeometry(1, 10, 10);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(x, y, z);
  sphere.userData = { name };
  return sphere;
};
