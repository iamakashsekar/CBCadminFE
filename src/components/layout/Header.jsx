import React from 'react';
import './Header.css';

const Header = ({ onLogout }) => {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="header">
      <div className="header-title">
        <h1>Changi Beach Club</h1>
      </div>
      <div className="header-actions">
        <div className="user-info">
          <span className="user-name">Admin User</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
