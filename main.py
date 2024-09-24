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
        return "No file part", 400  # HTTP status code for bad request
    file = request.files['image']
    if file.filename == '':
        return "No selected file", 400  # Bad request if no file is selected
    
    # Create uploads directory if it doesn't exist
    uploads_dir = 'uploads'
    if not os.path.exists(uploads_dir):
        os.makedirs(uploads_dir)

    # Save the uploaded file
    filepath = os.path.join(uploads_dir, file.filename)
    file.save(filepath)

    # Process the image and get results
    results, result_image_url = process_image(filepath, uploads_dir)

    # Render the results template with the processed data
    return render_template('results.html', results=results, result_image=result_image_url)

@app.route('/upload_multiple', methods=['POST'])
def upload_multiple():
    if 'images' not in request.files:
        return "No file part", 400  # Bad request if no files are found
    
    files = request.files.getlist('images')
    if not files:
        return "No selected files", 400  # Bad request if no files are selected

    results = []  # This will hold the results for all images
    result_images = []  # This will hold the paths for the processed images
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
        results.append(image_results)  # Append the results for each image
        result_images.append(result_image_path)

    # Pass each image's results to the template
    return render_template('results_multiple.html', results=results, result_images=result_images)

def process_image(filepath, uploads_dir):
    img = cv2.imread(filepath)
    if img is None:
        return [], "Image not found or couldn't be loaded."

    ssl._create_default_https_context = ssl._create_unverified_context
    reader = easyocr.Reader(['en'], gpu=False)
    text_ = reader.readtext(img)

    results = []
    threshold = 0.25  # Set threshold for score
    for t in text_:
        bbox, text, score = t
        if score > threshold:  # Check if the score is above the threshold
            clean_text = ''.join(filter(str.isdigit, text))  # Clean non-digit characters
            if clean_text:  # Ensure there's something left after cleaning
                results.append({
                    'bbox': bbox,
                    'text': clean_text,
                    'score': score
                })
                bbox = np.array(bbox).astype(int)
                cv2.rectangle(img, tuple(bbox[0]), tuple(bbox[2]), (0, 255, 0), 2)

    result_image_path = os.path.join(uploads_dir, 'result_' + os.path.basename(filepath))
    cv2.imwrite(result_image_path, img)

    return results, f'/uploads/{os.path.basename(result_image_path)}'

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)  # Tambahkan baris ini
