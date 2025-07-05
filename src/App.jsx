import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './css/App.css';
import Nav from './features/NavBar';
import Menu from './pages/Menu';
import Settings from './pages/Settings';
import Instructions from './pages/Instructions';
import Match from './features/Match';
import Endgame from './features/Endgame';
import SGM from './features/SelectGameMode';
import NotFound from './pages/NotFound';
import cover from './assets/cover.png';
import background from './assets/background.png';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [gameTimer, setGameTimer] = useState(null);
  return (
    <div className="fullscreen" style={{ backgroundImage: `url(${cover})` }}>
      <div
        className="contentBox"
        style={{ backgroundImage: `url(${background})` }}
      >
        <Nav />
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/marvelMatchMode" element={<SGM />} />
          <Route path="/match" element={<Match playerName={playerName} setPlayerName={setPlayerName} 
          gameTimer={gameTimer} setGameTimer={setGameTimer}/>} />
          <Route path="/gameOver" element={<Endgame playerName={playerName} setPlayerName={setPlayerName}/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;