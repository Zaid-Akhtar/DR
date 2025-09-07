const { validateEmail, validatePassword } = require('../utils/validation');

exports.validateRegisterInput = (email, password, name) => {
  const errors = {};
  
  if (!name || name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  if (!email || email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Email is invalid';
  }
  
  if (!password || password.trim() === '') {
    errors.password = 'Password is required';
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 8 characters with uppercase, lowercase and number';
  }
  
  return errors;
};

exports.validateImageUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }
  
  const allowedTypes = ['image/jpeg', 'image/png'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Only JPEG and PNG images are allowed' });
  }
  
  if (req.file.size > maxSize) {
    return res.status(400).json({ error: 'Image size must be less than 5MB' });
  }
  
  if (!req.body.eyeType || !['left', 'right'].includes(req.body.eyeType)) {
    return res.status(400).json({ error: 'Eye type must be either "left" or "right"' });
  }
  
  next();
};