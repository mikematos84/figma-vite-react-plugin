import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="tab-navigation">
      <NavLink
        to="/themes"
        className={({ isActive }) => (isActive ? 'tab-link active' : 'tab-link')}
      >
        Themes
      </NavLink>
      <NavLink
        to="/advanced"
        className={({ isActive }) => (isActive ? 'tab-link active' : 'tab-link')}
      >
        Advanced
      </NavLink>
      <NavLink
        to="/account"
        className={({ isActive }) => (isActive ? 'tab-link active' : 'tab-link')}
      >
        Account
      </NavLink>
    </nav>
  );
}

export default Navigation;
