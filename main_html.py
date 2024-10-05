from flask import Flask, render_template, request, send_from_directory
from collections import defaultdict
import cv2
import ssl
import easyocr
import numpy as np
import os

app = Flask(__name__)

def clear_uploads_folder():
    uploads_dir = 'uploads'
    if os.path.exists(uploads_dir):
        print(f"Clearing uploads directory: {uploads_dir}")
        for filename in os.listdir(uploads_dir):
            file_path = os.path.join(uploads_dir, filename)
            try:
                if os.path.isfile(file_path):  # Check if it's a file
                    os.unlink(file_path)  # Remove the file
                    print(f"Deleted file: {file_path}")  # Log the deleted file
                # If you want to also remove directories, uncomment the next line
                # elif os.path.isdir(file_path): os.rmdir(file_path)  # Remove the directory
            except Exception as e:
                print(f'Failed to delete {file_path}. Reason: {e}')
    else:
        print(f"Uploads directory does not exist: {uploads_dir}")


@app.route('/clear_uploads')
def clear_uploads():
    clear_uploads_folder()
    return "Uploads folder cleared!"

@app.route('/')
def index():
    clear_uploads_folder()  # Clear the uploads folder every time the index is accessed
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
    all_saved_images = []  # This will hold all saved image paths
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
        image_results, saved_images = process_image(filepath, uploads_dir)
        results.append(image_results)  # Append the results for each image
        all_saved_images.extend(saved_images)  # Extend with saved images

    # Group results by text
    grouped_results = defaultdict(list)
    for index in range(len(results)):
        for res in results[index]:
            if res['text'].isdigit():
                grouped_results[res['text']].append((res, all_saved_images[index]))

    # Pass each image's results to the template
    return render_template('results_multiple.html', grouped_results=grouped_results)



# Rute untuk menampilkan daftar gambar
@app.route('/images/<text>')
def display_images(text):
    uploads_dir = 'uploads'
    image_urls = []

    # Memeriksa semua file dalam folder uploads
    if os.path.exists(uploads_dir):
        for filename in os.listdir(uploads_dir):
            # Memastikan hanya menambahkan file gambar yang memiliki nama sesuai dengan nomor
            if filename.startswith(text) and filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                image_urls.append(f'/uploads/{filename}')  # Tambahkan URL gambar

    return render_template('images_list.html', text=text, image_urls=image_urls)


# def process_image(filepath, uploads_dir):
#     img = cv2.imread(filepath)
#     if img is None:
#         return [], "Image not found or couldn't be loaded."

#     ssl._create_default_https_context = ssl._create_unverified_context
#     reader = easyocr.Reader(['en'], gpu=False)
#     text_ = reader.readtext(img)

#     results = []
#     threshold = 0.25  # Set threshold for score
#     text_count = defaultdict(int)  # Counter for instances of each detected text

#     # Draw bounding boxes and prepare to save images for each detected text
#     for t in text_:
#         bbox, text, score = t
#         if score > threshold:  # Check if the score is above the threshold
#             clean_text = ''.join(filter(str.isdigit, text))  # Clean non-digit characters
#             if clean_text:  # Ensure there's something left after cleaning
#                 results.append({
#                     'bbox': bbox,
#                     'text': clean_text,
#                     'score': score
#                 })

#                 # Increment the counter for the clean text
#                 text_count[clean_text] += 1

#                 # Generate the base image file name based on the text
#                 base_image_name = f'{clean_text}'
#                 count = text_count[clean_text]
#                 result_image_name = f'{base_image_name}_{count}.jpg'

#                 # Ensure the filename is unique by checking if it already exists
#                 while os.path.exists(os.path.join(uploads_dir, result_image_name)):
#                     count += 1
#                     result_image_name = f'{base_image_name}_{count}.jpg'

#                 result_image_path = os.path.join(uploads_dir, result_image_name)

#                 # Draw the bounding box on the original image
#                 bbox = np.array(bbox).astype(int)
#                 cv2.rectangle(img, tuple(bbox[0]), tuple(bbox[2]), (0, 255, 0), 2)

#                 # Save a full image with all bounding boxes drawn
#                 cv2.imwrite(result_image_path, img)  # Save the full image with drawn boxes

#     # Collect the names of saved images
#     saved_image_urls = []
#     for text, count in text_count.items():
#         for i in range(1, count + 1):
#             saved_image_name = f'{text}_{i}.jpg'
#             saved_image_urls.append(f'/uploads/{saved_image_name}')

#     return results, saved_image_urls


def process_image(filepath, uploads_dir):
    img = cv2.imread(filepath)
    if img is None:
        return [], "Image not found or couldn't be loaded."

    ssl._create_default_https_context = ssl._create_unverified_context
    reader = easyocr.Reader(['en'], gpu=False)
    text_ = reader.readtext(img)

    results = []
    threshold = 0.25  # Set threshold for score
    text_count = defaultdict(int)  # Counter for instances of each detected text

    # Process each detected text
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

                # Increment the counter for the clean text
                text_count[clean_text] += 1

                # Generate the base image file name based on the text
                base_image_name = f'{clean_text}'
                count = text_count[clean_text]
                result_image_name = f'{base_image_name}_{count}.jpg'

                # Ensure the filename is unique by checking if it already exists
                while os.path.exists(os.path.join(uploads_dir, result_image_name)):
                    count += 1
                    result_image_name = f'{base_image_name}_{count}.jpg'

                result_image_path = os.path.join(uploads_dir, result_image_name)

                # Save the original image without drawing bounding boxes
                cv2.imwrite(result_image_path, img)  # Save the full image without drawn boxes

    # Collect the names of saved images
    saved_image_urls = []
    for text, count in text_count.items():
        for i in range(1, count + 1):
            saved_image_name = f'{text}_{i}.jpg'
            saved_image_urls.append(f'/uploads/{saved_image_name}')

    return results, saved_image_urls


@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)  # Tambahkan baris ini
