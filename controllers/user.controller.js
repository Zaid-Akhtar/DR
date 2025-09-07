const { auth } = require('../config/firebase.config');
const { db } = require('../config/firebase.config');

exports.getUserProfile = async (req, res, next) => {
  try {
    //  Change from req.user to req.params (frontend se UID bhejega)
    const { userId } = req.params; 
    
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(doc.data()); //  Direct data bhejo
  } catch (error) {
    next(error);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { name, email } = req.body;
    
    // Update Firebase auth
    await auth.updateUser(userId, {
      displayName: name,
      email: email
    });
    
    // Update Firestore
    await db.collection('users').doc(userId).update({
      name,
      email,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteUserAccount = async (req, res, next) => {
  try {
    const { userId } = req.user;
    
    // Delete auth record
    await auth.deleteUser(userId);
    
    // Delete user document (Firestore will handle related data via triggers)
    await db.collection('users').doc(userId).delete();
    
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};