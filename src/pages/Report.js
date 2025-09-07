import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/database";
import { motion } from "framer-motion";
import Button from '../Components/ui/Button';
import Loader from '../Components/common/Loader';
import "./Report.css";

export default function Report() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const docRef = doc(db, "reports", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setReport({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Report not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Button as={Link} to="/history">
          Back to History
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="report-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="report-page-container">
        <div className="report-header">
          <h2>Report #{report.id.slice(0, 8)}</h2>
          <div className="report-meta">
            <span className="report-date">
              {new Date(report.createdAt?.toDate()).toLocaleDateString()}
            </span>
            <span className={`report-status ${report.status.toLowerCase()}`}>
              {report.status}
            </span>
          </div>
        </div>

        <div className="report-content">
          <div className="report-image-container">
            <div className="image-wrapper">
              <img src={report.imageUrl} alt="Fundus scan" />
              {report.heatmapUrl && (
                <img
                  src={report.heatmapUrl}
                  alt="Heatmap"
                  className="heatmap-overlay"
                  style={{ opacity: 0.5 }}
                />
              )}
            </div>
            <div className="image-caption">
              {report.eyeType === "left" ? "Left Eye" : "Right Eye"} Fundus
              Image
            </div>
          </div>

          <div className="report-details">
            <div className="details-card">
              <h3>Diagnosis</h3>
              <div className="diagnosis-result">
                <span
                  className={`diagnosis-badge ${report.status.toLowerCase()}`}
                >
                  {report.status}
                </span>
                {report.confidence && (
                  <span className="confidence-score">
                    Confidence: {report.confidence}%
                  </span>
                )}
              </div>

              <h3>Description</h3>
              <p className="diagnosis-description">
                {getDiagnosisDescription(report.status)}
              </p>

              <h3>Recommendations</h3>
              <ul className="recommendations-list">
                {getRecommendations(report.status).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="report-actions">
              <Button variant="outline" onClick={generatePDF}>
                Download PDF Report
              </Button>
              <Button as={Link} to="/upload">
                Upload New Image
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function getDiagnosisDescription(status) {
  const descriptions = {
    normal:
      "No signs of diabetic retinopathy detected. The blood vessels in your retina appear healthy.",
    mild: "Mild nonproliferative diabetic retinopathy detected. Some microaneurysms present.",
    moderate:
      "Moderate nonproliferative diabetic retinopathy detected. Some blood vessels are blocked.",
    severe:
      "Severe nonproliferative diabetic retinopathy detected. Many blood vessels are blocked.",
    proliferative:
      "Proliferative diabetic retinopathy detected. New blood vessels are growing on the retina.",
  };

  return (
    descriptions[status.toLowerCase()] ||
    "No description available for this diagnosis."
  );
}

function getRecommendations(status) {
  const baseRecommendations = [
    "Maintain good control of your blood sugar levels",
    "Monitor your blood pressure and keep it under control",
    "Schedule regular eye examinations",
  ];

  const additionalRecommendations = {
    mild: ["Follow up with an eye specialist within 6 months"],
    moderate: [
      "Follow up with an eye specialist within 3-4 months",
      "Consider more frequent monitoring",
    ],
    severe: [
      "Consult an eye specialist immediately",
      "May require laser treatment or other interventions",
    ],
    proliferative: [
      "Urgent consultation with a retinal specialist required",
      "May require laser treatment, injections, or surgery",
    ],
  };

  const statusKey = status.toLowerCase();
  if (additionalRecommendations[statusKey]) {
    return [...baseRecommendations, ...additionalRecommendations[statusKey]];
  }

  return baseRecommendations;
}

async function generatePDF() {
  // Implementation would use jsPDF as shown earlier
  console.log("Generating PDF...");
}
