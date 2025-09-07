import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/database';
import { motion } from 'framer-motion';
import Button from '../Components/ui/Button';
import './Profile.css';

export default function Profile() {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchUserData() {
      if (!currentUser) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setName(userDoc.data().name || '');
        }
        setEmail(currentUser.email || '');
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [currentUser]);

  async function handleSave() {
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: name.trim()
      });
      
      setSuccess('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  }

  if (loading && !editing) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="profile-page-container">
        <div className="profile-header">
          <h2>Your Profile</h2>
          <p>Manage your account information</p>
        </div>
        
        <div className="profile-card">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <div className="profile-field">
            <label>Name</label>
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            ) : (
              <div className="profile-value">{name || 'Not set'}</div>
            )}
          </div>
          
          <div className="profile-field">
            <label>Email</label>
            <div className="profile-value">{email}</div>
          </div>
          
          <div className="profile-actions">
            {editing ? (
              <>
                <Button 
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    setError('');
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}