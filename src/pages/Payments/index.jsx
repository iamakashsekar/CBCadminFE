import React, { useState, useEffect } from 'react'
import './payment.css'

const Payments = () => {
  const [cashPayments, setCashPayments] = useState([
    {
      id: 1,
      customerName: 'John Doe',
      amount: 150,
      date: '2024-01-15',
      status: 'pending',
      description: 'Membership renewal'
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      amount: 200,
      date: '2024-01-14',
      status: 'pending',
      description: 'New membership'
    }
  ]);

  const [cardTransactions, setCardTransactions] = useState([
    {
      id: 1,
      customerName: 'Mike Johnson',
      amount: 175,
      date: '2024-01-15',
      status: 'success',
      cardLast4: '4242',
      description: 'Membership payment'
    },
    {
      id: 2,
      customerName: 'Sarah Wilson',
      amount: 300,
      date: '2024-01-14',
      status: 'failed',
      cardLast4: '1234',
      description: 'Premium membership'
    },
    {
      id: 3,
      customerName: 'Tom Brown',
      amount: 125,
      date: '2024-01-13',
      status: 'pending',
      cardLast4: '5678',
      description: 'Basic membership'
    }
  ]);

  const handleAcceptPayment = (paymentId) => {
    setCashPayments(prev => 
      prev.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'accepted' }
          : payment
      )
    );
  };

  const handleDeclinePayment = (paymentId) => {
    setCashPayments(prev => 
      prev.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'declined' }
          : payment
      )
    );
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'orange',
      accepted: 'green',
      declined: 'red',
      success: 'green',
      failed: 'red'
    };
    
    return (
      <span className={`status-badge ${statusColors[status] || 'gray'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="payments-container">
      <h1>Payment Management</h1>
      
      {/* Cash Payments Section */}
      <div className="payment-section">
        <h2>Cash Payments</h2>
        <div className="table-container">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cashPayments.map(payment => (
                <tr key={payment.id}>
                  <td>{payment.customerName}</td>
                  <td>${payment.amount}</td>
                  <td>{payment.date}</td>
                  <td>{payment.description}</td>
                  <td>{getStatusBadge(payment.status)}</td>
                  <td>
                    {payment.status === 'pending' && (
                      <div className="action-buttons">
                        <button 
                          className="btn-accept"
                          onClick={() => handleAcceptPayment(payment.id)}
                        >
                          Accept
                        </button>
                        <button 
                          className="btn-decline"
                          onClick={() => handleDeclinePayment(payment.id)}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card Transactions Section */}
      <div className="payment-section">
        <h2>Card Transactions</h2>
        <div className="table-container">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Card</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {cardTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.customerName}</td>
                  <td>${transaction.amount}</td>
                  <td>{transaction.date}</td>
                  <td>**** {transaction.cardLast4}</td>
                  <td>{transaction.description}</td>
                  <td>{getStatusBadge(transaction.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Payments