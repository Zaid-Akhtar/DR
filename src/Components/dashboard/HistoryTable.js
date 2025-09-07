import { useState } from 'react';
import { motion } from 'framer-motion';
import ReportCard from './ReportCard';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

import './HistoryTable.css';

export default function HistoryTable({ reports }) {
  const [filter, setFilter] = useState('all');

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.status.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div className="history-container">
      <div className="history-header">
        <h3>Previous Reports</h3>
        
        <div className="filter-controls">
          <Button 
            variant={filter === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilter('all')}
            size="small"
          >
            All
          </Button>
          <Button 
            variant={filter === 'normal' ? 'primary' : 'outline'}
            onClick={() => setFilter('normal')}
            size="small"
          >
            Normal
          </Button>
          <Button 
            variant={filter === 'mild' ? 'primary' : 'outline'}
            onClick={() => setFilter('mild')}
            size="small"
          >
            Mild
          </Button>
          <Button 
            variant={filter === 'moderate' ? 'primary' : 'outline'}
            onClick={() => setFilter('moderate')}
            size="small"
          >
            Moderate
          </Button>
          <Button 
            variant={filter === 'severe' ? 'primary' : 'outline'}
            onClick={() => setFilter('severe')}
            size="small"
          >
            Severe
          </Button>
        </div>
      </div>
      
      {filteredReports.length === 0 ? (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <img src="/assets/illustrations/no-reports.svg" alt="No reports" />
          <p>No reports found</p>
          <Button as={Link} to="/upload">
            Upload Your First Scan
          </Button>
        </motion.div>
      ) : (
        <motion.div 
          className="report-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredReports.map((report) => (
            <ReportCard key={report.id} report={report}>
              <Button as={Link} to={`/report/${report.id}`}>View Report</Button>
            </ReportCard>
          ))}
        </motion.div>
      )}
    </div>
  );
}