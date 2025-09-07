const { db } = require('../config/firebase.config');

class Report {
  constructor({ userId, eyeType, imageUrl, status, prediction, confidence, heatmapUrl, createdAt }) {
    this.userId = userId;
    this.eyeType = eyeType;
    this.imageUrl = imageUrl;
    this.status = status || 'processing';
    this.prediction = prediction || null;
    this.confidence = confidence || null;
    this.heatmapUrl = heatmapUrl || null;
    this.createdAt = createdAt || new Date();
  }

  static async create(reportData) {
    const reportRef = db.collection('reports').doc();
    const report = new Report(reportData);
    
    await reportRef.set({
      userId: report.userId,
      eyeType: report.eyeType,
      imageUrl: report.imageUrl,
      status: report.status,
      prediction: report.prediction,
      confidence: report.confidence,
      heatmapUrl: report.heatmapUrl,
      createdAt: admin.firestore.Timestamp.fromDate(report.createdAt)
    });
    
    return { id: reportRef.id, ...report };
  }

  static async findById(reportId) {
    const reportRef = db.collection('reports').doc(reportId);
    const doc = await reportRef.get();
    
    if (!doc.exists) {
      return null;
    }
    
    return { id: doc.id, ...doc.data() };
  }

  static async update(reportId, updates) {
    const reportRef = db.collection('reports').doc(reportId);
    
    await reportRef.update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    const updatedDoc = await reportRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  }

  static async findByUserId(userId, limit = 10) {
    const reportsRef = db.collection('reports')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit);
    
    const snapshot = await reportsRef.get();
    const reports = [];
    
    snapshot.forEach(doc => {
      reports.push({ id: doc.id, ...doc.data() });
    });
    
    return reports;
  }
}

module.exports = Report;