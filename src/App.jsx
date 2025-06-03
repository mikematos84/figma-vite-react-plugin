import React from 'react';
import { Navigate, Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Account from './views/Account';
import Advanced from './views/Advanced';
import Themes from './views/Themes';

function App() {
  return (
    <Router initialEntries={['/themes']} initialIndex={0}>
      <div className="app-container">
        <Navigation />
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/themes" replace />} />
            <Route path="/themes" element={<Themes />} />
            <Route path="/advanced" element={<Advanced />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
