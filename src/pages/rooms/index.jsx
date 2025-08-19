import React, { useState } from 'react'
import './rooms.css'

const Rooms = () => {
  const [roomBookings, setRoomBookings] = useState([
    {
      id: 1,
      roomNumber: '101',
      guestName: 'John Smith',
      checkIn: '2024-01-20',
      checkOut: '2024-01-22',
      guests: 2,
      status: 'confirmed',
      totalAmount: 300,
      bookingDate: '2024-01-15'
    },
    {
      id: 2,
      roomNumber: '205',
      guestName: 'Sarah Johnson',
      checkIn: '2024-01-21',
      checkOut: '2024-01-23',
      guests: 1,
      status: 'pending',
      totalAmount: 250,
      bookingDate: '2024-01-16'
    },
    {
      id: 3,
      roomNumber: '103',
      guestName: 'Mike Davis',
      checkIn: '2024-01-19',
      checkOut: '2024-01-21',
      guests: 3,
      status: 'checked-in',
      totalAmount: 400,
      bookingDate: '2024-01-14'
    },
    {
      id: 4,
      roomNumber: '302',
      guestName: 'Emily Wilson',
      checkIn: '2024-01-25',
      checkOut: '2024-01-27',
      guests: 2,
      status: 'cancelled',
      totalAmount: 350,
      bookingDate: '2024-01-17'
    }
  ]);

  const getStatusBadge = (status) => {
    const statusColors = {
      confirmed: 'green',
      pending: 'orange',
      'checked-in': 'blue',
      cancelled: 'red',
      completed: 'gray'
    };
    
    return (
      <span className={`status-badge ${statusColors[status] || 'gray'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="rooms-container">
      <h1>Room Bookings</h1>
      
      <div className="table-container">
        <table className="room-table">
          <thead>
            <tr>
              <th>Room No.</th>
              <th>Guest Name</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Guests</th>
              <th>Status</th>
              <th>Total Amount</th>
              <th>Booking Date</th>
            </tr>
          </thead>
          <tbody>
            {roomBookings.map(booking => (
              <tr key={booking.id}>
                <td className="room-number">{booking.roomNumber}</td>
                <td className="guest-name">{booking.guestName}</td>
                <td>{booking.checkIn}</td>
                <td>{booking.checkOut}</td>
                <td>{booking.guests}</td>
                <td>{getStatusBadge(booking.status)}</td>
                <td className="amount">${booking.totalAmount}</td>
                <td>{booking.bookingDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Rooms