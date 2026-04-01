import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, CalendarDays, TrendingUp, Activity } from 'lucide-react';
import './Dashboard.css';

const StatCard = ({ title, value, icon, color }) => (
  <div className="stat-card glass-card">
    <div className="stat-icon" style={{ background: color }}>
      {icon}
    </div>
    <div className="stat-info">
      <h3>{title}</h3>
      <div className="stat-value">{value}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeClasses: 0,
  });

  useEffect(() => {
    // In a real app we would call an aggregated stats endpoint
    const fetchStats = async () => {
      try {
        const [membersRes, classesRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/members/'),
          axios.get('http://127.0.0.1:8000/api/classes/')
        ]);
        setStats({
          totalMembers: membersRes.data.length,
          activeClasses: classesRes.data.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="text-muted">Welcome back, here's what's happening today.</p>
        </div>
      </header>
      
      <div className="stats-grid">
        <StatCard 
          title="Total Members" 
          value={stats.totalMembers} 
          icon={<Users size={24} color="white" />} 
          color="linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)"
        />
        <StatCard 
          title="Active Classes" 
          value={stats.activeClasses} 
          icon={<CalendarDays size={24} color="white" />} 
          color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />
        <StatCard 
          title="Revenue (Est.)" 
          value="$12,450" 
          icon={<TrendingUp size={24} color="white" />} 
          color="linear-gradient(135deg, #10b981 0%, #047857 100%)"
        />
        <StatCard 
          title="Avg Attendance" 
          value="84%" 
          icon={<Activity size={24} color="white" />} 
          color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
        />
      </div>

      <div className="dashboard-content">
        <div className="glass-card recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-placeholder">
            <div className="pulse-ring"></div>
            <p>Live tracking active...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
