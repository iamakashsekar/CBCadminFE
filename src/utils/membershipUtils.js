import { format, addDays, isAfter, isBefore, parseISO } from 'date-fns';

// Calculate membership validity period based on type
export const calculateMembershipPeriod = (membershipType, startDate) => {
  const start = new Date(startDate);
  
  switch (membershipType.toLowerCase()) {
    case 'individual':
      return {
        monthly: addDays(start, 30),
        yearly: addDays(start, 365)
      };
    case 'family':
      return {
        monthly: addDays(start, 30),
        yearly: addDays(start, 365)
      };
    case 'corporate':
      return {
        monthly: addDays(start, 30),
        yearly: addDays(start, 365)
      };
    default:
      return {
        monthly: addDays(start, 30),
        yearly: addDays(start, 365)
      };
  }
};

// Check if membership is expired
export const isMembershipExpired = (validUntilDate) => {
  if (!validUntilDate) return true;
  const validUntil = new Date(validUntilDate);
  const now = new Date();
  return isAfter(now, validUntil);
};

// Check if member is currently banned
export const isMemberBanned = (member) => {
  if (!member.isBanned || !member.banStartDate || !member.banEndDate) {
    return false;
  }
  
  const now = new Date();
  const banStart = new Date(member.banStartDate);
  const banEnd = new Date(member.banEndDate);
  
  return isAfter(now, banStart) && isBefore(now, banEnd);
};

// Get membership status
export const getMembershipStatus = (member) => {
  if (isMemberBanned(member)) {
    return 'Banned';
  }
  
  if (isMembershipExpired(member.membershipValidUntil)) {
    return 'Expired';
  }
  
  return member.status || 'Active';
};

// Generate membership ID
export const generateMembershipId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 3).toUpperCase();
  return `CBC${timestamp}${random}`;
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Format date for display
export const formatDate = (date, formatString = 'yyyy-MM-dd') => {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), formatString);
  } catch (error) {
    return 'Invalid Date';
  }
};

// Calculate days until expiration
export const getDaysUntilExpiration = (validUntilDate) => {
  if (!validUntilDate) return 0;
  
  const validUntil = new Date(validUntilDate);
  const now = new Date();
  const diffTime = validUntil.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
};

// Get membership type display name
export const getMembershipTypeDisplay = (type) => {
  const typeMap = {
    'individual': 'Individual',
    'family': 'Family',
    'corporate': 'Corporate'
  };
  
  return typeMap[type.toLowerCase()] || type;
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate membership data
export const validateMembershipData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!data.type || !['individual', 'family', 'corporate'].includes(data.type.toLowerCase())) {
    errors.push('Please select a valid membership type');
  }
  
  if (!data.joinDate) {
    errors.push('Please select a join date');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Get status badge color class
export const getStatusBadgeClass = (status) => {
  const statusMap = {
    'active': 'active',
    'inactive': 'inactive',
    'banned': 'banned',
    'expired': 'expired',
    'pending': 'pending',
    'suspended': 'suspended'
  };
  
  return statusMap[status.toLowerCase()] || 'default';
};

// Calculate next payment date
export const calculateNextPaymentDate = (lastPaymentDate, billingCycle = 'monthly') => {
  if (!lastPaymentDate) return null;
  
  const lastPayment = new Date(lastPaymentDate);
  
  switch (billingCycle.toLowerCase()) {
    case 'monthly':
      return addDays(lastPayment, 30);
    case 'yearly':
      return addDays(lastPayment, 365);
    case 'weekly':
      return addDays(lastPayment, 7);
    default:
      return addDays(lastPayment, 30);
  }
};

// Get membership pricing
export const getMembershipPricing = (type, billingCycle = 'monthly') => {
  const pricing = {
    individual: {
      monthly: 29.99,
      yearly: 299.99
    },
    family: {
      monthly: 49.99,
      yearly: 499.99
    },
    corporate: {
      monthly: 79.99,
      yearly: 799.99
    }
  };
  
  return pricing[type.toLowerCase()]?.[billingCycle.toLowerCase()] || 0;
};

// Export default object with all functions
export default {
  calculateMembershipPeriod,
  isMembershipExpired,
  isMemberBanned,
  getMembershipStatus,
  generateMembershipId,
  formatCurrency,
  formatDate,
  getDaysUntilExpiration,
  getMembershipTypeDisplay,
  isValidEmail,
  validateMembershipData,
  getStatusBadgeClass,
  calculateNextPaymentDate,
  getMembershipPricing
};
