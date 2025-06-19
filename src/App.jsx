import { Routes, Route } from 'react-router-dom';
import './css/App.css';
import Nav from './features/NavBar';
import Menu from './pages/Menu';
import Settings from './pages/Settings';
import Instructions from './pages/Instructions';
import ToGame from './pages/ToGame';
import ToEndgame from './pages/ToGameOver';
import NotFound from './pages/NotFound';
import cover from './assets/cover.png';
import background from './assets/background.png';

function App() {
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
          <Route path="/match" element={<ToGame />} />
          <Route path="/gameOver" element={<ToEndgame />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;