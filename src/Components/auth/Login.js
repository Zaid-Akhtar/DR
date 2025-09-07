import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../services/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from '../ui/Button';
import './Auth.css';

const db = getFirestore();

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const defaultRedirect = location.state?.from?.pathname || '/dashboard';

  async function checkUserRole(user) {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      if (userData?.role === 'admin') {
        return '/admin/dashboard';
      }
      return defaultRedirect;
    } catch (err) {
      console.error('Error checking user role:', err);
      return defaultRedirect;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const redirectPath = await checkUserRole(user);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      const redirectPath = await checkUserRole(user);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <motion.div 
      className="auth-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="auth-background"></div>
      <motion.div 
        className="auth-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to Fundus Vision
        </motion.h2>
        <p className="auth-subtitle">Sign in to continue to your account</p>
        
        {error && (
          <motion.div 
            className="auth-error"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {error}
          </motion.div>
        )}
        
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <div className="password-label-group">
              <label>Password</label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </motion.form>
        
        <div className="auth-divider">or continue with</div>
        
        <motion.button
          className="social-login-button"
          onClick={handleGoogleSignIn}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaGoogle />
          <span>Google</span>
        </motion.button>
        
        <motion.div 
          className="auth-links"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span>
            Don't have an account? {' '}
            <Link to="/register">Create Account</Link>
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}