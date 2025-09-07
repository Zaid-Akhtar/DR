const { db } = require('../config/firebase.config');
const { generatePDFReport } = require('../services/pdf.service');

exports.getReport = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const reportRef = db.collection('reports').doc(reportId);
    const doc = await reportRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    next(error);
  }
};

exports.getUserReports = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const reportsRef = db.collection('reports')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc');
    
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

exports.generatePDF = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const reportRef = db.collection('reports').doc(reportId);
    const doc = await reportRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    const reportData = doc.data();
    const userRef = db.collection('users').doc(reportData.userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userData = userDoc.data();
    const pdfBuffer = await generatePDFReport(reportData, userData);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=DR_Report_${reportId}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};