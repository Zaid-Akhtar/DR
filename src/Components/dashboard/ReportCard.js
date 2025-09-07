import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ReportCard.css';

const statusColors = {
  normal: 'bg-green-100 text-green-800',
  mild: 'bg-blue-100 text-blue-800',
  moderate: 'bg-yellow-100 text-yellow-800',
  severe: 'bg-orange-100 text-orange-800',
  proliferative: 'bg-red-100 text-red-800',
  processing: 'bg-gray-100 text-gray-800'
};

export default function ReportCard({ report }) {
  const getStatusColor = (status) => {
    const statusKey = status.toLowerCase().replace(/\s+/g, '-');
    return statusColors[statusKey] || statusColors.processing;
  };

  return (
    <motion.div 
      className="report-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="report-image">
        <img src={report.imageUrl} alt="Fundus scan" />
      </div>
      
      <div className="report-details">
        <div className="report-header">
          <span className={`status-badge ${getStatusColor(report.status)}`}>
            {report.status}
          </span>
          <span className="report-date">
            {new Date(report.createdAt?.toDate()).toLocaleDateString()}
          </span>
        </div>
        
        <div className="report-info">
          <div className="info-item">
            <span>Eye</span>
            <span>{report.eyeType === 'left' ? 'Left Eye' : 'Right Eye'}</span>
          </div>
          
          {report.confidence && (
            <div className="info-item">
              <span>Confidence</span>
              <span>{report.confidence}%</span>
            </div>
          )}
        </div>
        
        <Link to={`/report/${report.id}`} className="view-report">
          View Full Report
        </Link>
      </div>
    </motion.div>
  );
}