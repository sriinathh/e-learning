import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courses from './courseData';

const CoursePlayer = () => {
  const { id } = useParams();
  const course = courses.find((c) => c.id === parseInt(id));
  const navigate = useNavigate();

  if (!course) return <h2>Course Not Found</h2>;

  return (
    <div style={{ padding: '40px' }}>
      <h2>{course.title}</h2>
      <iframe
        width="100%"
        height="450"
        src={course.video}
        title="Course Video"
        allowFullScreen
      ></iframe>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => window.open(course.notes)}>📄 View Notes</button>
        <button onClick={() => navigate(`/quiz/${course.id}`)}>🧠 Start Quiz</button>
      </div>
    </div>
  );
};

export default CoursePlayer;
