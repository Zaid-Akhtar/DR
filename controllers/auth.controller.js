const { auth, admin, db } = require("../config/firebase.config");
const { createUserRecord } = require("../services/auth.service");
const {
  validateRegisterInput,
} = require("../middleware/validation.middleware");
const { sendWelcomeEmail, sendPasswordResetEmail } = require("../utils/email");

// Common error messages
const authErrors = {
  "auth/user-not-found": "Invalid email or password",
  "auth/wrong-password": "Invalid email or password",
  "auth/too-many-requests": "Too many attempts. Try again later.",
};

// Common function to verify user credentials
const verifyCredentials = async (email, password) => {
  try {
    // Verify with Firebase Auth
    const userCredential = await admin
      .auth()
      .signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (err) {
    err.code = err.code || "auth/generic-error";
    throw err;
  }
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    const errors = validateRegisterInput(email, password, name);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Create Firebase auth user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false,
    });

    // Set admin status based on email
    const isAdmin = email === "drretinopathy20@gmail.com";

    // Create user document in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      name,
      email,
      isAdmin,
      createdAt: new Date(),
      lastLogin: null,
    });

    // Send verification email
    const verificationLink = await auth.generateEmailVerificationLink(email);
    await sendWelcomeEmail(email, name, verificationLink);

    res.status(201).json({
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName,
      isAdmin,
      emailVerified: false,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Verify credentials
    const user = await verifyCredentials(email, password);

    // 2. Get user document
    const userDoc = await db.collection("users").doc(user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not registered" });
    }

    // 3. Update last login
    await db.collection("users").doc(user.uid).update({
      lastLogin: new Date(),
    });

    res.status(200).json({
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      isAdmin: userDoc.data().isAdmin || false,
      token: await admin.auth().createCustomToken(user.uid),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(401).json({
      error: authErrors[err.code] || "Authentication failed",
      details: err.message,
    });
  }
};

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Verify credentials
    const user = await verifyCredentials(email, password);

    // 2. Get and verify admin status
    const userDoc = await db.collection("users").doc(user.uid).get();

    if (!userDoc.exists || !userDoc.data().isAdmin) {
      return res.status(403).json({ error: "Admin access denied" });
    }

    // 3. Update last login
    await db.collection("users").doc(user.uid).update({
      lastLogin: new Date(),
    });

    res.status(200).json({
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      isAdmin: true,
      role: userDoc.data().role || "admin",
      token: await admin.auth().createCustomToken(user.uid),
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(401).json({
      error: authErrors[err.code] || "Admin authentication failed",
      details: err.message,
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userRecord = await auth.getUserByEmail(email);

    const resetLink = await auth.generatePasswordResetLink(email, {
      url: `${process.env.FRONTEND_URL}/reset-password`,
      handleCodeInApp: true,
    });

    await sendPasswordResetEmail(email, {
      resetLink,
      name: userRecord.displayName || "User",
    });

    res.status(200).json({
      message: "Reset email sent",
      email: userRecord.email,
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(200).json({
      message: "If this email exists, a reset link was sent",
    });
  }
};

module.exports = exports;
