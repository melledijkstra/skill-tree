import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { Logger } from './logger';
import { GuiAble } from './utils';

export class Effects implements GuiAble {
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
