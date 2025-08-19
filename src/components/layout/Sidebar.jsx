import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/members', label: 'Members', icon: '👥' },
    { path: '/facilities', label: 'Facilities', icon: '🏢' },
    { path: '/bookings', label: 'Facility Bookings Tracking', icon: '📅' },
    { path: '/events', label: 'Events', icon: '🎉' }, 
    { path: '/slideShow', label: 'Slide Show', icon: '🎉' },
    { path: '/rooms', label: 'Rooms', icon: '🏠' },
    { path: '/payments', label: 'Payments', icon: '💰' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2>CBC Admin</h2>
        <button onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link to={item.path} key={item.path} className="nav-item">
            <span className="nav-icon">{item.icon}</span>
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
