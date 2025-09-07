const axios = require('axios');
const { db } = require('../config/firebase.config');
const logger = require('../utils/logger');

exports.predictDRStage = async (imageUrl, reportId, userId) => {
  try {
    // Call your ML model API
    const response = await axios.post(process.env.ML_API_URL, {
      image_url: imageUrl
    });
    
    const { prediction, confidence, heatmap_url } = response.data;
    
    // Update report in Firestore
    await db.collection('reports').doc(reportId).update({
      status: prediction,
      confidence: Math.round(confidence * 100),
      heatmapUrl: heatmap_url,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    logger.info(`Prediction completed for report ${reportId}: ${prediction} (${confidence}%)`);
    
    // Optionally send notification to user
    // await sendPredictionNotification(userId, reportId, prediction);
    
    return { success: true };
  } catch (error) {
    logger.error(`Prediction failed for report ${reportId}: ${error.message}`);
    
    // Mark as failed in Firestore
    await db.collection('reports').doc(reportId).update({
      status: 'failed',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: false, error: error.message };
  }
};