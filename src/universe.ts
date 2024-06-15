import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { GuiAble } from './utils';
import constellations from './constellations.json';

function arrayToVec2(coords: number[][]): THREE.Vector2[] {
  return coords.map((coord) => {
    const [x, y] = coord;
    return new THREE.Vector2(x, y).multiplyScalar(10);
  });
}

function hexStringToNumber(hexColor: string) {
  // Remove the leading '#' or '0x' if it exists
  // Convert the hexadecimal string to a number
  return parseInt(hexColor.replace('0x', '').replace('#', ''), 16);
}

class Node {
  public sphere: THREE.Mesh;

  constructor(
    public name: string,
    public position: THREE.Vector3,
    public color: THREE.ColorRepresentation = 0xffff00
  ) {
    const geometry = new THREE.SphereGeometry(1, 10, 10);
    const material = new THREE.MeshBasicMaterial({ color: color });
    this.sphere = new THREE.Mesh(geometry, material);
    this.sphere.position.copy(position);
    this.sphere.userData = { name };
  }
}

class Constellation {
  public nodes: Node[] = [];
  public lines: THREE.Line[] = [];

  constructor(
    public scene: THREE.Scene,
    public name: string,
    public position: THREE.Vector3,
    public coords: THREE.Vector2[],
    public color: THREE.ColorRepresentation = 0xffff00
  ) {
    this.generateConstellation();
  }

  private generateConstellation() {
    const startNode = new Node('Start', this.position, this.color);
    this.nodes.push(startNode);
    this.scene.add(startNode.sphere);

    let prevStar = startNode;

    for (const coord of this.coords) {
      const y = prevStar.position.y + coord.y;
      const x = prevStar.position.x + coord.x;
      const z = prevStar.position.z;
      const star = new Node('Star', new THREE.Vector3(x, y, z), this.color);
      this.nodes.push(star);
      this.scene.add(star.sphere);
      prevStar = star;
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
  public constellations: Constellation[] = [];
  private settings = {
    radius: 2000,
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
    const numberOfConstellations = constellations.length;
    const angleStep = (2 * Math.PI) / numberOfConstellations;

    this.constellations = [];

    for (const [i, constellation] of constellations.entries()) {
      const angle = i * angleStep;
      const x = radius * Math.sin(-angle);
      const z = radius * Math.cos(-angle);

      const position = new THREE.Vector3(x, 0, z);
      const coords = arrayToVec2(constellation.coords);
      const color = hexStringToNumber(constellation.color);

      this.constellations.push(
        new Constellation(this.scene, constellation.name, position, coords, color)
      );
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
      .add(this.settings, 'radius', 300, 4000)
      .name('Universe Scale')
      .onChange(this.updateGeometry);
  }
}
