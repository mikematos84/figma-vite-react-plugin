import React, { useState } from 'react';

function Themes() {
  const [count, setCount] = useState(0);

  const onCreate = () => {
    parent.postMessage({ pluginMessage: { type: 'create-rectangles', count } }, '*');
  };

  return (
    <div className="themes-container">
      <h2>Themes</h2>
      <div className="card">
        <div className="button-container">
          <button onClick={() => setCount((count) => count + 1)} className="button">
            count is {count}
          </button>
          <button onClick={onCreate} className="button">
            Create Rectangles
          </button>
        </div>
        <p className="description">Create rectangles with the current count</p>
      </div>
    </div>
  );
}

export default Themes;
