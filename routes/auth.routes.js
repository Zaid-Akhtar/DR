const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const adminMiddleware = require('../middleware/admin.middleware');
const { validateRegisterInput } = require('../middleware/validation.middleware');
const { admin, db } = require('../config/firebase.config');
// const { adminLogin } = require('../controllers/auth.controller');

router.post('/register', validateRegisterInput, authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);

// Admin-only routes
router.post('/admin/create-user', adminMiddleware, async (req, res) => {
    try {
      const { email, password, name, isAdmin = false } = req.body;
  
      // 1. Create auth user
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: name
      });
  
      // 2. Create Firestore record
      await db.collection('users').doc(userRecord.uid).set({
        email,
        name,
        isAdmin,
        createdAt: new Date(),
        lastLogin: null
      });
  
      res.status(201).json({
        success: true,
        uid: userRecord.uid,
        email: userRecord.email,
        isAdmin
      });
  
    } catch (error) {
      console.error('Admin create user error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'User creation failed'
      });
    }
  });
  
  // Get all users (admin only)
  router.get('/admin/users', adminMiddleware, async (req, res) => {
    try {
      const snapshot = await db.collection('users').get();
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      res.json({ success: true, users });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
  });
  
  // Update user (admin only)
  router.put('/admin/users/:uid', adminMiddleware, async (req, res) => {
    try {
      const { uid } = req.params;
      const updates = req.body;
  
      await db.collection('users').doc(uid).update({
        ...updates,
        updatedAt: new Date()
      });
  
      res.json({ success: true, message: 'User updated' });
    } catch (error) {
      res.status(400).json({ success: false, error: 'Update failed' });
    }
  });

module.exports = router;