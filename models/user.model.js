const { db } = require('../config/firebase.config');

class User {
  constructor({ email, name, createdAt, updatedAt, role = 'user' }) {
    this.email = email;
    this.name = name;
    this.role = role;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  static async create(uid, userData) {
    const userRef = db.collection('users').doc(uid);
    const user = new User(userData);
    
    await userRef.set({
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: admin.firestore.Timestamp.fromDate(user.createdAt),
      updatedAt: admin.firestore.Timestamp.fromDate(user.updatedAt)
    });
    
    return { id: uid, ...user };
  }

  static async findById(uid) {
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();
    
    if (!doc.exists) {
      return null;
    }
    
    return { id: doc.id, ...doc.data() };
  }

  static async update(uid, updates) {
    const userRef = db.collection('users').doc(uid);
    
    await userRef.update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    const updatedDoc = await userRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  }

  static async delete(uid) {
    await db.collection('users').doc(uid).delete();
    return true;
  }

  static async isAdmin(uid) {
    const userDoc = await db.collection('users').doc(uid).get();
    return userDoc.exists && userDoc.data().isAdmin === true;
  }
}

module.exports = User;