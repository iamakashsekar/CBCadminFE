import React, { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "./Events.css";

const Events = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Annual Tennis Tournament",
      type: "Sports",
      date: "2024-04-15",
      time: "09:00 AM - 06:00 PM",
      venue: "Tennis Courts",
      capacity: 32,
      registrations: 28,
      status: "Upcoming",
      description:
        "Join us for our annual tennis tournament featuring both singles and doubles competitions. Open to all skill levels with exciting prizes for winners.",
      featuredImage:
        "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=400&fit=crop",
      memberPrice: 25,
      guestPrice: 45,
      content:
        "<p>Join us for our annual tennis tournament featuring both singles and doubles competitions. Open to all skill levels with exciting prizes for winners.</p><h3>Tournament Details:</h3><ul><li>Singles and Doubles categories</li><li>Round-robin format</li><li>Professional referees</li><li>Prizes for winners</li></ul>",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      title: "Summer Pool Party",
      type: "Social",
      date: "2024-05-01",
      time: "02:00 PM - 08:00 PM",
      venue: "Swimming Pool Area",
      capacity: 100,
      registrations: 45,
      status: "Open",
      description:
        "Cool off this summer with our pool party featuring music, games, and refreshments.",
      featuredImage:
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=400&fit=crop",
      memberPrice: 15,
      guestPrice: 30,
      content:
        "<p>Cool off this summer with our pool party featuring music, games, and refreshments.</p><h3>Event Highlights:</h3><ul><li>Live DJ music</li><li>Pool games and competitions</li><li>BBQ and refreshments</li><li>Family-friendly activities</li></ul>",
      createdAt: "2024-01-10",
    },
    {
      id: 3,
      title: "Members Networking Night",
      type: "Business",
      date: "2024-03-20",
      time: "07:00 PM - 10:00 PM",
      venue: "Function Hall A",
      capacity: 150,
      registrations: 150,
      status: "Full",
      description:
        "Network with fellow members and industry professionals in a relaxed atmosphere.",
      featuredImage:
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop",
      memberPrice: 0,
      guestPrice: 50,
      content:
        "<p>Network with fellow members and industry professionals in a relaxed atmosphere.</p><h3>Networking Benefits:</h3><ul><li>Professional connections</li><li>Industry insights</li><li>Business opportunities</li><li>Complimentary refreshments</li></ul>",
      createdAt: "2024-01-05",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "Sports",
    date: "",
    time: "",
    venue: "",
    capacity: 50,
    description: "",
    memberPrice: 0,
    guestPrice: 0,
    content: "",
    featuredImage: null,
  });

  // File input reference
  const fileInputRef = useRef(null);

  // Event types
  const eventTypes = [
    "Sports",
    "Social",
    "Business",
    "Cultural",
    "Educational",
    "Charity",
    "Fitness",
    "Entertainment",
  ];

  // Event statuses
  const eventStatuses = [
    "Draft",
    "Upcoming",
    "Open",
    "Full",
    "In Progress",
    "Completed",
    "Cancelled",
  ];

  // Filter events based on search and filters
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || event.type === typeFilter;
    const matchesStatus = !statusFilter || event.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Add new event
  const handleAddEvent = () => {
    if (
      !newEvent.title ||
      !newEvent.date ||
      !newEvent.venue ||
      !newEvent.capacity
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const event = {
      id: Date.now(),
      ...newEvent,
      registrations: 0,
      status: "Upcoming",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setEvents([...events, event]);
    setShowAddModal(false);
    setNewEvent({
      title: "",
      type: "Sports",
      date: "",
      time: "",
      venue: "",
      capacity: 50,
      description: "",
      memberPrice: 0,
      guestPrice: 0,
      content: "",
      featuredImage: null,
    });
  };

  // Edit event
  const handleEditEvent = () => {
    if (!selectedEvent) return;

    const updatedEvents = events.map((event) =>
      event.id === selectedEvent.id ? { ...event, ...selectedEvent } : event
    );

    setEvents(updatedEvents);
    setShowEditModal(false);
    setSelectedEvent(null);
  };

  // Delete event
  const handleDeleteEvent = () => {
    if (!selectedEvent) return;

    const updatedEvents = events.filter(
      (event) => event.id !== selectedEvent.id
    );
    setEvents(updatedEvents);
    setShowDeleteModal(false);
    setSelectedEvent(null);
  };

  // Handle image file selection
  const handleImageSelect = (event, isEdit = false) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);

    if (isEdit && selectedEvent) {
      setSelectedEvent({
        ...selectedEvent,
        featuredImage: imageUrl,
      });
    } else {
      setNewEvent({
        ...newEvent,
        featuredImage: imageUrl,
      });
    }
  };

  // Handle TinyMCE content change
  const handleContentChange = (content, isEdit = false) => {
    if (isEdit && selectedEvent) {
      setSelectedEvent({
        ...selectedEvent,
        content: content,
      });
    } else {
      setNewEvent({
        ...newEvent,
        content: content,
      });
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "#4facfe";
      case "open":
        return "#43e97b";
      case "full":
        return "#f093fb";
      case "in progress":
        return "#ffc107";
      case "completed":
        return "#6c757d";
      case "cancelled":
        return "#dc3545";
      case "draft":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  // Get type color
  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "sports":
        return "#43e97b";
      case "social":
        return "#f093fb";
      case "business":
        return "#4facfe";
      case "cultural":
        return "#fa709a";
      case "educational":
        return "#029ddd";
      case "charity":
        return "#ffc107";
      case "fitness":
        return "#38f9d7";
      case "entertainment":
        return "#ff6b6b";
      default:
        return "#6c757d";
    }
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <div className="header-content">
          <h1>Events Management</h1>
          <p>
            Create and manage club events, manage registrations, and track
            attendance
          </p>
        </div>
        <div className="header-actions">
          <button
            className="create-event-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Create New Event
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="events-filters">
        <div className="filters-row">
          <input
            type="text"
            placeholder="Search events..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            {eventStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="events-grid">
        {filteredEvents.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-image">
              <img src={event.featuredImage} alt={event.title} />
              <div className="event-overlay">
                <div className="event-actions-overlay">
                  <button
                    className="edit-btn-overlay"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEditModal(true);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="delete-btn-overlay"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowDeleteModal(true);
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
            <div className="event-header">
              <span
                className="event-type"
                style={{ backgroundColor: getTypeColor(event.type) }}
              >
                {event.type}
              </span>
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(event.status) }}
              >
                {event.status}
              </span>
            </div>
            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">{event.description}</p>
            <div className="event-details">
              <div className="detail-item">
                <span className="icon">📅</span>
                <span>{event.date}</span>
              </div>
              <div className="detail-item">
                <span className="icon">⏰</span>
                <span>{event.time}</span>
              </div>
              <div className="detail-item">
                <span className="icon">📍</span>
                <span>{event.venue}</span>
              </div>
              <div className="detail-item">
                <span className="icon">👥</span>
                <span>
                  {event.registrations} / {event.capacity} registered
                </span>
              </div>
            </div>
            <div className="pricing-info">
              <div className="price-item">
                <span className="price-label">Members:</span>
                <span className="price-value">${event.memberPrice}</span>
              </div>
              <div className="price-item">
                <span className="price-label">Guests:</span>
                <span className="price-value">${event.guestPrice}</span>
              </div>
            </div>
            <div className="registration-progress">
              <div className="progress-label">
                Registration Progress:{" "}
                {Math.round((event.registrations / event.capacity) * 100)}%
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${(event.registrations / event.capacity) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="event-actions">
              <button
                className="edit-btn"
                onClick={() => {
                  setSelectedEvent(event);
                  setShowEditModal(true);
                }}
              >
                Edit
              </button>
              <button className="view-btn">View Details</button>
              <button className="manage-btn">Manage Registrations</button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="empty-state">
          <h3>No events found</h3>
          <p>Create your first event to get started!</p>
          <button
            className="create-first-event-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Create First Event
          </button>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <h2>Create New Event</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Event Title *</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="Enter event title"
                />
              </div>
              <div className="form-group">
                <label>Event Type *</label>
                <select
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, type: e.target.value })
                  }
                >
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="text"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
                  }
                  placeholder="e.g., 09:00 AM - 06:00 PM"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Venue *</label>
                <input
                  type="text"
                  value={newEvent.venue}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, venue: e.target.value })
                  }
                  placeholder="Enter venue"
                />
              </div>
              <div className="form-group">
                <label>Capacity *</label>
                <input
                  type="number"
                  value={newEvent.capacity}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      capacity: parseInt(e.target.value),
                    })
                  }
                  min="1"
                  placeholder="Maximum attendees"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Member Price ($)</label>
                <input
                  type="number"
                  value={newEvent.memberPrice}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      memberPrice: parseFloat(e.target.value),
                    })
                  }
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label>Guest Price ($)</label>
                <input
                  type="number"
                  value={newEvent.guestPrice}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      guestPrice: parseFloat(e.target.value),
                    })
                  }
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Short Description</label>
              <textarea
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                placeholder="Brief description for event cards"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Featured Image</label>
              <div className="image-upload-area">
                {newEvent.featuredImage ? (
                  <div className="image-preview">
                    <img src={newEvent.featuredImage} alt="Preview" />
                    <button
                      type="button"
                      className="change-image-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div
                    className="upload-placeholder"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="upload-icon">📷</div>
                    <p>Click to upload featured image</p>
                    <small>Recommended: 800×400px, max 5MB</small>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, false)}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Event Content (Rich Text Editor)</label>
              <Editor
                apiKey="your-tinymce-api-key"
                value={newEvent.content}
                onEditorChange={(content) =>
                  handleContentChange(content, false)
                }
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
              <button onClick={handleAddEvent} className="primary">
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <h2>Edit Event: {selectedEvent.title}</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Event Title *</label>
                <input
                  type="text"
                  value={selectedEvent.title}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter event title"
                />
              </div>
              <div className="form-group">
                <label>Event Type *</label>
                <select
                  value={selectedEvent.type}
                  onChange={(e) =>
                    setSelectedEvent({ ...selectedEvent, type: e.target.value })
                  }
                >
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={selectedEvent.date}
                  onChange={(e) =>
                    setSelectedEvent({ ...selectedEvent, date: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="text"
                  value={selectedEvent.time}
                  onChange={(e) =>
                    setSelectedEvent({ ...selectedEvent, time: e.target.value })
                  }
                  placeholder="e.g., 09:00 AM - 06:00 PM"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Venue *</label>
                <input
                  type="text"
                  value={selectedEvent.venue}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      venue: e.target.value,
                    })
                  }
                  placeholder="Enter venue"
                />
              </div>
              <div className="form-group">
                <label>Capacity *</label>
                <input
                  type="number"
                  value={selectedEvent.capacity}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      capacity: parseInt(e.target.value),
                    })
                  }
                  min="1"
                  placeholder="Maximum attendees"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Member Price ($)</label>
                <input
                  type="number"
                  value={selectedEvent.memberPrice}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      memberPrice: parseFloat(e.target.value),
                    })
                  }
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label>Guest Price ($)</label>
                <input
                  type="number"
                  value={selectedEvent.guestPrice}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      guestPrice: parseFloat(e.target.value),
                    })
                  }
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Short Description</label>
              <textarea
                value={selectedEvent.description}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    description: e.target.value,
                  })
                }
                placeholder="Brief description for event cards"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Featured Image</label>
              <div className="image-upload-area">
                <div className="image-preview">
                  <img src={selectedEvent.featuredImage} alt="Current" />
                  <button
                    type="button"
                    className="change-image-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Image
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, true)}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Event Content (Rich Text Editor)</label>
              <Editor
                apiKey="your-tinymce-api-key"
                value={selectedEvent.content}
                onEditorChange={(content) => handleContentChange(content, true)}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
              <button onClick={handleEditEvent} className="primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Delete Event</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>"{selectedEvent.title}"</strong>?
            </p>
            <p className="warning-text">
              This action cannot be undone. All event data and registrations
              will be permanently removed.
            </p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button onClick={handleDeleteEvent} className="danger">
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
