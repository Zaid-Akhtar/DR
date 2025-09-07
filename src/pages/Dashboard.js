import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiUpload, FiFileText, FiActivity, FiPieChart, FiClock, FiPlus, FiList } from 'react-icons/fi';
import './Dashboard.css';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalReports: 0,
    totalUploads: 0,
    accuracy: '95%'
  });

  return (
    <motion.div
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="dashboard-header">
        <h1>Welcome back, {currentUser?.displayName || 'User'}</h1>
        <p>Monitor your retinal scan analysis and reports</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon reports">
            <FiFileText />
          </div>
          <div className="stat-value">{stats.totalReports}</div>
          <div className="stat-label">Total Reports</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon uploads">
            <FiUpload />
          </div>
          <div className="stat-value">{stats.totalUploads}</div>
          <div className="stat-label">Images Uploaded</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon accuracy">
            <FiPieChart />
          </div>
          <div className="stat-value">{stats.accuracy}</div>
          <div className="stat-label">Detection Accuracy</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {/* Example activity items */}
            <div className="activity-item">
              <div className="activity-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                <FiFileText />
              </div>
              <div className="activity-details">
                <div className="activity-title">New Report Generated</div>
                <div className="activity-time">2 hours ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <FiUpload />
              </div>
              <div className="activity-details">
                <div className="activity-title">Image Uploaded</div>
                <div className="activity-time">5 hours ago</div>
              </div>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <button className="action-button" onClick={() => navigate('/upload')}>
            <FiPlus /> New Scan
          </button>
          <button className="action-button secondary" onClick={() => navigate('/history')}>
            <FiList /> View History
          </button>
          <button className="action-button tertiary" onClick={() => navigate('/profile')}>
            <FiActivity /> View Reports
          </button>
        </div>
      </div>
    </motion.div>
  );
}