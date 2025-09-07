import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../services/database';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './Admin.css';

export default function Admin() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || currentUser.email !== 'admin@dr-detector.com') return;

    const usersUnsubscribe = onSnapshot(
      query(collection(db, 'users')),
      (snapshot) => {
        const usersData = [];
        snapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });
        setUsers(usersData);
      }
    );

    const reportsUnsubscribe = onSnapshot(
      query(collection(db, 'reports')),
      (snapshot) => {
        const reportsData = [];
        snapshot.forEach((doc) => {
          reportsData.push({ id: doc.id, ...doc.data() });
        });
        setReports(reportsData);
        setLoading(false);
      }
    );

    return () => {
      usersUnsubscribe();
      reportsUnsubscribe();
    };
  }, [currentUser]);

  if (!currentUser || currentUser.email !== 'admin@dr-detector.com') {
    return (
      <div className="unauthorized">
        <h2>Unauthorized</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="admin-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="admin-page-container">
        <div className="admin-header">
          <h2>Admin Dashboard</h2>
          <p>Manage users and reports</p>
        </div>
        
        {loading ? (
          <div className="loading-placeholder">
            <div className="spinner"></div>
            <p>Loading admin data...</p>
          </div>
        ) : (
          <div className="admin-grid">
            <div className="admin-card">
              <h3>Users</h3>
              <div className="stat-value">{users.length}</div>
              <div className="stat-label">Registered Users</div>
            </div>
            
            <div className="admin-card">
              <h3>Reports</h3>
              <div className="stat-value">{reports.length}</div>
              <div className="stat-label">Total Reports</div>
            </div>
            
            <div className="admin-card wide">
              <h3>Recent Reports</h3>
              <div className="recent-reports">
                {reports.slice(0, 5).map((report) => (
                  <div key={report.id} className="report-item">
                    <div className="report-id">#{report.id.slice(0, 8)}</div>
                    <div className="report-status">{report.status}</div>
                    <div className="report-date">
                      {new Date(report.createdAt?.toDate()).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="admin-card wide">
              <h3>Recent Users</h3>
              <div className="recent-users">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="user-item">
                    <div className="user-name">{user.name || 'No name'}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}