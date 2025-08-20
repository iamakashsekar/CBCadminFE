import React, { useState, useEffect } from "react";
import "./Facilities.css";
import { useGetAllFacilitiesQuery } from "../../api/facilityApi";

const Facilities = () => {
  const { data: facilities, error, isLoading } = useGetAllFacilitiesQuery();
  console.log("facilities", facilities);

  if (isLoading) return <p>Loading facilities...</p>;
  if (error) return <p>Error fetching facilities</p>;

  console.log(import.meta.env.VITE_API_BASE_URL);

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
        {facilities?.facilites?.map((facility) => (
          <div key={facility?.id} className="facility-card">
            <div className="facility-header">
              <h3>{facility?.name}</h3>
              <span
              // className={`status-badge ${facility?.status
              //   .toLowerCase()
              //   .replace(" ", "-")}`}
              >
                {facility?.status}
              </span>
            </div>
            <img
              src={facility?.img_src}
              alt={facility?.name}
              className="facility-image"
            />
            <div className="facility-info">
              <div className="info-item">
                <span className="label">Availability Status:</span>
                <span>{facility?.availability_status}</span>
              </div>
              <div className="info-item">
                <span className="label">Capacity:</span>
                <span>{facility?.capacity}</span>
              </div>
              <div className="info-item">
                <span className="label">Slots:</span>
                <span>{facility?.slot}</span>
              </div>
              <div className="info-item">
                <span className="label">Unit:</span>
                <span>{facility?.unit}</span>
              </div>
              <div className="info-item">
                <span className="label">Is Free Access:</span>
                <span>{facility?.is_free_access === "0" ? "No" : "Yes"}</span>
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
