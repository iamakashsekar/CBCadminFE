import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format, subDays, subWeeks, subMonths, subYears, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import './Dashboard.css';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [selectedMetric, setSelectedMetric] = useState('users');

  // Dummy data for users
  const userData = {
    daily: generateDailyData(30, 'users'),
    weekly: generateWeeklyData(12, 'users'),
    monthly: generateMonthlyData(12, 'users'),
    yearly: generateYearlyData(5, 'users')
  };

  // Dummy data for bookings
  const bookingData = {
    daily: generateDailyData(30, 'bookings'),
    weekly: generateWeeklyData(12, 'bookings'),
    monthly: generateMonthlyData(12, 'bookings'),
    yearly: generateYearlyData(5, 'bookings')
  };

  // Generate dummy data functions
  function generateDailyData(days, type) {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const baseValue = type === 'users' ? 50 : 25;
      const randomFactor = 0.3; // 30% variation
      const value = Math.floor(baseValue + (Math.random() - 0.5) * baseValue * randomFactor);
      
      data.push({
        date: format(date, 'MMM dd'),
        value: value,
        fullDate: date
      });
    }
    return data;
  }

  function generateWeeklyData(weeks, type) {
    const data = [];
    for (let i = weeks - 1; i >= 0; i--) {
      const date = subWeeks(new Date(), i);
      const baseValue = type === 'users' ? 350 : 175;
      const randomFactor = 0.4; // 40% variation
      const value = Math.floor(baseValue + (Math.random() - 0.5) * baseValue * randomFactor);
      
      data.push({
        week: `Week ${format(date, 'MMM dd')}`,
        value: value,
        fullDate: date
      });
    }
    return data;
  }

  function generateMonthlyData(months, type) {
    const data = [];
    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const baseValue = type === 'users' ? 1500 : 750;
      const randomFactor = 0.5; // 50% variation
      const value = Math.floor(baseValue + (Math.random() - 0.5) * baseValue * randomFactor);
      
      data.push({
        month: format(date, 'MMM yyyy'),
        value: value,
        fullDate: date
      });
    }
    return data;
  }

  function generateYearlyData(years, type) {
    const data = [];
    for (let i = years - 1; i >= 0; i--) {
      const date = subYears(new Date(), i);
      const baseValue = type === 'users' ? 18000 : 9000;
      const randomFactor = 0.6; // 60% variation
      const value = Math.floor(baseValue + (Math.random() - 0.5) * baseValue * randomFactor);
      
      data.push({
        year: format(date, 'yyyy'),
        value: value,
        fullDate: date
      });
    }
    return data;
  }

  // Calculate summary statistics
  const getCurrentData = () => {
    const data = selectedMetric === 'users' ? userData[timeRange] : bookingData[timeRange];
    return data;
  };

  const getSummaryStats = () => {
    const data = getCurrentData();
    const values = data.map(item => item.value);
    const total = values.reduce((sum, val) => sum + val, 0);
    const average = Math.round(total / values.length);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const change = values.length > 1 ? ((values[values.length - 1] - values[values.length - 2]) / values[values.length - 2] * 100).toFixed(1) : 0;

    return { total, average, max, min, change };
  };

  const summaryStats = getSummaryStats();

  // Chart colors
  const chartColors = {
    users: {
      primary: '#667eea',
      secondary: '#764ba2',
      gradient: 'url(#userGradient)'
    },
    bookings: {
      primary: '#f093fb',
      secondary: '#f5576c',
      gradient: 'url(#bookingGradient)'
    }
  };

 

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>CBC Club Dashboard</h1>
          <p>Welcome back! Here's what's happening with your club today.</p>
        </div>
        <div className="header-actions">
          <div className="metric-selector">
            <button 
              className={`metric-btn ${selectedMetric === 'users' ? 'active' : ''}`}
              onClick={() => setSelectedMetric('users')}
            >
              👥 Users
            </button>
            <button 
              className={`metric-btn ${selectedMetric === 'bookings' ? 'active' : ''}`}
              onClick={() => setSelectedMetric('bookings')}
            >
              📅 Bookings
            </button>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="time-range-selector">
        <button 
          className={`time-btn ${timeRange === 'daily' ? 'active' : ''}`}
          onClick={() => setTimeRange('daily')}
        >
          Daily
        </button>
        <button 
          className={`time-btn ${timeRange === 'weekly' ? 'active' : ''}`}
          onClick={() => setTimeRange('weekly')}
        >
          Weekly
        </button>
        <button 
          className={`time-btn ${timeRange === 'monthly' ? 'active' : ''}`}
          onClick={() => setTimeRange('monthly')}
        >
          Monthly
        </button>
        <button 
          className={`time-btn ${timeRange === 'yearly' ? 'active' : ''}`}
          onClick={() => setTimeRange('yearly')}
        >
          Yearly
        </button>
      </div>

      {/* Summary Statistics */}
      <div className="summary-stats">
        <div className="stat-card primary">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total {selectedMetric === 'users' ? 'Users' : 'Bookings'}</h3>
            <div className="stat-value">{summaryStats.total.toLocaleString()}</div>
           
          </div>
        
      
        </div>
      </div>

      {/* Main Chart */}
      <div className="chart-section">
        <div className="chart-header">
          <h2>{selectedMetric === 'users' ? 'User' : 'Booking'} Growth - {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}</h2>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: chartColors[selectedMetric].primary }}></div>
              <span>{selectedMetric === 'users' ? 'Users' : 'Bookings'}</span>
            </div>
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={getCurrentData()}>
              <defs>
                <linearGradient id={`${selectedMetric}Gradient`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors[selectedMetric].primary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={chartColors[selectedMetric].primary} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey={timeRange === 'daily' ? 'date' : timeRange === 'weekly' ? 'week' : timeRange === 'monthly' ? 'month' : 'year'} 
                stroke="#666"
                fontSize={12}
              />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#333' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={chartColors[selectedMetric].primary} 
                strokeWidth={3}
                fill={`url(#${selectedMetric}Gradient)`}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

     

    
    </div>
  );
};

export default Dashboard;
