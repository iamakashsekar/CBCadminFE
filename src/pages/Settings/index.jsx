import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('admins');
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: 'Super Admin',
      email: 'superadmin@cbc.com',
      role: 'super_admin',
      accessLevel: 'full',
      status: 'active',
      lastLogin: '2024-01-15 10:30:00',
      permissions: ['all'],
      createdAt: '2024-01-01',
      isSuperAdmin: true
    },
    {
      id: 2,
      name: 'John Manager',
      email: 'john.manager@cbc.com',
      role: 'admin',
      accessLevel: 'high',
      status: 'active',
      lastLogin: '2024-01-14 15:45:00',
      permissions: ['members', 'bookings', 'reports'],
      createdAt: '2024-01-05',
      isSuperAdmin: false
    },
    {
      id: 3,
      name: 'Sarah Staff',
      email: 'sarah.staff@cbc.com',
      role: 'staff',
      accessLevel: 'medium',
      status: 'active',
      lastLogin: '2024-01-13 09:15:00',
      permissions: ['bookings', 'members'],
      createdAt: '2024-01-10',
      isSuperAdmin: false
    },
    {
      id: 4,
      name: 'Mike Helper',
      email: 'mike.helper@cbc.com',
      role: 'helper',
      accessLevel: 'low',
      status: 'inactive',
      lastLogin: '2024-01-10 14:20:00',
      permissions: ['bookings'],
      createdAt: '2024-01-12',
      isSuperAdmin: false
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // New admin form state
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'staff',
    accessLevel: 'medium',
    permissions: []
  });

  // Available roles and their permissions
  const roles = [
    {
      value: 'super_admin',
      label: 'Super Admin',
      description: 'Full access to all features and admin management',
      permissions: ['all'],
      accessLevel: 'full'
    },
    {
      value: 'admin',
      label: 'Admin',
      description: 'High-level access to most features',
      permissions: ['members', 'bookings', 'reports', 'settings'],
      accessLevel: 'high'
    },
    {
      value: 'staff',
      label: 'Staff',
      description: 'Medium access for daily operations',
      permissions: ['bookings', 'members', 'basic_reports'],
      accessLevel: 'medium'
    },
    {
      value: 'helper',
      label: 'Helper',
      description: 'Limited access for basic tasks',
      permissions: ['bookings'],
      accessLevel: 'low'
    }
  ];

  // Available permissions
  const availablePermissions = [
    { value: 'members', label: 'Member Management', description: 'Add, edit, delete members' },
    { value: 'bookings', label: 'Booking Management', description: 'Manage facility bookings' },
    { value: 'reports', label: 'Reports & Analytics', description: 'View and generate reports' },
    { value: 'settings', label: 'System Settings', description: 'Modify system configurations' },
    { value: 'admin_management', label: 'Admin Management', description: 'Manage other admin users' },
    { value: 'billing', label: 'Billing & Payments', description: 'Handle financial transactions' },
    { value: 'events', label: 'Event Management', description: 'Create and manage events' },
    { value: 'maintenance', label: 'Maintenance', description: 'Schedule and track maintenance' }
  ];

  // Filter admins based on search and filters
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || admin.role === roleFilter;
    const matchesStatus = !statusFilter || admin.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Add new admin
  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) {
      alert('Please fill in all required fields');
      return;
    }

    const admin = {
      id: admins.length + 1,
      ...newAdmin,
      status: 'active',
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
      isSuperAdmin: false
    };

    setAdmins([...admins, admin]);
    setShowAddModal(false);
    setNewAdmin({
      name: '',
      email: '',
      role: 'staff',
      accessLevel: 'medium',
      permissions: []
    });
  };

  // Edit admin
  const handleEditAdmin = () => {
    if (!selectedAdmin) return;

    const updatedAdmins = admins.map(admin => 
      admin.id === selectedAdmin.id 
        ? { ...admin, ...selectedAdmin }
        : admin
    );

    setAdmins(updatedAdmins);
    setShowEditModal(false);
    setSelectedAdmin(null);
  };

  // Delete admin
  const handleDeleteAdmin = () => {
    if (!selectedAdmin) return;

    if (selectedAdmin.isSuperAdmin) {
      alert('Cannot delete Super Admin account');
      return;
    }

    const updatedAdmins = admins.filter(admin => admin.id !== selectedAdmin.id);
    setAdmins(updatedAdmins);
    setShowDeleteModal(false);
    setSelectedAdmin(null);
  };

  // Update permissions based on role
  const handleRoleChange = (role) => {
    const selectedRole = roles.find(r => r.value === role);
    if (selectedRole) {
      setNewAdmin({
        ...newAdmin,
        role,
        permissions: selectedRole.permissions,
        accessLevel: selectedRole.accessLevel
      });
    }
  };

  // Toggle permission
  const togglePermission = (permission) => {
    const currentPermissions = newAdmin.permissions;
    if (currentPermissions.includes(permission)) {
      setNewAdmin({
        ...newAdmin,
        permissions: currentPermissions.filter(p => p !== permission)
      });
    } else {
      setNewAdmin({
        ...newAdmin,
        permissions: [...currentPermissions, permission]
      });
    }
  };

  // Get role display info
  const getRoleInfo = (role) => {
    return roles.find(r => r.value === role) || roles[0];
  };

  // Get access level color
  const getAccessLevelColor = (level) => {
    switch (level) {
      case 'full': return '#667eea';
      case 'high': return '#43e97b';
      case 'medium': return '#4facfe';
      case 'low': return '#f093fb';
      default: return '#6c757d';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    return status === 'active' ? '#43e97b' : '#f093fb';
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Admin User Management</h1>
        <button 
          className="add-admin-btn"
          onClick={() => setShowAddModal(true)}
        >
          + Add New Admin
        </button>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <input 
          type="text" 
          placeholder="Search admins..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="filter-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          {roles.map(role => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Admins Table */}
      <div className="admins-table">
        <table>
          <thead>
            <tr>
              <th>Admin User</th>
              <th>Role</th>
          
              <th>Permissions</th>
           
          
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map(admin => (
              <tr key={admin.id} className={admin.isSuperAdmin ? 'super-admin-row' : ''}>
                <td>
                  <div className="admin-info">
                    <div className="admin-avatar">
                      {admin.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="admin-details">
                      <div className="admin-name">{admin.name}</div>
                      <div className="admin-email">{admin.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="role-badge">
                    <span className="role-label">{getRoleInfo(admin.role).label}</span>
                    {admin.isSuperAdmin && <span className="super-admin-badge">SUPER</span>}
                  </div>
                </td>
               
                <td>
                  <div className="permissions-list">
                    {admin.permissions.includes('all') ? (
                      <span className="all-permissions">All Permissions</span>
                    ) : (
                      admin.permissions.slice(0, 3).map(permission => (
                        <span key={permission} className="permission-tag">
                          {permission}
                        </span>
                      ))
                    )}
                    {admin.permissions.length > 3 && !admin.permissions.includes('all') && (
                      <span className="more-permissions">+{admin.permissions.length - 3}</span>
                    )}
                  </div>
                </td>
                
              
                <td className="created-date">{admin.createdAt}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="edit-btn"
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setShowEditModal(true);
                      }}
                      disabled={admin.isSuperAdmin}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setShowDeleteModal(true);
                      }}
                      disabled={admin.isSuperAdmin}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Admin User</h2>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                value={newAdmin.role}
                onChange={(e) => handleRoleChange(e.target.value)}
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label} - {role.description}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Access Level</label>
              <select
                value={newAdmin.accessLevel}
                onChange={(e) => setNewAdmin({...newAdmin, accessLevel: e.target.value})}
              >
                <option value="full">Full Access</option>
                <option value="high">High Access</option>
                <option value="medium">Medium Access</option>
                <option value="low">Low Access</option>
              </select>
            </div>
            <div className="form-group">
              <label>Permissions</label>
              <div className="permissions-grid">
                {availablePermissions.map(permission => (
                  <label key={permission.value} className="permission-checkbox">
                    <input
                      type="checkbox"
                      checked={newAdmin.permissions.includes(permission.value)}
                      onChange={() => togglePermission(permission.value)}
                    />
                    <div className="permission-info">
                      <span className="permission-name">{permission.label}</span>
                      <span className="permission-description">{permission.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
              <button onClick={handleAddAdmin} className="primary">Add Admin</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && selectedAdmin && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Admin User: {selectedAdmin.name}</h2>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={selectedAdmin.name}
                onChange={(e) => setSelectedAdmin({...selectedAdmin, name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                value={selectedAdmin.email}
                onChange={(e) => setSelectedAdmin({...selectedAdmin, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                value={selectedAdmin.role}
                onChange={(e) => setSelectedAdmin({...selectedAdmin, role: e.target.value})}
                disabled={selectedAdmin.isSuperAdmin}
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label} - {role.description}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Access Level</label>
              <select
                value={selectedAdmin.accessLevel}
                onChange={(e) => setSelectedAdmin({...selectedAdmin, accessLevel: e.target.value})}
                disabled={selectedAdmin.isSuperAdmin}
              >
                <option value="full">Full Access</option>
                <option value="high">High Access</option>
                <option value="medium">Medium Access</option>
                <option value="low">Low Access</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={selectedAdmin.status}
                onChange={(e) => setSelectedAdmin({...selectedAdmin, status: e.target.value})}
                disabled={selectedAdmin.isSuperAdmin}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
              <button onClick={handleEditAdmin} className="primary">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAdmin && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Delete Admin User</h2>
            <p>Are you sure you want to delete <strong>{selectedAdmin.name}</strong>?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button onClick={handleDeleteAdmin} className="danger">Delete Admin</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
