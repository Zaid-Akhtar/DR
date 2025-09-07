const moment = require('moment');

exports.formatDate = (date, format = 'MMMM D, YYYY') => {
  return moment(date).format(format);
};

exports.calculateAge = (birthDate) => {
  return moment().diff(moment(birthDate), 'years');
};

exports.generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

exports.sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};