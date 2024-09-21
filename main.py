from flask import Flask, render_template, request, send_from_directory
import cv2
import ssl
import easyocr
import numpy as np
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return "No file part"
    file = request.files['image']
    if file.filename == '':
        return "No selected file"
    
    # Create uploads directory if it doesn't exist
    uploads_dir = 'uploads'
    if not os.path.exists(uploads_dir):
        os.makedirs(uploads_dir)

    # Save the uploaded file
    filepath = os.path.join(uploads_dir, file.filename)
    file.save(filepath)

    return process_image(filepath, uploads_dir)

@app.route('/upload_multiple', methods=['POST'])
def upload_multiple():
    if 'images' not in request.files:
        return "No file part"
    
    files = request.files.getlist('images')
    if not files:
        return "No selected files"

    results = []
    result_images = []
    uploads_dir = 'uploads'
    if not os.path.exists(uploads_dir):
        os.makedirs(uploads_dir)

    # Process each uploaded file
    for file in files:
        if file.filename == '':
            continue
        
        # Save the uploaded file
        filepath = os.path.join(uploads_dir, file.filename)
        file.save(filepath)

        # Process image and store results
        image_results, result_image_path = process_image(filepath, uploads_dir)
        results.extend(image_results)
        result_images.append(result_image_path)

    return render_template('results_multiple.html', results=results, result_images=result_images)

def process_image(filepath, uploads_dir):
    # Perform OCR on the uploaded image
    img = cv2.imread(filepath)
    ssl._create_default_https_context = ssl._create_unverified_context
    reader = easyocr.Reader(['en'], gpu=False)
    text_ = reader.readtext(img)

    results = []
    for t in text_:
        bbox, text, score = t
        if text.isdigit():  # Include all detected text (text.isdigit() for digits only)
            results.append({
                'bbox': bbox,
                'text': text,
                'score': score
            })
            # Draw bounding box on the image
            bbox = np.array(bbox).astype(int)
            cv2.rectangle(img, tuple(bbox[0]), tuple(bbox[2]), (0, 255, 0), 2)

    # Save the modified image with bounding boxes
    result_image_path = os.path.join(uploads_dir, 'result_' + os.path.basename(filepath))
    cv2.imwrite(result_image_path, img)

    return results, f'/uploads/{os.path.basename(result_image_path)}'

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)

if __name__ == '__main__':
    app.run(debug=True)
