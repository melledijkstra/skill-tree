// import * as THREE from 'three';
// import { useControls } from 'leva';
// import { extend, useFrame, useThree } from '@react-three/fiber';
// import { EffectComposer, RenderPass, UnrealBloomPass } from 'three-stdlib';
// import { useEffect, useMemo, useRef } from 'react';

// extend({ EffectComposer, RenderPass, UnrealBloomPass });

export const PostProcessing = () => {
  // const { enabled, radius, strength, treshold } = useControls('Post Processing', {
  //   enabled: false,
  //   strength: { value: 0.7, min: 0, max: 1 },
  //   radius: { value: 0.5, min: 0, max: 3 },
  //   treshold: { value: 0.85, min: 0, max: 1 },
  // });
  // const composer = useRef<EffectComposer>();
  // const { scene, gl, size, camera } = useThree();
  // const aspect = useMemo(() => new THREE.Vector2(512, 512), []);
  // useEffect(() => void composer.current.setSize(size.width, size.height), [size]);
  // useFrame(() => composer?.current?.render(), 1);
  // return (
  //   <effectComposer ref={composer} args={[gl]}>
  //     <renderPass attachArray="passes" scene={scene} camera={camera} />
  //     <unrealBloomPass attachArray="passes" args={[aspect, 2, 1, 0]} />
  //   </effectComposer>
  // );
};
