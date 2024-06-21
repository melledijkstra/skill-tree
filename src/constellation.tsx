import * as THREE from 'three';
import { Line, Sphere } from '@react-three/drei';
import { FakeGlowMaterial } from './3rd-party/FakeGlowMaterial';
import { useMemo } from 'react';

const Node = ({ name, position }: { name: string; position: THREE.Vector3 }) => {
  return (
    <Sphere args={[1, 10, 10]} position={position} userData={{ name }}>
      <FakeGlowMaterial falloff={2} glowColor={0xffff00} glowInternalRadius={0.5} />
      {/* <meshBasicMaterial attach="material" color={0xffff00} /> */}
    </Sphere>
  );
};

export const Constellation = ({
  name,
  position,
  coords,
}: {
  name: string;
  position: THREE.Vector3;
  coords: THREE.Vector2[];
}) => {
  const nodes = useMemo<THREE.Vector3[]>(() => {
    const startNode = new THREE.Vector3().copy(position);
    const nodePositions = [startNode];

    let prevStar = startNode;

    for (const coord of coords) {
      const y = prevStar.y + coord.y;
      const x = prevStar.x + coord.x;
      const z = prevStar.z;
      const star = new THREE.Vector3(x, y, z);
      nodePositions.push(star);
      prevStar = star;
    }

    return nodePositions;
  }, []);

  return (
    <>
      {nodes.map((node, index) => (
        <Node key={index} name={name} position={node} />
      ))}
      <Line points={nodes} color={0xffffff} />
    </>
  );
};
