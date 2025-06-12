import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './css/index.css';
import App from './pages/App.jsx';
import Menu from './pages/Menu';
import Settings from './pages/Settings';
import Instructions from './pages/Instructions';
import ToGame from './pages/ToGame';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/main" element={<Menu />} />
        <Route path="/match" element={<ToGame />} />
      </Routes>
    </BrowserRouter>
    
  </StrictMode>
);
