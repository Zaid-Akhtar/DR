const { admin, db } = require('../config/firebase.config');

module.exports = async (req, res, next) => {
  try {
    // 1. Pehle token check karo
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token nahi mila' });
    }

    // 2. Token verify karo
    const decoded = await admin.auth().verifyIdToken(token);
    
    // 3. Firestore se user data nikalo
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    
    // 4. Check karo admin hai ya nahi
    if (!userDoc.exists || !userDoc.data().isAdmin) {
      return res.status(403).json({ error: 'Sirf admin access kar sakta hai' });
    }

    // 5. Request mein user info attach karo
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      isAdmin: true
    };
    
    next();
  } catch (err) {
    console.error('Admin check error:', err);
    
    // Specific errors handle karo
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token expire ho gaya' });
    }
    
    res.status(500).json({ error: 'Andar koi problem hui' });
  }
};