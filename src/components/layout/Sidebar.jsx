import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaCalendar,
  FaTicketAlt,
  FaSlideshare,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <FaHome /> },
    { path: "/members", label: "Members", icon: <FaUsers /> },
    { path: "/facilities", label: "Facilities", icon: <FaBuilding /> },
    {
      path: "/bookings",
      label: "Facility Bookings Tracking",
      icon: <FaCalendar />,
    },
    { path: "/events", label: "Events", icon: <FaTicketAlt /> },
    { path: "/slideShow", label: "Slide Show", icon: <FaSlideshare /> },
    { path: "/rooms", label: "Rooms", icon: <FaHome /> },
    { path: "/payments", label: "Payments", icon: <FaTicketAlt /> },
    { path: "/settings", label: "Settings", icon: <FaBuilding /> },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2>CBC Admin</h2>
        <button onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <FaBars /> : <FaTimes />}
        </button>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = useLocation().pathname === item.path;
          return (
            <NavLink
              to={item.path}
              key={item.path}
              className="nav-item"
              style={() => {
                return {
                  backgroundColor: isActive ? "#029ddd" : "",
                  color: "white",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                };
              }}
            >
              <span
                className="nav-icon"
                style={{ color: isActive ? "white" : "gray" }}
              >
                {item.icon}
              </span>
              {!isCollapsed && (
                <span
                  className="nav-label"
                  style={{ color: isActive ? "white" : "gray" }}
                >
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
