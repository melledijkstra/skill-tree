import { Canvas } from '@react-three/fiber';
import { UI } from './ui';
import { Universe } from './universe';
import { Stats } from '@react-three/drei';
import { CameraMan } from './camera';
import { AudioManager } from './audio';
import { UniverseProvider } from './context';

export const App = () => {
  return (
    <UniverseProvider>
      <Canvas camera={{ fov: 75, near: 0.1, far: 4000 }}>
        <CameraMan />
        <AudioManager />
        <Universe />
        <Stats />
        {/* <PostProcessing /> */}
      </Canvas>
      <UI />
    </UniverseProvider>
  );
};
