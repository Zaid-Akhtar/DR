import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../services/auth";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import Button from '../ui/Button';
import Logo from '../../assets/logos/logo-1.png';
import "./Navbar.css";

export default function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }

  const navLinks = currentUser ? (
    <>
      <NavLink
        to="/dashboard"
        className={({ isActive }) => (isActive ? "active" : "")}
        onClick={() => setIsOpen(false)}
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/upload"
        className={({ isActive }) => (isActive ? "active" : "")}
        onClick={() => setIsOpen(false)}
      >
        Upload
      </NavLink>
      <NavLink
        to="/history"
        className={({ isActive }) => (isActive ? "active" : "")}
        onClick={() => setIsOpen(false)}
      >
        History
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) => (isActive ? "active" : "")}
        onClick={() => setIsOpen(false)}
      >
        Profile
      </NavLink>
      <Button 
        variant="text" 
        onClick={() => {
          handleLogout();
          setIsOpen(false);
        }}
      >
        Logout
      </Button>
    </>
  ) : (
    <>
      <NavLink
        to="/login"
        className={({ isActive }) => (isActive ? "active" : "")}
        onClick={() => setIsOpen(false)}
      >
        Login
      </NavLink>
      <NavLink
        to="/register"
        className={({ isActive }) => (isActive ? "active" : "")}
        onClick={() => setIsOpen(false)}
      >
        Register
      </NavLink>
    </>
  );

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="navbar-glass"></div>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <motion.img 
            src={Logo} 
            alt="Fundus Vision"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Fundus Vision
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links desktop-nav">
          {navLinks}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </motion.button>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="navbar-links mobile-nav"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {navLinks}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
