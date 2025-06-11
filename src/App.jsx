import './css/App.css';
import Match from './features/Match';

function App() {
  return (
    <>
      <h1>Memory Game</h1>
      <div
        style={{
          width: '800px',
          height: '600px',
          backgroundColor: 'tan',
        }}
      >
        <Match />
      </div>
    </>
  );
}

export default App;