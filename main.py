from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from collections import defaultdict
import os
import cv2
import ssl
import easyocr
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for the Flask app

# Define the uploads directory to point to the React public/uploads folder
# Adjust this path depending on where your main.py is located relative to the React project
uploads_dir = os.path.join(os.getcwd(), 'public', 'uploads')

def clear_uploads_folder():
    if os.path.exists(uploads_dir):
        for filename in os.listdir(uploads_dir):
            file_path = os.path.join(uploads_dir, filename)
            try:
                if os.path.isfile(file_path):
                    os.remove(file_path)
            except Exception as e:
                print(f'Failed to delete {file_path}. Reason: {e}')

@app.route('/clear_uploads', methods=['POST'])
def clear_uploads():
    clear_uploads_folder()
    return jsonify({"message": "Uploads folder cleared!"})

# Function to handle non-serializable types
def convert_types(obj):
    """Recursively convert non-serializable types to JSON serializable types."""
    if isinstance(obj, np.int64):  # Convert numpy int64 to Python int
        return int(obj)
    elif isinstance(obj, np.float64):  # Convert numpy float64 to Python float
        return float(obj)
    elif isinstance(obj, np.ndarray):  # Convert numpy array to list
        return obj.tolist()
    elif isinstance(obj, dict):  # Recursively apply to dictionary items
        return {k: convert_types(v) for k, v in obj.items()}
    elif isinstance(obj, list):  # Recursively apply to list items
        return [convert_types(i) for i in obj]
    return obj  # Return the original object if it doesn't need conversion

@app.route('/upload_multiple', methods=['POST'])
def upload_multiple():
    if 'images' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    files = request.files.getlist('images')
    if not files:
        return jsonify({"error": "No selected files"}), 400

    results = []  # This will hold the results for all images
    all_saved_images = []  # This will hold all saved image paths

    # Ensure the 'uploads' directory exists inside the React public folder
    if not os.path.exists(uploads_dir):
        os.makedirs(uploads_dir)

    for file in files:
        if file.filename == '':
            continue
        
        # Save file to the public/uploads folder in React
        filepath = os.path.join(uploads_dir, file.filename)
        file.save(filepath)

        image_results, saved_images = process_image(filepath, uploads_dir)
        results.append(image_results)
        all_saved_images.extend(saved_images)

    grouped_results = defaultdict(list)
    for index in range(len(results)):
        for res in results[index]:
            if res['text'].isdigit():
                # Convert bbox to list of lists to ensure JSON serializability
                res['bbox'] = [list(point) for point in res['bbox']]
                res['score'] = float(res['score'])  # Ensure score is a float
                res['image_url'] = f'/uploads/{os.path.basename(saved_images[index])}'  # Point to the React public/uploads folder
                grouped_results[res['text']].append(res)

    # Convert defaultdict to regular dict for JSON serialization
    grouped_results = {k: v for k, v in grouped_results.items()}

    # Ensure all types in grouped_results are JSON serializable
    grouped_results = convert_types(grouped_results)

    return jsonify({"grouped_results": grouped_results})

def process_image(filepath, uploads_dir):
    img = cv2.imread(filepath)
    if img is None:
        return [], "Image not found or couldn't be loaded."

    ssl._create_default_https_context = ssl._create_unverified_context
    reader = easyocr.Reader(['en'], gpu=False)
    text_ = reader.readtext(img)

    results = []
    threshold = 0.25
    text_count = defaultdict(int)

    for t in text_:
        bbox, text, score = t
        if score > threshold:
            clean_text = ''.join(filter(str.isdigit, text))
            if clean_text:
                results.append({
                    'bbox': [list(point) for point in bbox],  # Ensure bbox is a list of lists
                    'text': clean_text,
                    'score': float(score)  # Ensure score is a float
                })
                text_count[clean_text] += 1
                base_image_name = f'{clean_text}'
                count = text_count[clean_text]
                result_image_name = f'{base_image_name}_{count}.jpg'
                while os.path.exists(os.path.join(uploads_dir, result_image_name)):
                    count += 1
                    result_image_name = f'{base_image_name}_{count}.jpg'
                result_image_path = os.path.join(uploads_dir, result_image_name)
                bbox = np.array(bbox).astype(int)
                cv2.rectangle(img, tuple(bbox[0]), tuple(bbox[2]), (0, 255, 0), 2)
                cv2.imwrite(result_image_path, img)

    saved_image_urls = []
    for text, count in text_count.items():
        for i in range(1, count + 1):
            saved_image_name = f'{text}_{i}.jpg'
            saved_image_urls.append(f'/uploads/{saved_image_name}')

    return results, saved_image_urls

# Route to serve the images from the React public/uploads folder
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(os.path.join(os.getcwd(), 'public', 'uploads'), filename)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3001, debug=True)
