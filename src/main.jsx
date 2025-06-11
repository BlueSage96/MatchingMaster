import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SoundProvider } from './context/SoundContext';
import RootWithMusic from './context/RootWithMusic';
import './css/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SoundProvider>
        <RootWithMusic />
      </SoundProvider>
    </BrowserRouter>
  </StrictMode>
);
