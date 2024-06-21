import * as THREE from 'three';
import { Sphere } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { useControls } from 'leva';
import { useUniverse } from './context';
import { StarParticles } from './star-particles';
import { Constellation } from './constellation';

export const Universe = () => {
  const { constellations } = useUniverse();

  const { showBackground, universeRadius, widthSegments, heightSegments } = useControls(
    'Universe',
    {
      showBackground: false,
      universeRadius: { value: 2000, min: 30, max: 4000 },
      widthSegments: { value: 60, min: 10, max: 100 },
      heightSegments: { value: 40, min: 10, max: 100 },
    },
    { collapsed: true }
  );

  const texture = useLoader(THREE.TextureLoader, 'textures/nebula.jpg');

  return (
    <>
      <Sphere
        visible={showBackground}
        args={[universeRadius, widthSegments, heightSegments]}
        scale={[-1, 1, 1]}
      >
        <meshBasicMaterial attach="material" map={texture} side={THREE.BackSide} />
      </Sphere>
      {constellations.map((constellation, index) => (
        <Constellation key={index} {...constellation} />
      ))}
      <StarParticles beginRadius={250} endRadius={universeRadius} particleCount={2000} />
    </>
  );
};
