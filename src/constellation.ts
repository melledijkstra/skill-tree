import * as THREE from 'three';
// import { createLine } from './line';
import { createSkillNode } from './skill-node';

export function setupConstellations(scene: THREE.Scene) {
  const cubes = [];
  const radius = 200;
  const numberOfCubes = 15;
  const angleStep = (2 * Math.PI) / numberOfCubes;
  console.log({
    radius,
    numberOfCubes,
    angleStep,
  });

  for (let i = 0; i < numberOfCubes; i++) {
    const angle = i * angleStep;
    const x = radius * Math.sin(-angle);
    const z = radius * Math.cos(-angle);

    console.log('cube', i, {
      x,
      z,
    });

    const node = createSkillNode(`Skill ${i}`, x, 0, z);

    cubes.push(node);
    scene.add(node);
  }

  return cubes;

  // const rootNode = createSkillNode('Skill 1', 0, 0, -5);
  // const childNode1 = createSkillNode('Skill 1.1', 1, 4, -5);
  // const childNode2 = createSkillNode('Skill 1.2', -3, 2, -5);
  // scene.add(rootNode, childNode1, childNode2);

  // const line1 = createLine(rootNode, childNode1);
  // const line2 = createLine(rootNode, childNode2);

  // scene.add(line1, line2);
}
