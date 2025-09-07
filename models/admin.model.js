const { db } = require('../config/firebase.config');

class Admin {
  static async getStats() {
    const [usersSnapshot, reportsSnapshot] = await Promise.all([
      db.collection('users').get(),
      db.collection('reports').get()
    ]);
    
    const stats = {
      totalUsers: usersSnapshot.size,
      totalReports: reportsSnapshot.size,
      reportsByStatus: {
        normal: 0,
        mild: 0,
        moderate: 0,
        severe: 0,
        proliferative: 0,
        processing: 0
      }
    };
    
    reportsSnapshot.forEach(doc => {
      const status = doc.data().status.toLowerCase();
      if (stats.reportsByStatus[status] !== undefined) {
        stats.reportsByStatus[status]++;
      }
    });
    
    return stats;
  }

  static async getAllUsers(limit = 10, offset = 0) {
    const usersRef = db.collection('users')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset(offset);
    
    const snapshot = await usersRef.get();
    const users = [];
    
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return users;
  }

  static async getAllReports(limit = 10, offset = 0, status = null) {
    let reportsRef = db.collection('reports')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset(offset);
    
    if (status) {
      reportsRef = reportsRef.where('status', '==', status);
    }
    
    const snapshot = await reportsRef.get();
    const reports = [];
    
    snapshot.forEach(doc => {
      reports.push({ id: doc.id, ...doc.data() });
    });
    
    return reports;
  }
}

module.exports = Admin;