import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUpload, FiImage, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import './Upload.css';

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setError('');
    const selectedFile = acceptedFiles[0];
    
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Your upload logic here
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="upload-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="upload-header">
        <h1>Upload Retinal Image</h1>
        <p>Upload a clear fundus image for diabetic retinopathy detection</p>
      </div>

      <div className="upload-content">
        <div className="upload-area">
          <div 
            {...getRootProps()} 
            className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
          >
            <input {...getInputProps()} />
            <FiUpload className="upload-icon" />
            {isDragActive ? (
              <div className="upload-text">Drop the image here</div>
            ) : (
              <>
                <div className="upload-text">
                  Drag & drop your image here, or click to select
                </div>
                <div className="upload-subtext">
                  Supports JPG, JPEG, PNG (max 10MB)
                </div>
              </>
            )}
          </div>

          {preview && (
            <div className="preview-container">
              <img 
                src={preview} 
                alt="Preview" 
                className="image-preview"
              />
              <button 
                className="upload-button"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <FiImage /> Analyze Image
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="error-message">
              <FiAlertCircle /> {error}
            </div>
          )}
        </div>

        <div className="upload-guidelines">
          <h2>Upload Guidelines</h2>
          <div className="guideline-item">
            <FiInfo className="guideline-icon" />
            <div className="guideline-text">
              Image should be clear and well-focused, showing the entire retina
            </div>
          </div>
          <div className="guideline-item">
            <FiInfo className="guideline-icon" />
            <div className="guideline-text">
              Ensure proper lighting and no blur in the image
            </div>
          </div>
          <div className="guideline-item">
            <FiInfo className="guideline-icon" />
            <div className="guideline-text">
              File size should not exceed 10MB
            </div>
          </div>
          <div className="guideline-item">
            <FiInfo className="guideline-icon" />
            <div className="guideline-text">
              Supported formats: JPG, JPEG, PNG
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
