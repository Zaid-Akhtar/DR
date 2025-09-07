const { db } = require('../config/firebase.config');

exports.createUserRecord = async (uid, userData) => {
  const userRef = db.collection('users').doc(uid);
  
  await userRef.set({
    email: userData.email,
    name: userData.name,
    role: 'user',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  return { id: uid, ...userData };
};

exports.getUserByEmail = async (email) => {
  const usersRef = db.collection('users').where('email', '==', email).limit(1);
  const snapshot = await usersRef.get();
  
  if (snapshot.empty) {
    return null;
  }
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};