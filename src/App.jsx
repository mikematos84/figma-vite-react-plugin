import { useState } from 'react';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';

function App() {
  const [count, setCount] = useState(0);

  const onCreate = () => {
    parent.postMessage({ pluginMessage: { type: 'create-rectangles', count } }, '*');
  };

  return (
    <div className="app-container">
      <div className="logo-container">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="title">Figma Plugin React + Vite</h1>
      <div className="card">
        <div className="button-container">
          <button onClick={() => setCount((count) => count + 1)} className="button">
            count is {count}
          </button>
          <button onClick={onCreate} className="button">
            Create Rectangles
          </button>
        </div>
        <p className="description">
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="footer">Click on the Vite and React logos to learn more</p>
    </div>
  );
}

export default App;
