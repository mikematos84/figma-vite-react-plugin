import React from 'react';
import { Navigate, Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Account from './routes/Account';
import Advanced from './routes/Advanced';
import Themes from './routes/Themes';

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
