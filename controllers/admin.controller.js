const { db } = require('../config/firebase.config');

exports.getStats = async (req, res, next) => {
  try {
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
    
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const usersRef = db.collection('users')
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset));
    
    const snapshot = await usersRef.get();
    const users = [];
    
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

exports.getAllReports = async (req, res, next) => {
  try {
    const { limit = 10, offset = 0, status } = req.query;
    let reportsRef = db.collection('reports')
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset));
    
    if (status) {
      reportsRef = reportsRef.where('status', '==', status);
    }
    
    const snapshot = await reportsRef.get();
    const reports = [];
    
    snapshot.forEach(doc => {
      reports.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).json({ reports });
  } catch (error) {
    next(error);
  }
};