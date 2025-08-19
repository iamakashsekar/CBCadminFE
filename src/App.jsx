import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import './App.css';

// Import pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Facilities from './pages/Facilities';
import Bookings from './pages/Bookings';
import Events from './pages/Events';
import Settings from './pages/Settings';
import SlideShow from './pages/slideShow';
import Rooms from './pages/rooms';
import Payments from './pages/Payments';
const App = () => {
  // For now, set this to true to test the admin panel
  // In production, this should check for valid authentication
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/events" element={<Events />} />
          <Route path="/slideShow" element={<SlideShow />} /> 
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;