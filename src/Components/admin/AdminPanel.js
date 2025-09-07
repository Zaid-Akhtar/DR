import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/auth';
import './AdminPanel.css';
import { FiUsers, FiFileText, FiSettings, FiActivity, FiLogOut, FiHome } from 'react-icons/fi';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-panel">
        <aside className="admin-sidebar">
          <ul className="admin-nav">
            <li className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('dashboard')}>
                <FiHome /> Dashboard
              </button>
            </li>
            <li className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('users')}>
                <FiUsers /> Users
              </button>
            </li>
            <li className={`admin-nav-item ${activeTab === 'reports' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('reports')}>
                <FiFileText /> Reports
              </button>
            </li>
            <li className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('settings')}>
                <FiSettings /> Settings
              </button>
            </li>
          </ul>
        </aside>

        <main className="admin-main">
          <header className="admin-header">
            <div className="admin-header-content">
              <h1>Admin Dashboard</h1>
              <button onClick={handleLogout} className="logout-button">
                <FiLogOut /> Logout
              </button>
            </div>
          </header>

          <div className="admin-content">
            <div className="admin-stats">
              <div className="stat-card">
                <div className="stat-icon users">
                  <FiUsers />
                </div>
                <div className="stat-info">
                  <h3>Total Users</h3>
                  <p className="stat-number">0</p>
                  <p className="stat-description">Active users in system</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon reports">
                  <FiFileText />
                </div>
                <div className="stat-info">
                  <h3>Total Reports</h3>
                  <p className="stat-number">0</p>
                  <p className="stat-description">Generated reports</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon sessions">
                  <FiActivity />
                </div>
                <div className="stat-info">
                  <h3>Active Sessions</h3>
                  <p className="stat-number">0</p>
                  <p className="stat-description">Current active sessions</p>
                </div>
              </div>
            </div>

            <div className="admin-recent-activity">
              <div className="section-header">
                <h2>Recent Activity</h2>
                <button className="refresh-button">
                  Refresh
                </button>
              </div>
              <div className="activity-list">
                <p className="no-activity">No recent activity to display</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel; 