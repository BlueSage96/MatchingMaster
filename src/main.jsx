import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SoundProvider } from './context/SoundProvider';
import './css/index.css';
import App from './App.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SoundProvider>
          <App />
      </SoundProvider>
    </BrowserRouter>
  </StrictMode>
);
