import { useState } from 'react';
import { Routes, Route } from 'react-router';
import styles from '../css/modules/Menu.module.css';
import App from '../App.jsx';
import Menu from '../pages/Menu';
import Match from '../features/Match';

import Instructions from '../pages/Instructions';
import Settings from '../pages/Settings';
import GameOver from '../features/Endgame';
import bgMusic from '../assets/background.mp3';

import { useRef } from 'react';
function RootWithMusic() {
  const audioRef = useRef(null);
  const [songEnabled, setBGSongEnabled] = useState(true);

  // Play music on first interaction
  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((e) => {
        console.log('Auto play failed', e);
      });
    }
  };

  // Toggle music on/off
  const toggleMusic = (enabled) => {
    setBGSongEnabled(enabled);
    if (audioRef.current) {
      if (enabled) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  return (
    <div className={styles.menuUI}>
      <audio ref={audioRef} src={bgMusic} loop preload="auto" />
      <Routes>
        <Route path="/" element={<App playMusic={playMusic} />} />
        <Route path="/match" element={<Match playMusic={playMusic} />} />
        <Route
          path="/instructions"
          element={<Instructions playMusic={playMusic} />}
        />
        {/* <Route path="/mode" element={<SGM playMusic={playMusic} />} /> */}
        <Route
          path="/settings"
          element={
            <Settings
              playMusic={playMusic}
              songEnabled={songEnabled}
              toggleMusic={toggleMusic}
            />
          }
        />
        <Route path="/gameOver" element={<GameOver playMusic={playMusic} />} />
        <Route path="/main" element={<Menu playMusic={playMusic} />} />
      </Routes>
    </div>
  );
}
export default RootWithMusic;
