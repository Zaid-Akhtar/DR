const nodemailer = require('nodemailer');
const logger = require('./logger');
const { EMAIL_SERVICE, EMAIL_USERNAME, EMAIL_PASSWORD } = require('../config/environment');

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD
  }
});

exports.sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"DR Detector" <${EMAIL_USERNAME}>`,
      to: email,
      subject: 'Welcome to DR Detector',
      html: `
        <h1>Welcome to DR Detector, ${name}!</h1>
        <p>Thank you for registering with our service. We're excited to help you monitor your eye health.</p>
        <p>You can now upload your fundus images and get instant analysis of diabetic retinopathy.</p        
        <p>If you have any questions, feel free to reply to this email.</p>
        <p>Best regards,</p>
        <p>The DR Detector Team</p>
      `
    });
    logger.info(`Welcome email sent to ${email}`);
  } catch (error) {
    logger.error(`Failed to send welcome email to ${email}: ${error.message}`);
  }
};

exports.sendPasswordResetEmail = async (email, resetLink) => {
  try {
    await transporter.sendMail({
      from: `"DR Detector" <${EMAIL_USERNAME}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>We received a request to reset your password. Click the link below to proceed:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #4299e1; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,</p>
        <p>The DR Detector Team</p>
      `
    });
    logger.info(`Password reset email sent to ${email}`);
  } catch (error) {
    logger.error(`Failed to send password reset email to ${email}: ${error.message}`);
  }
};

exports.sendPredictionNotification = async (email, name, reportId, prediction) => {
  try {
    const reportLink = `${process.env.FRONTEND_URL}/report/${reportId}`;
    
    await transporter.sendMail({
      from: `"DR Detector" <${EMAIL_USERNAME}>`,
      to: email,
      subject: `Your DR Detection Result: ${prediction}`,
      html: `
        <h1>Your Report is Ready</h1>
        <p>Hello ${name},</p>
        <p>Your diabetic retinopathy analysis is complete with the following result:</p>
        <h2 style="color: ${getStatusColor(prediction)}">${prediction}</h2>
        <p>View your full report:</p>
        <a href="${reportLink}" style="display: inline-block; padding: 10px 20px; background-color: #4299e1; color: white; text-decoration: none; border-radius: 5px;">View Report</a>
        <p>Best regards,</p>
        <p>The DR Detector Team</p>
      `
    });
    logger.info(`Prediction notification sent to ${email}`);
  } catch (error) {
    logger.error(`Failed to send prediction notification to ${email}: ${error.message}`);
  }
};

function getStatusColor(status) {
  const colors = {
    'Normal': '#38a169',
    'Mild': '#3182ce',
    'Moderate': '#dd6b20',
    'Severe': '#e53e3e',
    'Proliferative': '#805ad5'
  };
  return colors[status] || '#718096';
}