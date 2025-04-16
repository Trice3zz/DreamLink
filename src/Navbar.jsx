import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li><Link to="/" className="dreamy-tab">🏠 Home</Link></li>
        <li><Link to="/feed" className="dreamy-tab">💤 Dream Feed</Link></li>
        <li><Link to="/lucid" className="dreamy-tab">🌕 Lucid Mode</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
