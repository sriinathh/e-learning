import React, { useState } from 'react';

const LectureNotes = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const extractVideoId = (url) => {
    const regExp = /(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const handleSubmit = async () => {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      alert("Invalid YouTube URL");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/generate-pdf?video_id=${videoId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'lecture_notes.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Error generating notes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">📚 Generate Lecture Notes from YouTube</h1>
      
      <input
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Enter YouTube Video URL"
        className="p-3 rounded-lg w-full max-w-xl border shadow-sm mb-4"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Notes & Download PDF'}
      </button>
    </div>
  );
};

export default LectureNotes;
