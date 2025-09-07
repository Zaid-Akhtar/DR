import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail("");
  };

  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="footer-background">
        <div className="footer-glass"></div>
      </div>

      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <motion.div
              className="footer-logo"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* <img src="/assets/logos/logo.png" alt="Fundus Vision" /> */}
              <span>Fundus Vision</span>
            </motion.div>
            <p className="footer-description">
              Empowering healthcare through advanced diabetic retinopathy
              detection technology.
            </p>
          </div>

          <div className="footer-links-group">
            <div className="footer-links">
              <h4>Quick Links</h4>
              <motion.div
                className="links-container"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <a href="/about">About Us</a>
                <a href="/services">Services</a>
                <a href="/contact">Contact</a>
                <a href="/blog">Blog</a>
              </motion.div>
            </div>

            <div className="footer-links">
              <h4>Support</h4>
              <motion.div
                className="links-container"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <a href="/faq">FAQ</a>
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Service</a>
                <a href="/help">Help Center</a>
              </motion.div>
            </div>
          </div>

          <div className="footer-newsletter">
            <h4>Stay Updated</h4>
            <form onSubmit={handleSubmit}>
              <div className="newsletter-input">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="social-links">
            <motion.a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
            >
              <FaFacebookF />
            </motion.a>
            <motion.a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
            >
              <FaTwitter />
            </motion.a>
            <motion.a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
            >
              <FaLinkedinIn />
            </motion.a>
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
            >
              <FaInstagram />
            </motion.a>
          </div>

          <div className="footer-copyright">
            <p>
              © {new Date().getFullYear()} Fundus Vision. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
