import os
import numpy as np
import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Load the model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'jupyter', 'best_model_advanced.h5')
model = None

def load_model():
    global model
    if model is None:
        model = tf.keras.models.load_model(MODEL_PATH)
    return model

def advanced_preprocessing(image):
    try:
        # Convert to uint8 if needed
        if image.dtype != np.uint8:
            image = (image * 255).astype(np.uint8)
        
        # Convert to LAB color space
        lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        
        # Apply CLAHE to L channel
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
        l2 = clahe.apply(l)
        
        # Merge channels
        lab = cv2.merge((l2,a,b))
        
        # Convert back to RGB
        image = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
        
        # Apply Gaussian blur to reduce noise
        image = cv2.GaussianBlur(image, (3,3), 0)
        
        # Enhance contrast
        image = cv2.addWeighted(image, 1.2, image, 0, 0)
        
        # Normalize
        image = image.astype(np.float32) / 255.0
        
        return image
    except Exception as e:
        print(f"Error in preprocessing: {str(e)}")
        return image / 255.0

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # Check if image was sent
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        # Read image file
        file = request.files['image']
        image = Image.open(io.BytesIO(file.read()))
        
        # Convert to numpy array
        image = np.array(image)
        
        # Ensure image is RGB
        if len(image.shape) == 2:  # Grayscale
            image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
        elif image.shape[2] == 4:  # RGBA
            image = cv2.cvtColor(image, cv2.COLOR_RGBA2RGB)
        
        # Resize image
        image = cv2.resize(image, (456, 456))
        
        # Preprocess image
        processed_image = advanced_preprocessing(image)
        
        # Add batch dimension
        processed_image = np.expand_dims(processed_image, axis=0)
        
        # Load model and get prediction
        model = load_model()
        prediction = model.predict(processed_image)
        
        # Get predicted class and confidence
        predicted_class = int(np.argmax(prediction[0]))
        confidence = float(prediction[0][predicted_class])
        
        # Map DR levels to their meanings
        dr_levels = {
            0: "No DR",
            1: "Mild DR",
            2: "Moderate DR",
            3: "Severe DR",
            4: "Proliferative DR"
        }
        
        return jsonify({
            'success': True,
            'prediction': {
                'class': predicted_class,
                'level': dr_levels[predicted_class],
                'confidence': confidence,
                'probabilities': prediction[0].tolist()
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Load model on startup
    load_model()
    app.run(debug=True, port=5000) 