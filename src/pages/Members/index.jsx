import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addDays } from 'date-fns';
import './Members.css';

const Members = () => {
  const [members, setMembers] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com',
      membershipId: 'CBC001', 
      status: 'Active', 
      type: 'Individual', 
      joinDate: '2024-01-15',
      membershipValidUntil: '2025-01-15',
      stripeCustomerId: 'cus_123456789',
      lastPayment: '2024-01-15',
      nextPayment: '2025-01-15',
      totalSpent: 299.99,
      isBanned: false,
      banStartDate: null,
      banEndDate: null
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com',
      membershipId: 'CBC002', 
      status: 'Active', 
      type: 'Family', 
      joinDate: '2024-02-01',
      membershipValidUntil: '2025-02-01',
      stripeCustomerId: 'cus_987654321',
      lastPayment: '2024-02-01',
      nextPayment: '2025-02-01',
      totalSpent: 499.99,
      isBanned: false,
      banStartDate: null,
      banEndDate: null
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike@example.com',
      membershipId: 'CBC003', 
      status: 'Banned', 
      type: 'Corporate', 
      joinDate: '2023-12-10',
      membershipValidUntil: '2024-12-10',
      stripeCustomerId: 'cus_456789123',
      lastPayment: '2023-12-10',
      nextPayment: '2024-12-10',
      totalSpent: 799.99,
      isBanned: true,
      banStartDate: '2024-06-01',
      banEndDate: '2024-08-01'
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [banStartDate, setBanStartDate] = useState(new Date());
  const [banEndDate, setBanEndDate] = useState(addDays(new Date(), 7));
  const [selectedProductId, setSelectedProductId] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  // Mock product IDs - in real app, these would come from Stripe
  const productIds = [
    { id: 'prod_individual_monthly', name: 'Individual Monthly ($29.99)' },
    { id: 'prod_individual_yearly', name: 'Individual Yearly ($299.99)' },
    { id: 'prod_family_monthly', name: 'Family Monthly ($49.99)' },
    { id: 'prod_family_yearly', name: 'Family Yearly ($499.99)' },
    { id: 'prod_corporate_monthly', name: 'Corporate Monthly ($79.99)' },
    { id: 'prod_corporate_yearly', name: 'Corporate Yearly ($799.99)' },
  ];

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    type: 'Individual',
    membershipId: '',
    joinDate: format(new Date(), 'yyyy-MM-dd')
  });

  const [editMember, setEditMember] = useState({
    name: '',
    email: '',
    type: '',
    membershipId: '',
    joinDate: '',
    membershipValidUntil: '',
    status: ''
  });

  // Filter members based on search and filters
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.membershipId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || member.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = !typeFilter || member.type.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Generate membership ID
  const generateMembershipId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `CBC${timestamp}${random}`;
  };

  // Add new member
  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      alert('Please fill in all required fields');
      return;
    }

    const member = {
      id: members.length + 1,
      ...newMember,
      status: 'Active',
      membershipValidUntil: addDays(new Date(newMember.joinDate), 365),
      stripeCustomerId: `cus_${Date.now()}`,
      lastPayment: newMember.joinDate,
      nextPayment: addDays(new Date(newMember.joinDate), 365),
      totalSpent: 0,
      isBanned: false,
      banStartDate: null,
      banEndDate: null
    };

    setMembers([...members, member]);
    setShowAddModal(false);
    setNewMember({
      name: '',
      email: '',
      type: 'Individual',
      membershipId: '',
      joinDate: format(new Date(), 'yyyy-MM-dd')
    });
  };

  // Edit member
  const handleEditMember = () => {
    if (!editMember.name || !editMember.email) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedMembers = members.map(member => 
      member.id === selectedMember.id 
        ? { 
            ...member, 
            name: editMember.name,
            email: editMember.email,
            type: editMember.type,
            membershipId: editMember.membershipId,
            joinDate: editMember.joinDate,
            membershipValidUntil: editMember.membershipValidUntil,
            status: editMember.status
          }
        : member
    );

    setMembers(updatedMembers);
    setShowEditModal(false);
    setSelectedMember(null);
    setEditMember({
      name: '',
      email: '',
      type: '',
      membershipId: '',
      joinDate: '',
      membershipValidUntil: '',
      status: ''
    });
  };

  // Open edit modal
  const openEditModal = (member) => {
    setSelectedMember(member);
    setEditMember({
      name: member.name,
      email: member.email,
      type: member.type,
      membershipId: member.membershipId,
      joinDate: member.joinDate,
      membershipValidUntil: member.membershipValidUntil,
      status: member.status
    });
    setShowEditModal(true);
  };

  // Open view modal
  const openViewModal = (member) => {
    setSelectedMember(member);
    setShowViewModal(true);
  };

  // Ban member
  const handleBanMember = () => {
    if (!selectedMember) return;

    const updatedMembers = members.map(member => 
      member.id === selectedMember.id 
        ? { 
            ...member, 
            status: 'Banned',
            isBanned: true,
            banStartDate: format(banStartDate, 'yyyy-MM-dd'),
            banEndDate: format(banEndDate, 'yyyy-MM-dd')
          }
        : member
    );

    setMembers(updatedMembers);
    setShowBanModal(false);
    setSelectedMember(null);
  };

  // Generate Stripe payment link and QR code
  const generatePaymentLink = async () => {
    if (!selectedProductId || !selectedMember) {
      alert('Please select a product and member');
      return;
    }

    try {
      // Mock Stripe payment link generation
      // In real app, this would call your backend API
      const mockPaymentLink = `https://checkout.stripe.com/pay/${selectedProductId}_${Date.now()}`;
      setPaymentLink(mockPaymentLink);

      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(mockPaymentLink);
      setQrCodeDataUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Error generating payment link');
    }
  };

  // Check if member is banned
  const isCurrentlyBanned = (member) => {
    if (!member.isBanned) return false;
    const now = new Date();
    const banStart = new Date(member.banStartDate);
    const banEnd = new Date(member.banEndDate);
    return now >= banStart && now <= banEnd;
  };

  // Get membership status
  const getMembershipStatus = (member) => {
    if (isCurrentlyBanned(member)) return 'Banned';
    if (new Date(member.membershipValidUntil) < new Date()) return 'Expired';
    return member.status;
  };

  return (
    <div className="members-page">
      <div className="members-header">
        <h1>Members Management</h1>
        <button 
          className="add-member-btn"
          onClick={() => setShowAddModal(true)}
        >
          Add New Member
        </button>
      </div>

      <div className="members-filters">
        <input 
          type="text" 
          placeholder="Search members by name, email, or ID..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="banned">Banned</option>
          <option value="expired">Expired</option>
        </select>
        <select 
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="individual">Individual</option>
          <option value="family">Family</option>
          <option value="corporate">Corporate</option>
        </select>
      </div>

      <div className="members-table">
        <table>
          <thead>
            <tr>
              <th>Membership ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Valid Until</th>
              <th>Stripe Customer ID</th>
              <th>Last Payment</th>
              <th>Next Payment</th>
              <th>Total Spent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map(member => (
              <tr key={member.id} className={isCurrentlyBanned(member) ? 'banned-row' : ''}>
                <td>{member.membershipId}</td>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.type}</td>
                <td>
                  <span className={`status-badge ${getMembershipStatus(member).toLowerCase()}`}>
                    {getMembershipStatus(member)}
                  </span>
                </td>
                <td>{member.joinDate}</td>
                <td>{member.membershipValidUntil}</td>
                <td className="stripe-id">{member.stripeCustomerId}</td>
                <td>{member.lastPayment}</td>
                <td>{member.nextPayment}</td>
                <td>${member.totalSpent.toFixed(2)}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="edit-btn"
                      onClick={() => openEditModal(member)}
                    >
                      Edit
                    </button>
                    <button 
                      className="view-btn"
                      onClick={() => openViewModal(member)}
                    >
                      View
                    </button>
                    <button 
                      className="ban-btn"
                      onClick={() => {
                        setSelectedMember(member);
                        setShowBanModal(true);
                      }}
                      disabled={member.isBanned}
                    >
                      {member.isBanned ? 'Banned' : 'Ban'}
                    </button>
                    <button 
                      className="payment-btn"
                      onClick={() => {
                        setSelectedMember(member);
                        setShowPaymentModal(true);
                      }}
                    >
                      Payment
                    </button>
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

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Member</h2>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
            <div className="form-group">
              <label>Membership Type</label>
              <select
                value={newMember.type}
                onChange={(e) => setNewMember({...newMember, type: e.target.value})}
              >
                <option value="Individual">Individual</option>
                <option value="Family">Family</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>
            <div className="form-group">
              <label>Join Date</label>
              <input
                type="date"
                value={newMember.joinDate}
                onChange={(e) => setNewMember({...newMember, joinDate: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Membership ID</label>
              <input
                type="text"
                value={newMember.membershipId}
                onChange={(e) => setNewMember({...newMember, membershipId: e.target.value})}
                placeholder="Auto-generated if left empty"
              />
              <button 
                type="button" 
                className="generate-id-btn"
                onClick={() => setNewMember({...newMember, membershipId: generateMembershipId()})}
              >
                Generate ID
              </button>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
              <button onClick={handleAddMember} className="primary">Add Member</button>
            </div>
          </div>
        </div>
      )}

      {/* View Member Modal */}
      {showViewModal && selectedMember && (
        <div className="modal-overlay">
          <div className="modal view-modal">
            <h2>Member Details</h2>
            <div className="member-info-grid">
              <div className="info-section">
                <h3>Basic Information</h3>
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{selectedMember.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{selectedMember.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Membership ID:</span>
                  <span className="info-value">{selectedMember.membershipId}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Type:</span>
                  <span className="info-value">{selectedMember.type}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Status:</span>
                  <span className="info-value">
                    <span className={`status-badge ${getMembershipStatus(selectedMember).toLowerCase()}`}>
                      {getMembershipStatus(selectedMember)}
                    </span>
                  </span>
                </div>
              </div>
              
              <div className="info-section">
                <h3>Membership Details</h3>
                <div className="info-row">
                  <span className="info-label">Join Date:</span>
                  <span className="info-value">{selectedMember.joinDate}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Valid Until:</span>
                  <span className="info-value">{selectedMember.membershipValidUntil}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Stripe Customer ID:</span>
                  <span className="info-value stripe-id">{selectedMember.stripeCustomerId}</span>
                </div>
              </div>
              
              <div className="info-section">
                <h3>Payment Information</h3>
                <div className="info-row">
                  <span className="info-label">Last Payment:</span>
                  <span className="info-value">{selectedMember.lastPayment}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Next Payment:</span>
                  <span className="info-value">{selectedMember.nextPayment}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Total Spent:</span>
                  <span className="info-value">${selectedMember.totalSpent.toFixed(2)}</span>
                </div>
              </div>
              
              {selectedMember.isBanned && (
                <div className="info-section">
                  <h3>Ban Information</h3>
                  <div className="info-row">
                    <span className="info-label">Ban Start:</span>
                    <span className="info-value">{selectedMember.banStartDate}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Ban End:</span>
                    <span className="info-value">{selectedMember.banEndDate}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowViewModal(false)}>Close</button>
              <button 
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedMember);
                }} 
                className="primary"
              >
                Edit Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && selectedMember && (
        <div className="modal-overlay">
          <div className="modal edit-modal">
            <h2>Edit Member: {selectedMember.name}</h2>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={editMember.name}
                onChange={(e) => setEditMember({...editMember, name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={editMember.email}
                onChange={(e) => setEditMember({...editMember, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
            <div className="form-group">
              <label>Membership Type</label>
              <select
                value={editMember.type}
                onChange={(e) => setEditMember({...editMember, type: e.target.value})}
              >
                <option value="Individual">Individual</option>
                <option value="Family">Family</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>
            <div className="form-group">
              <label>Membership ID</label>
              <input
                type="text"
                value={editMember.membershipId}
                onChange={(e) => setEditMember({...editMember, membershipId: e.target.value})}
                placeholder="Enter membership ID"
              />
            </div>
            <div className="form-group">
              <label>Join Date</label>
              <input
                type="date"
                value={editMember.joinDate}
                onChange={(e) => setEditMember({...editMember, joinDate: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Valid Until</label>
              <input
                type="date"
                value={editMember.membershipValidUntil}
                onChange={(e) => setEditMember({...editMember, membershipValidUntil: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={editMember.status}
                onChange={(e) => setEditMember({...editMember, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Banned">Banned</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
              <button onClick={handleEditMember} className="primary">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Ban Member Modal */}
      {showBanModal && selectedMember && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Ban Member: {selectedMember.name}</h2>
            <div className="form-group">
              <label>Ban Start Date</label>
              <DatePicker
                selected={banStartDate}
                onChange={date => setBanStartDate(date)}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div className="form-group">
              <label>Ban End Date</label>
              <DatePicker
                selected={banEndDate}
                onChange={date => setBanEndDate(date)}
                minDate={banStartDate}
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowBanModal(false)}>Cancel</button>
              <button onClick={handleBanMember} className="danger">Ban Member</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Link Modal */}
      {showPaymentModal && selectedMember && (
        <div className="modal-overlay">
          <div className="modal payment-modal">
            <h2>Generate Payment Link for {selectedMember.name}</h2>
            <div className="form-group">
              <label>Select Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">Choose a product...</option>
                {productIds.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            
            {paymentLink && (
              <div className="payment-link-section">
                <h3>Payment Link Generated</h3>
                <div className="payment-link">
                  <a href={paymentLink} target="_blank" rel="noopener noreferrer">
                    {paymentLink}
                  </a>
                </div>
                {qrCodeDataUrl && (
                  <div className="qr-code-section">
                    <h4>QR Code</h4>
                    <img src={qrCodeDataUrl} alt="Payment QR Code" className="qr-code" />
                    <button 
                      className="download-qr-btn"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.download = `payment-qr-${selectedMember.membershipId}.png`;
                        link.href = qrCodeDataUrl;
                        link.click();
                      }}
                    >
                      Download QR Code
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="modal-actions">
              <button onClick={() => setShowPaymentModal(false)}>Close</button>
              <button 
                onClick={generatePaymentLink} 
                className="primary"
                disabled={!selectedProductId}
              >
                Generate Payment Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
