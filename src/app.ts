import * as THREE from 'three';
import * as dat from 'dat.gui';
import Stats from 'three/addons/libs/stats.module.js';
import { Logger } from './logger';
import { removeObject3D } from './utils';
import { CameraMan } from './camera';
import { Universe } from './universe';
import { AudioManager } from './audio';
import { Effects } from './effects';
import { UI } from './ui';

export class Application {
  private readonly scene: THREE.Scene;
  private readonly universe: Universe;
  private readonly cameraMan: CameraMan;
  private readonly audioManager: AudioManager;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly composer: Effects;
  private readonly stats: Stats;
  private readonly gui: dat.GUI;
  private readonly helpers: THREE.Object3D[] = [];
  private readonly logger: Logger = new Logger('App');
  private selectedConstellationIndex: number = 0;
  private isFocusOnConstellation: boolean = false;
  public settings = {
    debug: true,
  };

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.gui = new dat.GUI();
    this.gui.width = 400;

    this.stats = new Stats();

    this.cameraMan = new CameraMan(this.renderer);
    this.audioManager = new AudioManager(this.cameraMan.camera);

    this.scene = new THREE.Scene();

    this.universe = new Universe(this.scene);
    const selectedConstellation = this.universe.constellations[this.selectedConstellationIndex];
    UI.setConstellationName(selectedConstellation.name);
    this.cameraMan.lookAt(selectedConstellation.position.clone());

    this.composer = new Effects(this.renderer, this.scene, this.cameraMan.camera);

    this.enableDebug();

    this.setupGui();

    document.addEventListener('keydown', (event) => this.onKeyPress(event), false);
  }

  private setupGui() {
    this.gui
      .add(this.logger, 'enabled')
      .name('Debug')
      .onChange((value) => {
        if (value) {
          this.enableDebug();
        } else {
          this.disableDebug();
        }
      });
    this.universe.attachGui(this.gui);
    this.cameraMan.attachGui(this.gui);
    this.audioManager.attachGui(this.gui);
    this.composer.attachGui(this.gui);
  }

  private enableDebug() {
    this.stats.begin();
    document.body.appendChild(this.stats.dom);
    const axesHelper = new THREE.AxesHelper(10);
    this.helpers.push(axesHelper);
    this.scene.add(axesHelper);
  }

  private disableDebug() {
    this.stats.end();
    this.stats.dom.remove();

    while (this.helpers.length > 0) {
      const helper = this.helpers.pop();
      if (helper) {
        removeObject3D(helper);
      }
    }

    this.gui.close();
  }

  private onKeyPress(event: KeyboardEvent) {
    switch (event.key) {
      case 'i':
        this.logger.debug('camera', this.cameraMan.camera.position);
        this.logger.debug('target', this.cameraMan.controls.target);
        break;
      case 't':
        this.logger.debug(this.cameraMan.controls.target);
        break;
      case 'ArrowLeft':
        if (!this.isFocusOnConstellation) {
          this.moveToPreviousConstellation();
        }
        break;
      case 'ArrowRight':
        if (!this.isFocusOnConstellation) {
          this.moveToNextConstellation();
        }
        break;
      case 'ArrowUp':
        this.isFocusOnConstellation = true;
        const target = this.universe.constellations[this.selectedConstellationIndex].position;
        this.cameraMan.zoomInOnConstellation(target);
        break;
      case 'ArrowDown':
        this.isFocusOnConstellation = false;
        this.cameraMan.zoomOutToCenter();
        break;
    }
  }

  private moveToPreviousConstellation() {
    this.selectedConstellationIndex =
      (this.selectedConstellationIndex - 1 + this.universe.constellations.length) %
      this.universe.constellations.length;
    const selectedConstellation = this.universe.constellations[this.selectedConstellationIndex];
    UI.setConstellationName(selectedConstellation.name);
    const target = selectedConstellation.position;
    this.cameraMan.focusOn(target);
  }

  private moveToNextConstellation() {
    this.selectedConstellationIndex =
      (this.selectedConstellationIndex + 1) % this.universe.constellations.length;
    const selectedConstellation = this.universe.constellations[this.selectedConstellationIndex];
    UI.setConstellationName(selectedConstellation.name);
    const target = selectedConstellation.position;
    this.cameraMan.focusOn(target);
  }

  start() {
    this.renderer.setAnimationLoop(() => this.render());
  }

  render() {
    this.universe.update();
    this.gui.updateDisplay();
    this.cameraMan.update();
    if (this.composer.enabled) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.cameraMan.camera);
    }
    this.stats.update();
  }
}
