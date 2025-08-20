import React, { useState } from "react";
import "./Bookings.css";
import { useGetAllBookingsQuery } from "../../api/bookingApi";

const Bookings = () => {
  const { data: bookings, isLoading, error } = useGetAllBookingsQuery();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  console.log("bookings", bookings);

  // Filter bookings based on search and filters
  const filteredBookings = bookings?.bookings?.filter((booking) => {
    const matchesSearch = 
      (booking?.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking?.facility_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking?.booking_id || '').toString().includes(searchTerm) ||
      (booking?.user_email || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFacility = !facilityFilter || 
      (booking?.facility_name || '').toLowerCase().includes(facilityFilter.toLowerCase());

    const matchesStatus = !statusFilter || 
      (booking?.booking_status || '').toLowerCase() === statusFilter.toLowerCase();

    const matchesDateRange = !startDate || !endDate || 
      (new Date(booking?.booked_date) >= new Date(startDate) && 
       new Date(booking?.booked_date) <= new Date(endDate));

    return matchesSearch && matchesFacility && matchesStatus && matchesDateRange;
  }) || [];

  // const [bookings] = useState([
  //   {
  //     id: 1,
  //     facility: 'Tennis Court 1',
  //     member: 'John Doe',
  //     membershipId: 'CBC001',
  //     date: '2024-03-10',
  //     timeSlot: '09:00 AM - 10:00 AM',
  //     status: 'Confirmed'
  //   },
  //   {
  //     id: 2,
  //     facility: 'Function Hall A',
  //     member: 'Jane Smith',
  //     membershipId: 'CBC002',
  //     date: '2024-03-15',
  //     timeSlot: '02:00 PM - 06:00 PM',
  //     status: 'Pending'
  //   },
  //   {
  //     id: 3,
  //     facility: 'Swimming Pool',
  //     member: 'Mike Johnson',
  //     membershipId: 'CBC003',
  //     date: '2024-03-12',
  //     timeSlot: '11:00 AM - 12:00 PM',
  //     status: 'Cancelled'
  //   }
  // ]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }
  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <h1>Bookings Management</h1>
        <button className="create-booking-btn">Create New Booking</button>
      </div>

      <div className="bookings-filters">
        <div className="filter-summary">
          <span>Showing {filteredBookings.length} of {bookings?.bookings?.length || 0} bookings</span>
        </div>
        <div className="filters-row">
          <input
            type="text"
            placeholder="Search by member, facility, ID, or email..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="filter-select"
            value={facilityFilter}
            onChange={(e) => setFacilityFilter(e.target.value)}
          >
            <option value="">All Facilities</option>
            <option value="tennis">Tennis Courts</option>
            <option value="pool">Swimming Pool</option>
            <option value="hall">Function Halls</option>
            <option value="gym">Gym</option>
            <option value="squash">Squash Courts</option>
            <option value="pickleball">Pickleball Courts</option>
          </select>
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="filters-row">
          <div className="date-filter">
            <label>Date Range:</label>
            <input 
              type="date" 
              className="date-input" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span>to</span>
            <input 
              type="date" 
              className="date-input" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button 
            className="clear-filters-btn"
            onClick={() => {
              setSearchTerm('');
              setFacilityFilter('');
              setStatusFilter('');
              setStartDate('');
              setEndDate('');
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="bookings-table">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Facility</th>
              <th>User Info</th>
              <th>Booking Details</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking?.booking_id}>
                <td>
                  <div className="booking-id">
                    <strong>#{booking?.booking_id}</strong>
                    <small>{booking?.order_id}</small>
                  </div>
                </td>
                <td>
                  <div className="facility-info">
                    <div className="facility-name">{booking?.facility_name}</div>
                    {booking?.img_src && (
                      <img src={booking?.img_src} alt="facility" className="facility-image" />
                    )}
                  </div>
                </td>
                <td>
                  <div className="user-info">
                    <div className="user-name">{booking?.user_name}</div>
                    <div className="user-email">{booking?.user_email}</div>
                    <small>ID: {booking?.user_id}</small>
                  </div>
                </td>
                <td>
                  <div className="booking-details">
                    <div className="booking-date">{booking?.booked_date}</div>
                    <div className="booking-slot">{booking?.booked_slot}</div>
                    {booking?.boking_time_json &&
                      booking?.boking_time_json?.length > 0 &&
                      JSON.parse(booking?.boking_time_json)?.map(
                        (time, index) => (
                          <div key={index} className="time-slot">
                            Court {time?.courtNumber}: {time?.startTime} - {time?.endTime}
                          </div>
                        )
                      )}
                  </div>
                </td>
                <td>
                  <div className="payment-info">
                    <div className="amount">${booking?.amount}</div>
                    <div className="payment-date">{booking?.payment_date}</div>
                    <div className={`payment-status ${booking?.payment_status?.toLowerCase()}`}>
                      {booking?.payment_status}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="status-info">
                    <div className={`booking-status ${booking?.booking_status?.toLowerCase()}`}>
                      {booking?.booking_status}
                    </div>
                    <div className="availability-status">
                      {booking?.availability_status}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="view-btn">View</button>
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
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
