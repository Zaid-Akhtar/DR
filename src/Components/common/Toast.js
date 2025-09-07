import { useEffect } from 'react';
import { motion } from 'framer-motion';
import './Toast.css';

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className={`toast ${type}`}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
    >
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>
        &times;
      </button>
    </motion.div>
  );
}