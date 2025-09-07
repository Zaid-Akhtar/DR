import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../Components/ui/Button";
import HeroImage from "../assets/backgrounds/home-1.jpg";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Early Detection of Diabetic Retinopathy</h1>
          <p>
            Protect your vision with our AI-powered platform that detects
            diabetic retinopathy with high accuracy. Early detection can prevent
            vision loss and help manage your eye health effectively.
          </p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button as={Link} to="/upload" size="large">
              Start Free Scan
            </Button>
            <Button variant="outline" as={Link} to="/login" size="large">
              Sign In
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img src={HeroImage} alt="AI Retina Analysis" />
        </motion.div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose Fundus Vision?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <motion.div
          className="cta-card"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3>Take the First Step Towards Better Eye Health</h3>
          <Button
            as={Link}
            to="/register"
            size="large"
            style={{
              background: "white",
              color: "#2563eb",
              padding: "1rem 2rem",
              fontSize: "1.125rem",
            }}
          >
            Create Free Account
          </Button>
        </motion.div>
      </section>
    </div>
  );
}

const stats = [
  {
    number: "98%",
    label: "Detection Accuracy",
  },
  {
    number: "50K+",
    label: "Scans Analyzed",
  },
  {
    number: "24/7",
    label: "Available Support",
  },
  {
    number: "100%",
    label: "Data Security",
  },
];

const features = [
  {
    title: "AI-Powered Analysis",
    description:
      "Our advanced deep learning algorithms provide accurate detection of diabetic retinopathy stages within minutes.",
    icon: "🤖",
  },
  {
    title: "Instant Results",
    description:
      "Get comprehensive analysis reports immediately after uploading your fundus image.",
    icon: "⚡",
  },
  {
    title: "Secure Storage",
    description:
      "Your medical data is encrypted and securely stored with enterprise-grade security protocols.",
    icon: "🔒",
  },
  {
    title: "Expert Support",
    description:
      "Access to professional ophthalmologists for result interpretation and consultation.",
    icon: "👨‍⚕️",
  },
  {
    title: "Easy to Use",
    description:
      "User-friendly interface designed for both healthcare professionals and patients.",
    icon: "👍",
  },
  {
    title: "Regular Updates",
    description:
      "Our AI models are continuously trained with new data to improve accuracy.",
    icon: "🔄",
  },
];
