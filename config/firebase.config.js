const admin = require("firebase-admin");
const serviceAccount = require("../../dr-web-b037b-firebase-adminsdk-fbsvc-7e253c6c63.json");

// Initialize Firebase Admin SDK
let db, auth, bucket;

try {
  const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET || "dr-web-b037b.appspot.com",
    databaseURL:
      process.env.FIREBASE_DATABASE_URL ||
      "https://dr-web-b037b.firebaseio.com",
  });

  db = admin.firestore();
  auth = admin.auth();
  bucket = admin.storage().bucket();

  // Recommended Firestore settings
  db.settings({
    ignoreUndefinedProperties: true,
    timestampsInSnapshots: true,
  });

  console.log("Firebase services initialized successfully");
  console.log(`Firestore: ${db !== undefined}`);
  console.log(`Auth: ${auth !== undefined}`);
  console.log(`Storage: ${bucket !== undefined}`);

  // Automatically create admin user if not exists
  createAdminUser();
} catch (error) {
  console.error("Firebase initialization failed:", error);
  process.exit(1);
}

// Admin user creation function
async function createAdminUser() {
  try {
    const adminEmail = "dpretinopathy20@gmail.com";

    // Check if admin user already exists
    const adminUsers = await db
      .collection("users")
      .where("email", "==", adminEmail)
      .limit(1)
      .get();

    if (adminUsers.empty) {
      // Create auth user
      const userRecord = await auth.createUser({
        email: adminEmail,
        password: "diabeticretinapathyproject", // Change this immediately after first login
        displayName: "Hirra",
      });

      // Create Firestore record
      await db.collection("users").doc(userRecord.uid).set({
        email: adminEmail,
        name: "Admin User",
        isAdmin: true,
        createdAt: new Date(),
        lastLogin: null,
      });

      console.log("✅ Admin user created with UID:", userRecord.uid);
      console.log(
        "⚠️ IMPORTANT: Change the admin password immediately after first login!"
      );
    } else {
      console.log("ℹ️ Admin user already exists");
    }
  } catch (error) {
    console.error("Failed to create admin user:", error);
  }
}

// Network connectivity test
const { exec } = require("child_process");
exec("curl -v https://firestore.googleapis.com", (error, stdout) => {
  console.log(
    "Firestore API connectivity:",
    error ? "❌ Failed" : "✅ Success"
  );
});

// Firestore connection test
const testFirestoreConnection = async (attempt = 1, maxAttempts = 3) => {
  try {
    const testRef = db.collection("_server_tests").doc("connection_check");

    await testRef.set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: "testing",
      attempt,
    });

    const doc = await testRef.get();
    if (doc.exists) {
      console.log("✅ Firestore connection verified");
      await testRef.delete();
      return true;
    }
    throw new Error("Document not found after write");
  } catch (error) {
    if (attempt >= maxAttempts) {
      console.error(
        `❌ Firestore connection failed after ${maxAttempts} attempts`
      );
      console.error("Last error:", error.message);
      return false;
    }
    console.log(`⚠️ Firestore test attempt ${attempt} failed, retrying...`);
    await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    return testFirestoreConnection(attempt + 1, maxAttempts);
  }
};

// Run tests
testFirestoreConnection().then((success) => {
  if (!success) {
    console.warn(
      "Firestore connection issues detected, some features may not work"
    );
  }
});

module.exports = { admin, db, auth, bucket };
