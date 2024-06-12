import * as THREE from 'three';
import * as dat from 'dat.gui';
import Stats from 'three/addons/libs/stats.module.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { Logger } from './logger';
import { GuiAble, removeObject3D } from './utils';
import { CameraMan } from './camera';
import { Universe } from './universe';
import { AudioManager } from './audio';

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
  private selectedConstellation: number = 0;
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
    const selectedConstellation = this.universe.constellations[this.selectedConstellation];
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

  public start() {
    this.renderer.setAnimationLoop(() => this.render());
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
          this.selectedConstellation =
            (this.selectedConstellation - 1 + this.universe.constellations.length) %
            this.universe.constellations.length;
          const target = this.universe.constellations[this.selectedConstellation].position;
          this.cameraMan.focusOn(target);
        }
        break;
      case 'ArrowRight':
        if (!this.isFocusOnConstellation) {
          this.selectedConstellation =
            (this.selectedConstellation + 1) % this.universe.constellations.length;
          const target = this.universe.constellations[this.selectedConstellation].position;
          this.cameraMan.focusOn(target);
        }
        break;
      case 'ArrowUp':
        this.isFocusOnConstellation = true;
        const target = this.universe.constellations[this.selectedConstellation].position;
        this.cameraMan.zoomInOnConstellation(target);
        break;
      case 'ArrowDown':
        this.isFocusOnConstellation = false;
        this.cameraMan.zoomOutToCenter();
        break;
    }
  }

  public render() {
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

class Effects implements GuiAble {
  private readonly logger: Logger = new Logger('Effects');
  public readonly composer: EffectComposer;
  private renderPass: RenderPass;
  private bloomPass: UnrealBloomPass;
  private outputPass: OutputPass;
  public enabled: boolean = true;

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
    this.logger.debug('setting up postprocessing');
    this.composer = new EffectComposer(renderer);

    this.renderPass = new RenderPass(scene, camera);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.7,
      0.5,
      0.85
    );

    this.outputPass = new OutputPass();

    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(this.outputPass);
    this.logger.debug('postprocessing setup!');
  }

  public attachGui(gui: dat.GUI): void {
    const effectsFolder = gui.addFolder('Effects');

    effectsFolder.add(this, 'enabled').name('Postprocessing');

    const bloomFolder = effectsFolder.addFolder('Bloom');

    bloomFolder
      .add(this.bloomPass, 'threshold', 0.0, 1.0)
      .onChange((value) => (this.bloomPass.threshold = Number(value)));

    bloomFolder
      .add(this.bloomPass, 'strength', 0.0, 3.0)
      .onChange((value) => (this.bloomPass.strength = Number(value)));

    bloomFolder
      .add(this.bloomPass, 'radius', 0.0, 1.0)
      .step(0.01)
      .onChange((value) => (this.bloomPass.radius = Number(value)));
  }

  public render() {
    if (this.enabled) {
      this.composer.render();
    }
  }
}
