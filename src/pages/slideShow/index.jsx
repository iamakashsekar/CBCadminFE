import React, { useState, useRef } from 'react';
import './slideShow.css';

const SlideShow = () => {
  const [slides, setSlides] = useState([
    {
      id: 1,
      title: 'Welcome to CBC Club',
      description: 'Experience the best facilities and services',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop',
      order: 1,
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Premium Facilities',
      description: 'State-of-the-art equipment and amenities',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=600&fit=crop',
      order: 2,
      isActive: true,
      createdAt: '2024-01-14'
    },
    {
      id: 3,
      title: 'Exclusive Events',
      description: 'Join our special events and celebrations',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=600&fit=crop',
      order: 3,
      isActive: true,
      createdAt: '2024-01-13'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // New slide form state
  const [newSlide, setNewSlide] = useState({
    title: '',
    description: '',
    imageFile: null,
    isActive: true
  });

  // File input reference
  const fileInputRef = useRef(null);

 

  // Filter slides based on search and status
  const filteredSlides = slides.filter(slide => {
    const matchesSearch = slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         slide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || 
                         (statusFilter === 'active' && slide.isActive) ||
                         (statusFilter === 'inactive' && !slide.isActive);
    
    return matchesSearch && matchesStatus;
  });

  // Add new slide
  const handleAddSlide = () => {
    if (!newSlide.title || !newSlide.imageFile) {
      alert('Please fill in all required fields and upload an image');
      return;
    }

    if (slides.length >= 6) {
      alert('Maximum 6 slides allowed. Please remove some slides first.');
      return;
    }

    const slide = {
      id: Date.now(),
      ...newSlide,
      order: slides.length + 1,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSlides([...slides, slide]);
    setShowAddModal(false);
    setNewSlide({
      title: '',
      description: '',
      imageFile: null,
      isActive: true
    });
  };

  // Edit slide
  const handleEditSlide = () => {
    if (!selectedSlide) return;

    const updatedSlides = slides.map(slide => 
      slide.id === selectedSlide.id 
        ? { ...slide, ...selectedSlide }
        : slide
    );

    setSlides(updatedSlides);
    setShowEditModal(false);
    setSelectedSlide(null);
  };

  // Delete slide
  const handleDeleteSlide = () => {
    if (!selectedSlide) return;

    const updatedSlides = slides.filter(slide => slide.id !== selectedSlide.id);
    // Reorder remaining slides
    const reorderedSlides = updatedSlides.map((slide, index) => ({
      ...slide,
      order: index + 1
    }));

    setSlides(reorderedSlides);
    setShowDeleteModal(false);
    setSelectedSlide(null);
  };

  // Handle image file selection
  const handleImageSelect = (event, isEdit = false) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);

    if (isEdit && selectedSlide) {
      setSelectedSlide({
        ...selectedSlide,
        imageFile: file,
        imageUrl: imageUrl
      });
    } else {
      setNewSlide({
        ...newSlide,
        imageFile: file,
        imageUrl: imageUrl
      });
    }
  };

  // Toggle slide status
  const toggleSlideStatus = (slideId) => {
    const updatedSlides = slides.map(slide => 
      slide.id === slideId 
        ? { ...slide, isActive: !slide.isActive }
        : slide
    );
    setSlides(updatedSlides);
  };

  // Drag and drop reordering
  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) return;

    const newSlides = [...slides];
    const draggedSlide = newSlides[dragIndex];
    newSlides.splice(dragIndex, 1);
    newSlides.splice(dropIndex, 0, draggedSlide);

    // Update order numbers
    const reorderedSlides = newSlides.map((slide, index) => ({
      ...slide,
      order: index + 1
    }));

    setSlides(reorderedSlides);
    setDragIndex(null);
    setDragOverIndex(null);
  };

 

  return (
    <div className="slideshow-page">
      <div className="slideshow-header">
        <div className="header-content">
          <h1>Slideshow Management</h1>
          <p>Manage your club's slideshow images and content</p>
        </div>
        <div className="header-actions">
           
          <button 
            className="add-slide-btn"
            onClick={() => setShowAddModal(true)}
            disabled={slides.length >= 6}
          >
            + Add New Slide
          </button>
        </div>
      </div>

     
      

      {/* Slides Grid */}
      <div className="slides-grid">
        {filteredSlides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`slide-card ${slide.isActive ? 'active' : 'inactive'} ${
              dragIndex === index ? 'dragging' : ''
            } ${dragOverIndex === index ? 'drag-over' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className="slide-order">#{slide.order}</div>
            <div className="slide-image">
              <img src={slide.imageUrl} alt={slide.title} />
              <div className="slide-overlay">
                <div className="slide-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => {
                      setSelectedSlide(slide);
                      setShowEditModal(true);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => {
                      setSelectedSlide(slide);
                      setShowDeleteModal(true);
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
            <div className="slide-content">
              <h3 className="slide-title">{slide.title}</h3>
              <p className="slide-description">{slide.description}</p>
              <div className="slide-meta">
                <span className="slide-date">{slide.createdAt}</span>
             
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSlides.length === 0 && (
        <div className="empty-state">
          <h3>No slides found</h3>
          <p>Create your first slide to get started with your slideshow!</p>
          <button 
            className="add-first-slide-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Add First Slide
          </button>
        </div>
      )}

      {/* Add Slide Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Slide</h2>
            
            <div className="form-group">
              <label>Slide Title *</label>
              <input
                type="text"
                value={newSlide.title}
                onChange={(e) => setNewSlide({...newSlide, title: e.target.value})}
                placeholder="Enter slide title"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newSlide.description}
                onChange={(e) => setNewSlide({...newSlide, description: e.target.value})}
                placeholder="Enter slide description"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Slide Image *</label>
              <div className="image-upload-area">
                {newSlide.imageUrl ? (
                  <div className="image-preview">
                    <img src={newSlide.imageUrl} alt="Preview" />
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
                    <p>Click to upload image</p>
                    <small>1200×600px, max 5MB</small>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, false)}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
 

            <div className="modal-actions">
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
              <button onClick={handleAddSlide} className="primary">Add Slide</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Slide Modal */}
      {showEditModal && selectedSlide && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Slide: {selectedSlide.title}</h2>
            
            <div className="form-group">
              <label>Slide Title *</label>
              <input
                type="text"
                value={selectedSlide.title}
                onChange={(e) => setSelectedSlide({...selectedSlide, title: e.target.value})}
                placeholder="Enter slide title"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={selectedSlide.description}
                onChange={(e) => setSelectedSlide({...selectedSlide, description: e.target.value})}
                placeholder="Enter slide description"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Slide Image</label>
              <div className="image-upload-area">
                <div className="image-preview">
                  <img src={selectedSlide.imageUrl} alt="Current" />
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
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedSlide.isActive}
                  onChange={(e) => setSelectedSlide({...selectedSlide, isActive: e.target.checked})}
                />
                <span>Active (visible in slideshow)</span>
              </label>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
              <button onClick={handleEditSlide} className="primary">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedSlide && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Delete Slide</h2>
            <p>Are you sure you want to delete <strong>"{selectedSlide.title}"</strong>?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button onClick={handleDeleteSlide} className="danger">Delete Slide</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideShow;