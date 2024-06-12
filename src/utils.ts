import * as THREE from 'three';

export interface GuiAble {
  attachGui(gui: dat.GUI): void;
}

export function removeObject3D(object3D: THREE.Object3D) {
  if (!(object3D instanceof THREE.Object3D)) return false;

  // for better memory management and performance
  if (object3D instanceof THREE.Mesh) {
    object3D.geometry.dispose();

    if (Array.isArray(object3D.material)) {
      // for better memory management and performance
      object3D.material.forEach((material) => material.dispose());
    } else {
      // for better memory management and performance
      object3D.material.dispose();
    }
  }
  object3D.removeFromParent(); // the parent might be the scene or another Object3D, but it is sure to be removed this way
}
