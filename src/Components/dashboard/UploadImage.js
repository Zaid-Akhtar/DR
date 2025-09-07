import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../services/storage';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../services/database';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Loader from '../common/Loader';
import './UploadImage.css';

export default function UploadImage() {
  const [eyeType, setEyeType] = useState('left');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { currentUser } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `retina-scans/${currentUser.uid}/${Date.now()}_${eyeType}.jpg`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);
      
      // Save metadata to Firestore
      await addDoc(collection(db, 'reports'), {
        userId: currentUser.uid,
        eyeType,
        imageUrl,
        createdAt: new Date(),
        status: 'processing'
      });
      
      // Reset form
      setImage(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // TODO: Redirect to report page or show success message
    } catch (err) {
      console.error(err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div 
      className="upload-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2>Upload Fundus Image</h2>
      
      <div className="eye-selector">
        <Button 
          variant={eyeType === 'left' ? 'primary' : 'outline'}
          onClick={() => setEyeType('left')}
        >
          Left Eye
        </Button>
        <Button 
          variant={eyeType === 'right' ? 'primary' : 'outline'}
          onClick={() => setEyeType('right')}
        >
          Right Eye
        </Button>
      </div>
      
      <div className="upload-area">
        {preview ? (
          <div className="image-preview">
            <img src={preview} alt="Fundus preview" />
            <Button variant="text" onClick={() => {
              setImage(null);
              setPreview(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}>
              Change Image
            </Button>
          </div>
        ) : (
          <label className="dropzone">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            <div className="dropzone-content">
              <svg viewBox="0 0 24 24" width="48" height="48">
                <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </svg>
              <p>Click to upload or drag and drop</p>
              <p className="small">JPEG, PNG (Max 5MB)</p>
            </div>
          </label>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <Button 
        onClick={handleUpload}
        disabled={!image || isUploading}
        className="upload-button"
      >
        {isUploading ? (
          <>
            <Loader size="small" />
            Processing...
          </>
        ) : 'Upload Image'}
      </Button>
    </motion.div>
  );
}