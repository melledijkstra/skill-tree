import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { Logger } from './logger';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { GUI } from 'dat.gui';
import { GuiAble } from './utils';

export class CameraMan implements GuiAble {
  public readonly camera: THREE.PerspectiveCamera;
  public readonly controls: TrackballControls;
  private readonly logger: Logger = new Logger('CameraMan');

  constructor(renderer: THREE.WebGLRenderer) {
    const width = window.innerWidth,
      height = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 4000);

    this.controls = new TrackballControls(this.camera, renderer.domElement);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.0;
    this.controls.panSpeed = 0.8;
  }

  public update() {
    TWEEN.update();
    this.controls.update();
  }

  public lookAt(target: THREE.Vector3) {
    this.controls.target = target;
  }

  public focusOn(target: THREE.Vector3) {
    const oldEnabledValue = this.controls.enabled;
    this.controls.enabled = false;

    this.logger.debug('setting up animation', {
      from: this.controls.target,
      to: target,
    });

    new TWEEN.Tween(this.controls.target)
      .to(target, 800)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(() => {
        this.controls.enabled = oldEnabledValue;
      })
      .start();
  }

  public zoomInOnConstellation(target: THREE.Vector3) {
    const oldEnabledValue = this.controls.enabled;
    this.controls.enabled = false;
    const offsetDistance = 40; // Distance to stay before the cube

    // Calculate the direction from the camera to the target cube
    const newTarget = target.clone().setY(target.y - 40);
    const direction = new THREE.Vector3().subVectors(newTarget, this.camera.position).normalize();

    // Calculate the new camera position just before the cube
    const newCameraPosition = new THREE.Vector3().addVectors(
      target,
      direction.multiplyScalar(-offsetDistance)
    );

    this.logger.debug('zooming in on', this.controls.target);
    this.logger.debug('setting up animation');
    new TWEEN.Tween(this.camera.position)
      .to(newCameraPosition, 800)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(() => {
        this.logger.debug('animation complete!');
        this.controls.enabled = oldEnabledValue;
      })
      .start();

    new TWEEN.Tween(this.controls.target)
      .to({ y: target.y + 20 }, 800)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();
  }

  public zoomOutToCenter() {
    if (this.camera.position.distanceTo(new THREE.Vector3(0, 0, 0)) === 0) {
      return;
    }
    const oldEnabledValue = this.controls.enabled;
    this.controls.enabled = false;

    // Calculate the new camera position just before the cube
    const newCameraPosition = new THREE.Vector3(0, 0, 0);

    this.logger.debug('zooming out back to center');
    new TWEEN.Tween(this.camera.position)
      .to(newCameraPosition, 800)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(() => {
        this.logger.debug('animation complete!');
        this.controls.enabled = oldEnabledValue;
      })
      .start();
    new TWEEN.Tween(this.controls.target)
      .to({ y: 0 }, 800)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();
  }

  public attachGui(gui: GUI) {
    const controlFolder = gui.addFolder('Camera Man');
    controlFolder.add(this.controls, 'enabled').name('Enable Controls');
  }
}
