import { useEffect, useRef } from 'react';
import bgMusic from '../assets/background.mp3';
export let bgSongEnabled = null;

export default function BackgroundMusic ({bgSoundEnabled, bgSongRef}) {
    const audioRef = useRef(null);

    useEffect(() => {
       if (!audioRef.current) {
          const audio = new Audio(bgMusic);
          audio.loop = true;
          audio.volume = 0.5;
          audio.preload = 'auto';
          audioRef.current = audio;
          if (bgSongRef) bgSongRef.current = audioRef.current;
       }
    },[bgSoundEnabled, bgSongRef]);
    
    return null;
}