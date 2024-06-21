import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';
import { useControls } from 'leva';
import { CameraControls } from '@react-three/drei';
import { useUniverse } from './context';

export enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
  jump = 'jump',
}

export const CameraMan = () => {
  const controls = useRef<CameraControls>(null!);
  const { selectedConstellation, setSelectedConstellation, constellations } = useUniverse();

  const { camera } = useThree();

  const { enabled } = useControls(
    'Camera Man',
    {
      enabled: true,
    },
    { collapsed: true }
  );

  useFrame(() => {
    TWEEN.update();
  });

  useEffect(() => {
    focusOn(constellations[selectedConstellation].position);
  }, [selectedConstellation]);

  const moveToPreviousConstellation = () => {
    setSelectedConstellation((prev) => (prev - 1 + constellations.length) % constellations.length);
  };

  const moveToNextConstellation = () => {
    setSelectedConstellation((prev) => (prev + 1) % constellations.length);
  };

  const onKeyPress = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'i':
          console.debug('camera', {
            position: camera.position,
            rotation: camera.rotation,
          });
          break;
        case 'ArrowLeft':
          moveToPreviousConstellation();
          break;
        case 'ArrowRight':
          moveToNextConstellation();
          break;
        case 'ArrowUp':
          // setIsFocusOnConstellation(true);
          const target = constellations[selectedConstellation].position;
          console.log('target', target);
          zoomInOnConstellation(target);
          break;
        case 'ArrowDown':
          // setIsFocusOnConstellation(false);
          zoomOutToCenter();
          break;
      }
    },
    [selectedConstellation]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyPress);
    return () => {
      document.removeEventListener('keydown', onKeyPress);
    };
  }, [onKeyPress]);

  const focusOn = (target: THREE.Vector3) => {
    const { current } = controls;
    current.lookInDirectionOf(...target.toArray(), true);
  };

  const zoomInOnConstellation = (target: THREE.Vector3) => {
    const offsetDistance = 40; // Distance to stay before the cube

    // Calculate the direction from the camera to the target cube
    const newTarget = target.clone().setY(target.y);
    const direction = new THREE.Vector3()
      .subVectors(newTarget, controls.current.camera.position)
      .normalize();

    // Calculate the new camera position just before the cube
    const newCameraPosition = new THREE.Vector3().addVectors(
      target,
      direction.multiplyScalar(-offsetDistance)
    );

    controls.current.setLookAt(...newCameraPosition.toArray(), ...target.toArray(), true);
  };

  const zoomOutToCenter = () => {
    if (controls.current.camera.position.distanceTo(new THREE.Vector3(0, 0, 0)) === 0) {
      return;
    }
    // moves the camera position back to the center
    controls.current.moveTo(0, 0, 0, true);
  };

  return <CameraControls makeDefault ref={controls} enabled={enabled} />;
};
