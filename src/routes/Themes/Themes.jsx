import React, { useState } from 'react';
import './Themes.css';

function Themes() {
  const [count, setCount] = useState(0);

  const onCreate = () => {
    parent.postMessage({ pluginMessage: { type: 'create-rectangles', count } }, '*');
  };

  return (
    <div className="themes-container">
      <h2 className="title">Themes</h2>
      <div className="themes-card">
        <div className="button-container">
          <button onClick={() => setCount((count) => count + 1)} className="button">
            count is {count}
          </button>
          <button onClick={onCreate} className="button">
            Create Rectangles
          </button>
        </div>
        <p className="themes-description">Create rectangles with the current count</p>
      </div>
    </div>
  );
}

export default Themes; 