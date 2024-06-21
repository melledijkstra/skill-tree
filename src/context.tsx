import * as THREE from 'three';
import { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import constellationData from './constellations.json';

function arrayToVec2(coords: number[][]): THREE.Vector2[] {
  return coords.map((coord) => {
    const [x, y] = coord;
    return new THREE.Vector2(x, y).multiplyScalar(10);
  });
}

export type Constellation = {
  name: string;
  position: THREE.Vector3;
  coords: THREE.Vector2[];
};

export type UniverseContextType = {
  constellations: Constellation[];
  selectedConstellation: number;
  currentConstellation?: Constellation;
  setSelectedConstellation: React.Dispatch<React.SetStateAction<number>>;
  isFocusOnConstellation: boolean;
};

const UniverseContext = createContext<UniverseContextType>({
  constellations: [],
  selectedConstellation: 0,
  setSelectedConstellation: () => {},
  isFocusOnConstellation: false,
});

export const UniverseProvider = ({ children }: { children: ReactNode }) => {
  const [selectedConstellation, setSelectedConstellation] = useState<number>(0);

  const constellations = useMemo<Constellation[]>(() => {
    const radius = 200;
    const numberOfConstellations = constellationData.length;
    const angleStep = (2 * Math.PI) / numberOfConstellations;

    return constellationData.map((constellation, i) => {
      const angle = i * angleStep;
      const x = radius * Math.sin(-angle);
      const z = radius * Math.cos(-angle);

      const position = new THREE.Vector3(x, 0, z);
      const coords = arrayToVec2(constellation.coords);
      return { name: constellation.name, position, coords };
    });
  }, []);

  return (
    <UniverseContext.Provider
      value={{
        constellations,
        selectedConstellation,
        currentConstellation: constellations[selectedConstellation],
        setSelectedConstellation,
        isFocusOnConstellation: false,
      }}
    >
      {children}
    </UniverseContext.Provider>
  );
};

export const useUniverse = () => {
  return useContext(UniverseContext);
};
