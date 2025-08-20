import React, { useState, useMemo } from "react";
import { useGetAllUsersQuery } from "../../api/userApi";
import { useGetAllBookingsQuery } from "../../api/bookingApi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  format,
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
} from "date-fns";
import "./Dashboard.css";
import { FaUsers, FaCalendar } from "react-icons/fa";

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [selectedMetric, setSelectedMetric] = useState("users");

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useGetAllUsersQuery();
  const {
    data: bookings,
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useGetAllBookingsQuery();

  console.log("users", users);
  console.log("bookings", bookings);

  // Helper: group data by period
  const groupByTime = (items, dateKey, range) => {
    const grouped = {};

    items?.forEach((item) => {
      const rawDate = new Date(item[dateKey]);
      let bucket;

      if (range === "daily") {
        bucket = format(startOfDay(rawDate), "MMM dd");
      } else if (range === "weekly") {
        // Show week range (e.g., "May 18 - May 24")
        const weekStart = startOfWeek(rawDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        bucket = `${format(weekStart, "MMM dd")} - ${format(weekEnd, "MMM dd")}`;
      } else if (range === "monthly") {
        bucket = format(startOfMonth(rawDate), "MMM yyyy");
      } else if (range === "yearly") {
        bucket = format(startOfYear(rawDate), "yyyy");
      } else if (range === "quarterly") {
        // Add quarterly grouping
        const month = rawDate.getMonth();
        const quarter = Math.floor(month / 3) + 1;
        const year = rawDate.getFullYear();
        bucket = `Q${quarter} ${year}`;
      }

      grouped[bucket] = (grouped[bucket] || 0) + 1;
    });

    return Object.entries(grouped).map(([key, value]) => ({
      [range === "daily"
        ? "date"
        : range === "weekly"
        ? "week"
        : range === "monthly"
        ? "month"
        : range === "quarterly"
        ? "quarter"
        : "year"]: key,
      value,
    }));
  };

  // Calculate total based on selected time range
  const getTotalForTimeRange = (items, dateKey, range) => {
    if (!items || items.length === 0) return 0;
    
    const now = new Date();
    let cutoffDate;
    
    if (range === "daily") {
      // Last 24 hours
      cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (range === "weekly") {
      // Last 7 days
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === "monthly") {
      // Last 30 days
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (range === "quarterly") {
      // Last 90 days
      cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else if (range === "yearly") {
      // Last 365 days
      cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }
    
    return items.filter(item => new Date(item[dateKey]) >= cutoffDate).length;
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    if (selectedMetric === "users") {
      return groupByTime(users?.users || [], "created_at", timeRange);
    } else {
      return groupByTime(bookings?.bookings || [], "booking_date", timeRange);
    }
  }, [users, bookings, selectedMetric, timeRange]);

  // Calculate current total based on time range
  const currentTotal = useMemo(() => {
    if (selectedMetric === "users") {
      return getTotalForTimeRange(users?.users || [], "created_at", timeRange);
    } else {
      return getTotalForTimeRange(bookings?.bookings || [], "booking_date", timeRange);
    }
  }, [users, bookings, selectedMetric, timeRange]);

  // Chart colors
  const chartColors = {
    users: { primary: "#029ddd" },
    bookings: { primary: "#029ddd" },
  };
  if (usersLoading || bookingsLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (usersError || bookingsError) {
    return (
      <div className="error">
        Error: {usersError?.message || bookingsError?.message}
      </div>
    );
  }
  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 style={{ color: "white", fontSize: "32px", fontWeight: "600" }}>
            CBC Club Dashboard
          </h1>
          <p style={{ color: "white" }}>
            Welcome back! Here's what's happening with your club today.
          </p>
        </div>
        <div className="header-actions">
          <div className="metric-selector">
            <button
              className={`metric-btn ${
                selectedMetric === "users" ? "active" : ""
              }`}
              onClick={() => setSelectedMetric("users")}
            >
              <FaUsers /> Users
            </button>
            <button
              className={`metric-btn ${
                selectedMetric === "bookings" ? "active" : ""
              }`}
              onClick={() => setSelectedMetric("bookings")}
            >
              <FaCalendar /> Bookings
            </button>
          </div>
        </div>
      </div>

      {/* Time Range */}
      <div className="time-range-selector">
        {["daily", "weekly", "monthly", "quarterly", "yearly"].map((range) => (
          <button
            key={range}
            className={`time-btn ${timeRange === range ? "active" : ""}`}
            onClick={() => setTimeRange(range)}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="summary-stats">
        <div className="stat-card primary">
          <div className="stat-icon">
            {selectedMetric === "users" ? <FaUsers /> : <FaCalendar />}
          </div>
          <div className="stat-content">
            <h3>{timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} {selectedMetric === "users" ? "Users" : "Bookings"}</h3>
            <div className="stat-value">
              {currentTotal}
            </div>
            <div className="stat-subtitle">
              {timeRange === "daily" && "Last 24 hours"}
              {timeRange === "weekly" && "Last 7 days"}
              {timeRange === "monthly" && "Last 30 days"}
              {timeRange === "quarterly" && "Last 90 days"}
              {timeRange === "yearly" && "Last 365 days"}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-section">
        <div className="chart-header">
          <h2>
            {selectedMetric === "users" ? "User" : "Booking"} Growth -{" "}
            {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
          </h2>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id={`${selectedMetric}Gradient`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={chartColors[selectedMetric].primary}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColors[selectedMetric].primary}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey={
                  timeRange === "daily"
                    ? "date"
                    : timeRange === "weekly"
                    ? "week"
                    : timeRange === "monthly"
                    ? "month"
                    : timeRange === "quarterly"
                    ? "quarter"
                    : "year"
                }
                stroke="#666"
                fontSize={12}
              />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip />
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
