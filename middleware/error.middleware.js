const logger = require('../utils/logger');

exports.errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  if (err.code === 'auth/email-already-exists') {
    return res.status(400).json({ error: 'Email already in use' });
  }
  
  if (err.code === 'auth/invalid-email') {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  if (err.code === 'auth/weak-password') {
    return res.status(400).json({ error: 'Password should be at least 6 characters' });
  }
  
  if (err.code === 'storage/object-not-found') {
    return res.status(404).json({ error: 'File not found' });
  }
  
  res.status(500).json({ error: 'Something went wrong' });
};

exports.notFound = (req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
};