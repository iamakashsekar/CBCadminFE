import React, { useState } from 'react';
import './Bookings.css';

const Bookings = () => {
  const [bookings] = useState([
    {
      id: 1,
      facility: 'Tennis Court 1',
      member: 'John Doe',
      membershipId: 'CBC001',
      date: '2024-03-10',
      timeSlot: '09:00 AM - 10:00 AM',
      status: 'Confirmed'
    },
    {
      id: 2,
      facility: 'Function Hall A',
      member: 'Jane Smith',
      membershipId: 'CBC002',
      date: '2024-03-15',
      timeSlot: '02:00 PM - 06:00 PM',
      status: 'Pending'
    },
    {
      id: 3,
      facility: 'Swimming Pool',
      member: 'Mike Johnson',
      membershipId: 'CBC003',
      date: '2024-03-12',
      timeSlot: '11:00 AM - 12:00 PM',
      status: 'Cancelled'
    }
  ]);

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <h1>Bookings Management</h1>
        <button className="create-booking-btn">Create New Booking</button>
      </div>

      <div className="bookings-filters">
        <div className="filters-row">
          <input 
            type="text" 
            placeholder="Search by member or facility..." 
            className="search-input"
          />
          <select className="filter-select">
            <option value="">All Facilities</option>
            <option value="tennis">Tennis Courts</option>
            <option value="pool">Swimming Pool</option>
            <option value="hall">Function Halls</option>
          </select>
          <select className="filter-select">
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="filters-row">
          <div className="date-filter">
            <label>Date Range:</label>
            <input type="date" className="date-input" />
            <span>to</span>
            <input type="date" className="date-input" />
          </div>
        </div>
      </div>

      <div className="bookings-table">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Facility</th>
              <th>Member</th>
              <th>Membership ID</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>#{booking.id}</td>
                <td>{booking.facility}</td>
                <td>{booking.member}</td>
                <td>{booking.membershipId}</td>
                <td>{booking.date}</td>
                <td>{booking.timeSlot}</td>
                <td>
                  <span className={`status-badge ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn">Edit</button>
                    <button className="view-btn">View</button>
                    {booking.status === 'Pending' && (
                      <button className="approve-btn">Approve</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button>&lt; Previous</button>
        <span>Page 1 of 1</span>
        <button>Next &gt;</button>
      </div>
    </div>
  );
};

export default Bookings;
