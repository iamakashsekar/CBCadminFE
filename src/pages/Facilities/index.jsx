import React, { useState } from 'react';
import './Facilities.css';

const Facilities = () => {
  const [facilities] = useState([
    { 
      id: 1, 
      name: 'Tennis Court 1',
      type: 'Sports',
      status: 'Available',
      capacity: '4 players',
      maintenanceDate: '2024-03-15'
    },
    { 
      id: 2, 
      name: 'Swimming Pool',
      type: 'Recreation',
      status: 'Under Maintenance',
      capacity: '50 people',
      maintenanceDate: '2024-02-20'
    },
    { 
      id: 3, 
      name: 'Function Hall A',
      type: 'Event Space',
      status: 'Available',
      capacity: '200 people',
      maintenanceDate: '2024-04-01'
    },
  ]);

  return (
    <div className="facilities-page">
      <div className="facilities-header">
        <h1>Facilities Management</h1>
        <button className="add-facility-btn">Add New Facility</button>
      </div>

      <div className="facilities-filters">
        <input 
          type="text" 
          placeholder="Search facilities..." 
          className="search-input"
        />
        <select className="filter-select">
          <option value="">All Types</option>
          <option value="sports">Sports</option>
          <option value="recreation">Recreation</option>
          <option value="event">Event Space</option>
        </select>
        <select className="filter-select">
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="maintenance">Under Maintenance</option>
          <option value="booked">Booked</option>
        </select>
      </div>

      <div className="facilities-grid">
        {facilities.map(facility => (
          <div key={facility.id} className="facility-card">
            <div className="facility-header">
              <h3>{facility.name}</h3>
              <span className={`status-badge ${facility.status.toLowerCase().replace(' ', '-')}`}>
                {facility.status}
              </span>
            </div>
            <div className="facility-info">
              <div className="info-item">
                <span className="label">Type:</span>
                <span>{facility.type}</span>
              </div>
              <div className="info-item">
                <span className="label">Capacity:</span>
                <span>{facility.capacity}</span>
              </div>
              <div className="info-item">
                <span className="label">Next Maintenance:</span>
                <span>{facility.maintenanceDate}</span>
              </div>
            </div>
            <div className="facility-actions">
              <button className="edit-btn">Edit</button>
              <button className="schedule-btn">Schedule</button>
              <button className="view-btn">View Bookings</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Facilities;
