import axios from 'axios';

// Base URL for your backend API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const stripeService = {
  // Generate Stripe payment link
  generatePaymentLink: async (productId, customerId, metadata = {}) => {
    try {
      const response = await api.post('/stripe/create-payment-link', {
        productId,
        customerId,
        metadata,
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
      });
      return response.data;
    } catch (error) {
      console.error('Error generating payment link:', error);
      throw error;
    }
  },

  // Get Stripe customer details
  getCustomer: async (customerId) => {
    try {
      const response = await api.get(`/stripe/customers/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  // Get customer's payment history
  getCustomerPayments: async (customerId) => {
    try {
      const response = await api.get(`/stripe/customers/${customerId}/payments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer payments:', error);
      throw error;
    }
  },

  // Get available products/prices
  getProducts: async () => {
    try {
      const response = await api.get('/stripe/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Create or update customer
  createCustomer: async (customerData) => {
    try {
      const response = await api.post('/stripe/customers', customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // Update customer subscription
  updateSubscription: async (subscriptionId, updates) => {
    try {
      const response = await api.patch(`/stripe/subscriptions/${subscriptionId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId) => {
    try {
      const response = await api.delete(`/stripe/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  },

  // Get subscription details
  getSubscription: async (subscriptionId) => {
    try {
      const response = await api.get(`/stripe/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  },

  // Refund payment
  refundPayment: async (paymentIntentId, amount, reason) => {
    try {
      const response = await api.post('/stripe/refunds', {
        paymentIntentId,
        amount,
        reason,
      });
      return response.data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  },

  // Get webhook events (for debugging)
  getWebhookEvents: async (limit = 10) => {
    try {
      const response = await api.get(`/stripe/webhook-events?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching webhook events:', error);
      throw error;
    }
  },
};

export default stripeService;
