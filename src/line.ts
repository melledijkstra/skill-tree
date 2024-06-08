import * as THREE from 'three';

export const createLine = (start: THREE.Object3D, end: THREE.Object3D): THREE.Line => {
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  const points = [];
  points.push(start.position);
  points.push(end.position);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  return line;
};
