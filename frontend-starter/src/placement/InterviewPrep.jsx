// File: /src/components/InterviewPrep.jsx
import React, { useState, useEffect } from 'react';
import './InterviewPrep.css'; // Link to CSS

const InterviewPrep = () => {
  const questions = [
    "Tell me about yourself.",
    "What are your strengths and weaknesses?",
    "Why do you want to work with us?",
    "Where do you see yourself in 5 years?",
    "Describe a challenging situation you have faced and how you handled it."
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [timer, setTimer] = useState(30); // 30 seconds for each question
  const [isInterviewing, setIsInterviewing] = useState(false);
  
  // Start interview
  const startInterview = () => {
    setIsInterviewing(true);
    setCurrentQuestionIndex(0);
    setTimer(30);
    setFeedback('');
  };

  // Handle timer countdown
  useEffect(() => {
    let timerInterval;
    if (isInterviewing && timer > 0) {
      timerInterval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      // Provide feedback after time is up
      handleSubmit();
    }
    
    return () => clearInterval(timerInterval); // Cleanup on unmount or timer reset
  }, [isInterviewing, timer]);

  // Handle answer change
  const handleChange = (e) => {
    setAnswer(e.target.value);
  };

  // Handle question submission and feedback generation
  const handleSubmit = () => {
    if (answer.trim()) {
      // Example feedback logic: simple feedback on answer length
      setFeedback(`Your answer was ${answer.length < 50 ? 'brief' : 'detailed'}!`);
    } else {
      setFeedback('Please provide an answer.');
    }

    // Move to the next question or finish interview
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setTimer(30); // Reset timer for next question
      setAnswer('');
    } else {
      setIsInterviewing(false);
      setFeedback('Interview completed!');
    }
  };

  return (
    <div id="interview" className="section">
      <h2>Mock Interviews</h2>
      <p>Practice with mock interviews and get feedback.</p>

      {!isInterviewing ? (
        <button onClick={startInterview} className="start-button">
          Start Interview
        </button>
      ) : (
        <div>
          <div className="question-container">
            <p><strong>Question {currentQuestionIndex + 1}: </strong>{questions[currentQuestionIndex]}</p>
            <div className="timer">Time remaining: {timer}s</div>
            <textarea
              placeholder="Type your answer here..."
              value={answer}
              onChange={handleChange}
              rows="5"
            />
          </div>

          <button onClick={handleSubmit} className="submit-button">
            Submit Answer
          </button>

          {feedback && <div className="feedback">{feedback}</div>}
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;
