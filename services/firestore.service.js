const { db } = require('../config/firebase.config');

exports.getDocument = async (collectionName, docId) => {
  const docRef = db.collection(collectionName).doc(docId);
  const doc = await docRef.get();
  
  if (!doc.exists) {
    return null;
  }
  
  return { id: doc.id, ...doc.data() };
};

exports.queryCollection = async (collectionName, conditions = [], orderBy = null, limit = null) => {
  let ref = db.collection(collectionName);
  
  // Apply conditions
  conditions.forEach(([field, operator, value]) => {
    ref = ref.where(field, operator, value);
  });
  
  // Apply ordering
  if (orderBy) {
    ref = ref.orderBy(orderBy.field, orderBy.direction || 'asc');
  }
  
  // Apply limit
  if (limit) {
    ref = ref.limit(limit);
  }
  
  const snapshot = await ref.get();
  const results = [];
  
  snapshot.forEach(doc => {
    results.push({ id: doc.id, ...doc.data() });
  });
  
  return results;
};

exports.createDocument = async (collectionName, data) => {
  const docRef = await db.collection(collectionName).add({
    ...data,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  return { id: docRef.id, ...data };
};