const { storage } = require('../config/firebase.config');

exports.uploadFile = async (path, buffer, contentType) => {
  const file = storage.file(path);
  
  await file.save(buffer, {
    metadata: { contentType },
    public: true
  });
  
  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: '03-09-2491'
  });
  
  return url;
};

exports.deleteFile = async (path) => {
  const file = storage.file(path);
  const [exists] = await file.exists();
  
  if (exists) {
    await file.delete();
    return true;
  }
  
  return false;
};