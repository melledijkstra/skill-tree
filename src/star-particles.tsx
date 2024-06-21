import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { Points } from '@react-three/drei';
import { useRef, useMemo } from 'react';

export const StarParticles = ({
  beginRadius,
  endRadius,
  particleCount,
}: {
  beginRadius: number;
  endRadius: number;
  particleCount: number;
}) => {
  const starParticles = useRef<THREE.Points>(null);
  const starPositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // generate random radius
      const randRadius = Math.random() * (endRadius - beginRadius) + beginRadius;
      // phi is an angle
      const phi = Math.acos(2 * Math.random() - 1);
      // theta is also an angle
      const theta = Math.PI * 2 * Math.random();

      // convert spherical coordinates to cartesian coordinates
      const x = randRadius * Math.sin(phi) * Math.cos(theta);
      const y = randRadius * Math.sin(phi) * Math.sin(theta);
      const z = randRadius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return positions;
  }, []);

  useFrame(() => {
    if (starParticles.current) {
      starParticles.current.rotation.y += 0.0001;
    }
  });

  const texture = useLoader(THREE.TextureLoader, 'textures/star_04.png');

  return (
    <Points ref={starParticles} positions={starPositions}>
      <pointsMaterial color={0xffffff} map={texture} size={20} sizeAttenuation transparent />
    </Points>
  );
};
