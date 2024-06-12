import * as THREE from 'three';
import { Logger } from './logger';
import { GuiAble } from './utils';
import { GUI } from 'dat.gui';

export class AudioManager implements GuiAble {
  private readonly listener: THREE.AudioListener;
  private readonly logger: Logger = new Logger('AudioManager');
  private readonly audio: THREE.Audio;
  private state = {
    playing: false,
    volume: 0.2,
  };

  constructor(camera: THREE.Camera) {
    // create an AudioListener and add it to the camera
    this.listener = new THREE.AudioListener();
    camera.add(this.listener);

    // create a global audio source
    this.audio = new THREE.Audio(this.listener);

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('audio/universe-background-UNIVERSFIELD-pixabay.mp3', (buffer) => {
      this.logger.debug('loaded audio file');
      this.audio.setBuffer(buffer);
      this.audio.setLoop(true);
      this.audio.setVolume(this.state.volume);
      this.audio.play();
      this.state.playing = true;
    });
  }

  attachGui(gui: GUI): void {
    const folder = gui.addFolder('Audio');
    folder
      .add(this.state, 'playing')
      .name('Playing')
      .onChange((value) => {
        if (value) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      });
    folder
      .add(this.state, 'volume', 0, 1)
      .name('Volume')
      .onChange((value) => {
        this.audio.setVolume(value);
      });
    folder.add(this.audio, 'loop').name('Loop');
  }
}
