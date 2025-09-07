import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../services/database';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import HistoryTable from '../Components/dashboard/HistoryTable';
import './History.css';

export default function History() {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'reports'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reportsData = [];
      querySnapshot.forEach((doc) => {
        reportsData.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by date (newest first)
      reportsData.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
      setReports(reportsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <motion.div
      className="history-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="history-page-container">
        <div className="history-header">
          <h2>Your Reports</h2>
          <p>View and manage your previous diabetic retinopathy reports</p>
        </div>
        
        {loading ? (
          <div className="loading-placeholder">
            <div className="spinner"></div>
            <p>Loading your reports...</p>
          </div>
        ) : (
          <HistoryTable reports={reports} />
        )}
      </div>
    </motion.div>
  );
}