import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { GuiAble } from './utils';

class Node {
  public sphere: THREE.Mesh;

  constructor(
    public name: string,
    public position: THREE.Vector3
  ) {
    const geometry = new THREE.SphereGeometry(1, 10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.sphere = new THREE.Mesh(geometry, material);
    this.sphere.position.copy(position);
    this.sphere.userData = { name };
  }
}

class Constellation {
  public nodes: Node[] = [];
  public lines: THREE.Line[] = [];

  constructor(
    public name: string,
    public scene: THREE.Scene,
    public position: THREE.Vector3
  ) {
    this.generateConstellation();
  }

  private generateConstellation() {
    const startNode = new Node('Start', this.position);
    this.nodes.push(startNode);
    this.scene.add(startNode.sphere);

    const amount = Math.floor(Math.random() * 9) + 2;

    for (let i = 1; i < amount; i++) {
      const y = Math.random() * 30 + i * 10;
      const x = this.position.x + Math.random() * 40;
      const z = this.position.z + Math.random() * 10;

      const node = new Node(`Skill ${i}`, new THREE.Vector3(x, y, z));
      this.nodes.push(node);
      this.scene.add(node.sphere);
    }

    // create a line between each node
    const points = this.nodes.map((node) => node.position);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xffffff }));
    this.scene.add(line);
  }
}

export class Universe implements GuiAble {
  private readonly scene: THREE.Scene;
  private mesh: THREE.Mesh;
  public readonly constellations: Constellation[] = [];
  private settings = {
    radius: 600,
    widthSegments: 60,
    heightSegments: 40,
  };

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    const backgroundMesh = this.setupBackground();
    this.mesh = backgroundMesh;
    this.setupConstellations();
  }

  private setupBackground() {
    const geometry = this.generateGeometry();

    const texture = new THREE.TextureLoader().load('textures/starry-background.jpg');
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    return mesh;
  }

  private setupConstellations() {
    const radius = 200;
    const numberOfConstellations = 15;
    const angleStep = (2 * Math.PI) / numberOfConstellations;

    for (let i = 0; i < numberOfConstellations; i++) {
      const angle = i * angleStep;
      const x = radius * Math.sin(-angle);
      const z = radius * Math.cos(-angle);

      const position = new THREE.Vector3(x, 0, z);
      const constellation = new Constellation(`Constellation ${i}`, this.scene, position);

      this.constellations.push(constellation);
    }
  }

  private generateGeometry() {
    const geo = new THREE.SphereGeometry(
      this.settings.radius,
      this.settings.widthSegments,
      this.settings.heightSegments
    );
    // invert the geometry on the x-axis so that all of the faces point inward
    geo.scale(-1, 1, 1);
    return geo;
  }

  updateGeometry = () => {
    this.mesh.geometry.dispose();
    this.mesh.geometry = this.generateGeometry();
  };

  attachGui(gui: GUI): void {
    const folder = gui.addFolder('Universe');
    folder.add(this.mesh, 'visible').name('Visible');
    folder
      .add(this.settings, 'radius', 300, 2000)
      .name('Universe Scale')
      .onChange(this.updateGeometry);
  }
}
