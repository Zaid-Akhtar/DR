import requests

def test_prediction(image_path):
    url = "http://localhost:5000/api/predict"
    
    # Open image file
    with open(image_path, 'rb') as f:
        files = {'image': f}
        
        # Send POST request
        response = requests.post(url, files=files)
        
        # Print results
        if response.status_code == 200:
            result = response.json()
            print("\nPrediction Results:")
            print(f"DR Level: {result['prediction']['level']}")
            print(f"Confidence: {result['prediction']['confidence']:.2%}")
            print(f"Class: {result['prediction']['class']}")
        else:
            print(f"Error: {response.text}")

# Example usage
if __name__ == "__main__":
    # Replace with path to your retinal image
    image_path = "path/to/your/retinal/image.jpg"
    test_prediction(image_path) 