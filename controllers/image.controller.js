const { storage } = require('../config/firebase.config');
const { db } = require('../config/firebase.config');
const { predictDRStage } = require('../services/ml.service');
const { generatePDFReport } = require('../services/pdf.service');
const { v4: uuidv4 } = require('uuid');

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { userId } = req.user;
    const { eyeType } = req.body;
    
    // Generate unique filename
    const filename = `retina-scans/${userId}/${uuidv4()}_${eyeType}.jpg`;
    const file = storage.file(filename);
    
    // Upload image to Firebase Storage
    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
      public: true
    });
    
    // Get public URL
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491' // Far future date
    });
    
    // Create report document in Firestore
    const reportRef = await db.collection('reports').add({
      userId,
      eyeType,
      imageUrl: url,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'processing'
    });
    
    // Call ML model for prediction (async)
    predictDRStage(url, reportRef.id, userId);
    
    res.status(201).json({
      reportId: reportRef.id,
      imageUrl: url,
      message: 'Image uploaded successfully. Processing...'
    });
  } catch (error) {
    next(error);
  }
};

exports.getImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;
    const file = storage.file(`retina-scans/${imageId}`);
    
    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491'
    });
    
    res.status(200).json({ imageUrl: url });
  } catch (error) {
    next(error);
  }
};