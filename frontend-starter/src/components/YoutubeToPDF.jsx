import React, { useState } from 'react';
import axios from 'axios';

const YoutubeToPDF = () => {
  const [videoLink, setVideoLink] = useState('');
  const [message, setMessage] = useState('');
  const [pdfs, setPdfs] = useState([]);

  const generatePDF = async () => {
    setMessage('⏳ Generating PDF, please wait...');
    try {
      const response = await axios.post('http://localhost:5000/generate-pdf', {
        video_link: videoLink
      });

      if (response.data && response.data.path) {
        const pdfPath = response.data.path;
        setMessage('✅ PDF Generated Successfully!');
        setPdfs((prev) => [...prev, pdfPath]);
      } else {
        setMessage('⚠️ Failed to generate PDF.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Error: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen text-white font-sans">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-6 text-center animate-pulse">
          🎬 YouTube Transcript to PDF Notes
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-xl text-black max-w-xl mx-auto space-y-4">
          <label htmlFor="videoLink" className="block text-lg font-medium">
            Enter YouTube Video Link:
          </label>
          <input
            type="text"
            id="videoLink"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 ring-purple-500"
            placeholder="https://www.youtube.com/watch?v=..."
          />

          <button
            onClick={generatePDF}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-all"
          >
            Generate PDF
          </button>

          {message && <div className="text-green-600 font-semibold pt-2">{message}</div>}
        </div>

        <div className="mt-10 bg-white p-6 rounded-lg shadow-xl text-black max-w-3xl mx-auto">
          {/* Big, attractive header with big font and custom gaps */}
          <div className="flex items-center justify-center text-5xl font-extrabold uppercase bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent select-none">
            <span className="mr-40 flex items-center gap-3 cursor-default">
              📂 Your Notes
            </span>

            <a
              href="https://mega.nz/folder/3IAXCTiZ#LywIcbguvDy3T4x-TUfIOw"
              target="_blank"
              rel="noopener noreferrer"
              className="mr-12 flex items-center gap-3 underline hover:text-purple-900 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-700 to-red-700"
            >
              📂 MEGA100
            </a>

            <a
              href="https://mail.google.com/mail/u/0/#inbox"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 underline hover:text-purple-900 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-700 to-red-700"
            >
              📂 learnova
            </a>
          </div>

          <ul className="space-y-2 list-disc pl-5 mt-6">
            {pdfs.map((pdf, index) => (
              <li key={index}>
                <a
                  href={pdf}
                  className="text-purple-600 underline hover:text-purple-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {pdf.split('/').pop()}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default YoutubeToPDF;
