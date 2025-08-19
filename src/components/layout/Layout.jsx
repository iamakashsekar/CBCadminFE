import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children, onLogout }) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header onLogout={onLogout} />
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
