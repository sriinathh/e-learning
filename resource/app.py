# resources/app.py

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, VideoUnavailable
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os
import re
import uuid

app = Flask(__name__)
CORS(app)

# Set folder for saving PDFs
PDF_FOLDER = os.path.join(os.path.dirname(__file__), 'generated_pdfs')
os.makedirs(PDF_FOLDER, exist_ok=True)

def extract_video_id(url):
    pattern = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match = re.search(pattern, url)
    return match.group(1) if match else None

def create_pdf(transcript, filename):
    pdf_path = os.path.join(PDF_FOLDER, filename)
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    y_position = height - 40

    for entry in transcript:
        text = entry['text']
        if y_position < 40:
            c.showPage()
            y_position = height - 40
        c.drawString(40, y_position, text)
        y_position -= 14

    c.save()
    return pdf_path

@app.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    data = request.get_json()
    video_link = data.get('video_link')

    if not video_link:
        return jsonify({'error': 'No video link provided'}), 400

    video_id = extract_video_id(video_link)
    if not video_id:
        return jsonify({'error': 'Invalid YouTube link'}), 400

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        unique_filename = f"{video_id}_{uuid.uuid4().hex[:6]}.pdf"
        create_pdf(transcript, unique_filename)

        return jsonify({
            'message': 'PDF generated successfully',
            'path': f"http://localhost:5000/static/pdfs/{unique_filename}"
        })

    except TranscriptsDisabled:
        return jsonify({'error': 'Subtitles are disabled for this video'}), 400
    except VideoUnavailable:
        return jsonify({'error': 'Video is unavailable or deleted'}), 400
    except Exception as e:
        return jsonify({'error': f"An error occurred: {str(e)}"}), 500

@app.route('/static/pdfs/<filename>')
def serve_pdf(filename):
    return send_from_directory(PDF_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True)
