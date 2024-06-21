import * as THREE from 'three';
import { useControls } from 'leva';
import { useEffect, useRef } from 'react';
import { useLoader } from '@react-three/fiber';

const initialSettings = {
  playing: false,
  volume: 0.2,
};

export const AudioManager = () => {
  const audioRef = useRef<THREE.Audio | null>(null);
  const listener = useRef<THREE.AudioListener>(null!);

  const audio = useLoader(THREE.AudioLoader, 'audio/universe-background-UNIVERSFIELD-pixabay.mp3');

  useControls({
    playing: {
      value: initialSettings.playing,
      onChange: (value) => (value ? audioRef?.current?.play() : audioRef?.current?.stop()),
    },
    volume: {
      value: initialSettings.volume,
      min: 0,
      max: 1,
      onChange: (value) => audioRef?.current?.setVolume(value),
    },
  });

  useEffect(() => {
    if (audio) {
      const sound = new THREE.Audio(listener.current);
      audioRef.current = sound;
      sound.setBuffer(audio);
      sound.setLoop(true);
      sound.setVolume(initialSettings.volume);
      if (initialSettings.playing) {
        sound.play();
      }
    }
  }, [audio]);

  return <audioListener ref={listener}></audioListener>;
};
