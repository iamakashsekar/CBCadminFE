# CBC Membership Management System

## Overview
The CBC Membership Management System is a comprehensive admin panel for managing club members, their subscriptions, and Stripe payment processing. This system provides administrators with tools to manage members, handle payments, and maintain membership records.

## Features

### 1. Member Management
- **List all members** with comprehensive information
- **Add new members** with automatic membership ID generation
- **Edit member details** and update information
- **View member profiles** with complete history
- **Ban/unban members** with date range controls

### 2. Stripe Integration
- **Stripe Customer ID tracking** for each member
- **Payment history** and transaction records
- **Membership validity** based on payment status
- **Automatic payment link generation** for renewals
- **QR code generation** for payment links

### 3. Advanced Filtering & Search
- **Search by name, email, or membership ID**
- **Filter by membership status** (Active, Inactive, Banned, Expired)
- **Filter by membership type** (Individual, Family, Corporate)
- **Real-time search results**

### 4. Payment Processing
- **Product ID selection** from Stripe catalog
- **Payment link generation** for specific products
- **QR code creation** for easy mobile payments
- **Downloadable QR codes** for offline use

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- React development environment

### Dependencies
```bash
npm install qrcode react-datepicker date-fns axios
```

### Environment Variables
Create a `.env` file in your project root:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Usage Guide

### Adding New Members
1. Click the "Add New Member" button
2. Fill in required fields:
   - Name (required)
   - Email (required)
   - Membership Type
   - Join Date
   - Membership ID (auto-generated if left empty)
3. Click "Add Member" to save

### Managing Existing Members
1. **View Details**: Click "View" button to see member information
2. **Edit Information**: Click "Edit" button to modify member details
3. **Ban Member**: Click "Ban" button and set ban period
4. **Generate Payment**: Click "Payment" button to create payment links

### Banning Members
1. Select a member and click "Ban"
2. Set ban start date (cannot be in the past)
3. Set ban end date (must be after start date)
4. Confirm ban action

### Generating Payment Links
1. Select a member and click "Payment"
2. Choose a product from the dropdown
3. Click "Generate Payment Link"
4. View generated link and QR code
5. Download QR code if needed

## API Integration

### Backend Requirements
Your backend should implement these endpoints:

#### Stripe Payment Link Creation
```javascript
POST /api/stripe/create-payment-link
{
  "productId": "prod_123",
  "customerId": "cus_456",
  "metadata": {},
  "successUrl": "https://example.com/success",
  "cancelUrl": "https://example.com/cancel"
}
```

#### Customer Management
```javascript
GET /api/stripe/customers/:id
POST /api/stripe/customers
GET /api/stripe/customers/:id/payments
```

#### Product Catalog
```javascript
GET /api/stripe/products
```

### Stripe Webhook Setup
Configure these webhook events in your Stripe dashboard:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Data Structure

### Member Object
```javascript
{
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  membershipId: "CBC001",
  status: "Active",
  type: "Individual",
  joinDate: "2024-01-15",
  membershipValidUntil: "2025-01-15",
  stripeCustomerId: "cus_123456789",
  lastPayment: "2024-01-15",
  nextPayment: "2025-01-15",
  totalSpent: 299.99,
  isBanned: false,
  banStartDate: null,
  banEndDate: null
}
```

### Product Object
```javascript
{
  id: "prod_individual_monthly",
  name: "Individual Monthly ($29.99)",
  price: 29.99,
  currency: "USD",
  billingCycle: "monthly"
}
```

## Customization

### Adding New Membership Types
1. Update the `productIds` array in `Members/index.jsx`
2. Add new status badge styles in `Members.css`
3. Update validation logic in `utils/membershipUtils.js`

### Modifying Payment Flow
1. Update `stripeService.js` for new API endpoints
2. Modify payment modal in `Members/index.jsx`
3. Add new payment methods as needed

### Styling Changes
- Modify `Members.css` for visual updates
- Update color schemes and layouts
- Add new CSS classes for custom components

## Security Considerations

### Authentication
- Implement JWT token-based authentication
- Secure API endpoints with middleware
- Validate user permissions for admin actions

### Data Protection
- Encrypt sensitive member information
- Implement proper input validation
- Use HTTPS for all API communications

### Stripe Security
- Never expose Stripe secret keys in frontend
- Validate webhook signatures
- Implement proper error handling

## Troubleshooting

### Common Issues

#### QR Code Not Generating
- Check if `qrcode` package is installed
- Verify payment link is valid
- Check browser console for errors

#### Date Picker Not Working
- Ensure `react-datepicker` is installed
- Check CSS imports are correct
- Verify date format compatibility

#### API Calls Failing
- Check API endpoint URLs
- Verify authentication tokens
- Check network connectivity
- Review backend error logs

### Performance Optimization
- Implement pagination for large member lists
- Use React.memo for expensive components
- Optimize re-renders with useCallback/useMemo
- Implement virtual scrolling for large tables

## Future Enhancements

### Planned Features
- **Bulk operations** for multiple members
- **Advanced reporting** and analytics
- **Email notifications** for membership updates
- **Mobile app integration**
- **Multi-language support**
- **Advanced search filters**

### Integration Possibilities
- **CRM systems** (Salesforce, HubSpot)
- **Accounting software** (QuickBooks, Xero)
- **Communication platforms** (Mailchimp, SendGrid)
- **Analytics tools** (Google Analytics, Mixpanel)

## Support & Maintenance

### Regular Maintenance
- Update dependencies regularly
- Monitor Stripe API changes
- Review and update security measures
- Backup member data regularly

### Monitoring
- Track API response times
- Monitor error rates
- Check Stripe webhook delivery
- Review user activity logs

## License
This project is proprietary software for CBC (Changi Beach Club) use only.

## Contact
For technical support or feature requests, contact the development team.
