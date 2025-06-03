import React from 'react';
import { Navigate, Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Account from './components/Account';
import Advanced from './components/Advanced';
import Navigation from './components/Navigation';
import Themes from './components/Themes';

function App() {
  return (
    <Router initialEntries={['/themes']} initialIndex={0}>
      <div className="app-container">
        Test
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
