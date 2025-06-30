const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Mock database - in a real app, this would be in MongoDB
// Feel free to replace with actual MongoDB models

// Courses data
const courses = [
  {
    id: 'web-dev',
    title: 'The Complete Web Development Bootcamp',
    instructor: 'Dr. Angela Yu',
    description: 'Learn HTML, CSS, JavaScript, React, Node and more with the most comprehensive web development course.',
    image: 'https://cdn-icons-png.flaticon.com/512/2721/2721295.png',
    level: 'Beginner to Advanced',
    rating: 4.8,
    students: 768450,
    modules: [
      {
        id: 'module-1',
        title: 'Introduction to HTML',
        lessons: [
          { id: 'html-basics', title: 'HTML Basics', duration: '45 min', completed: false },
          { id: 'html-forms', title: 'HTML Forms', duration: '60 min', completed: false },
          { id: 'html-tables', title: 'HTML Tables', duration: '30 min', completed: false }
        ]
      },
      {
        id: 'module-2',
        title: 'CSS Styling',
        lessons: [
          { id: 'css-basics', title: 'CSS Basics', duration: '50 min', completed: false },
          { id: 'css-layout', title: 'CSS Layout', duration: '65 min', completed: false },
          { id: 'css-responsive', title: 'Responsive Design', duration: '70 min', completed: false }
        ]
      }
    ],
    facultyDetails: {
      name: 'Dr. Angela Yu',
      title: 'Senior Web Development Instructor',
      bio: 'Dr. Angela Yu is a developer and lead instructor at the London App Brewery. She has taught over 1 million students how to code through her online courses.',
      expertise: ['HTML/CSS', 'JavaScript', 'React', 'Node.js'],
      photo: 'https://randomuser.me/api/portraits/women/44.jpg',
      contactHours: 'Mondays and Wednesdays 3-5pm'
    }
  },
  {
    id: 'react-masterclass',
    title: 'React - The Complete Guide',
    instructor: 'Maximilian Schwarzmüller',
    description: 'Dive in and learn React.js from scratch! Learn Hooks, Redux, React Routing, Animations, Next.js and more!',
    image: 'https://cdn-icons-png.flaticon.com/512/1260/1260667.png',
    level: 'All Levels',
    rating: 4.7,
    students: 689540,
    modules: [
      {
        id: 'module-1',
        title: 'React Fundamentals',
        lessons: [
          { id: 'react-intro', title: 'Introduction to React', duration: '40 min', completed: false },
          { id: 'jsx', title: 'JSX Syntax', duration: '35 min', completed: false },
          { id: 'components', title: 'Components and Props', duration: '55 min', completed: false }
        ]
      },
      {
        id: 'module-2',
        title: 'React State Management',
        lessons: [
          { id: 'hooks-intro', title: 'Introduction to Hooks', duration: '50 min', completed: false },
          { id: 'useState', title: 'useState Hook', duration: '45 min', completed: false },
          { id: 'useEffect', title: 'useEffect Hook', duration: '60 min', completed: false }
        ]
      }
    ],
    facultyDetails: {
      name: 'Maximilian Schwarzmüller',
      title: 'Senior Frontend Developer & Instructor',
      bio: 'Maximilian is a self-taught programmer with over 10 years of experience in web development who loves sharing his knowledge with students around the world.',
      expertise: ['JavaScript', 'React', 'Angular', 'Vue.js'],
      photo: 'https://randomuser.me/api/portraits/men/32.jpg',
      contactHours: 'Tuesdays and Thursdays 2-4pm'
    }
  }
];

// Attendance data
const attendance = {
  'web-dev': {
    dates: [
      { date: '2023-10-01', attendedStudents: ['user123', 'user456', 'user789'] },
      { date: '2023-10-03', attendedStudents: ['user123', 'user789'] },
      { date: '2023-10-05', attendedStudents: ['user123', 'user456'] }
    ],
    summary: {
      'user123': { total: 3, attended: 3, percentage: 100 },
      'user456': { total: 3, attended: 2, percentage: 66.67 },
      'user789': { total: 3, attended: 2, percentage: 66.67 }
    }
  },
  'react-masterclass': {
    dates: [
      { date: '2023-10-02', attendedStudents: ['user123', 'user789'] },
      { date: '2023-10-04', attendedStudents: ['user456', 'user789'] },
      { date: '2023-10-06', attendedStudents: ['user123', 'user456', 'user789'] }
    ],
    summary: {
      'user123': { total: 3, attended: 2, percentage: 66.67 },
      'user456': { total: 3, attended: 2, percentage: 66.67 },
      'user789': { total: 3, attended: 3, percentage: 100 }
    }
  }
};

// Faculty feedback data
const facultyFeedback = {
  'web-dev': [
    { 
      id: 'fb1',
      userId: 'user123',
      rating: 4.5,
      comment: 'Dr. Yu explains complex concepts in a simple manner. Great course!',
      date: '2023-09-15'
    },
    { 
      id: 'fb2',
      userId: 'user456',
      rating: 5,
      comment: 'Excellent teaching style and comprehensive content.',
      date: '2023-09-18'
    }
  ],
  'react-masterclass': [
    { 
      id: 'fb3',
      userId: 'user789',
      rating: 4.8,
      comment: 'Max is an amazing instructor. The examples are practical and useful.',
      date: '2023-09-20'
    },
    { 
      id: 'fb4',
      userId: 'user123',
      rating: 4.7,
      comment: 'Great depth of content. Would recommend to anyone wanting to learn React.',
      date: '2023-09-25'
    }
  ]
};

// Online tests data
const onlineTests = {
  'web-dev': [
    {
      id: 'test-html',
      title: 'HTML Fundamentals Quiz',
      duration: 30, // minutes
      totalQuestions: 20,
      passingScore: 70,
      availableUntil: '2023-12-31',
      questions: [
        {
          id: 'q1',
          text: 'What does HTML stand for?',
          options: [
            'Hyper Text Markup Language',
            'High Tech Modern Language',
            'Hyperlinks and Text Markup Language',
            'Home Tool Markup Language'
          ],
          correctAnswer: 0
        },
        {
          id: 'q2',
          text: 'Which tag is used for creating a hyperlink?',
          options: ['<a>', '<h>', '<p>', '<link>'],
          correctAnswer: 0
        }
        // More questions would be here
      ]
    },
    {
      id: 'test-css',
      title: 'CSS Styling Test',
      duration: 45,
      totalQuestions: 25,
      passingScore: 70,
      availableUntil: '2023-12-31',
      questions: [
        {
          id: 'q1',
          text: 'Which property is used to change the background color?',
          options: [
            'background-color',
            'color',
            'bgcolor',
            'background-style'
          ],
          correctAnswer: 0
        },
        {
          id: 'q2',
          text: 'Which CSS property controls the text size?',
          options: ['font-size', 'text-size', 'font-style', 'text-style'],
          correctAnswer: 0
        }
        // More questions would be here
      ]
    }
  ],
  'react-masterclass': [
    {
      id: 'test-react-basics',
      title: 'React Fundamentals Quiz',
      duration: 40,
      totalQuestions: 20,
      passingScore: 75,
      availableUntil: '2023-12-31',
      questions: [
        {
          id: 'q1',
          text: 'What is JSX?',
          options: [
            'A syntax extension to JavaScript',
            'A JavaScript library',
            'A programming language',
            'A testing framework'
          ],
          correctAnswer: 0
        },
        {
          id: 'q2',
          text: 'What is the correct way to update state in React?',
          options: [
            'Using setState or a state updater function',
            'Directly modifying the state object',
            'Using the state.update() method',
            'Using this.state = newState'
          ],
          correctAnswer: 0
        }
        // More questions would be here
      ]
    }
  ]
};

// Test results data
const testResults = {
  'user123': {
    'test-html': {
      score: 85,
      submittedOn: '2023-09-10',
      timeSpent: 25, // minutes
      answers: [0, 0, 1, 2, 0], // indexes of selected options
      passed: true
    },
    'test-react-basics': {
      score: 80,
      submittedOn: '2023-09-15',
      timeSpent: 35,
      answers: [0, 0, 2, 1, 0],
      passed: true
    }
  },
  'user456': {
    'test-html': {
      score: 75,
      submittedOn: '2023-09-11',
      timeSpent: 28,
      answers: [0, 0, 2, 0, 1],
      passed: true
    },
    'test-css': {
      score: 65,
      submittedOn: '2023-09-14',
      timeSpent: 40,
      answers: [0, 1, 0, 2, 1],
      passed: false
    }
  }
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Get all courses
router.get("/courses", async (req, res) => {
  try {
    // Return basic course data (without modules and other detailed info)
    const simplifiedCourses = courses.map(({ id, title, instructor, description, image, level, rating, students }) => ({
      id, title, instructor, description, image, level, rating, students
    }));
    
    res.json(simplifiedCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

// Get a specific course by ID
router.get("/courses/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Failed to fetch course" });
  }
});

// Get faculty details for a course
router.get("/courses/:courseId/faculty", async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = courses.find(c => c.id === courseId);
    
    if (!course || !course.facultyDetails) {
      return res.status(404).json({ message: "Faculty details not found" });
    }
    
    res.json(course.facultyDetails);
  } catch (error) {
    console.error("Error fetching faculty details:", error);
    res.status(500).json({ message: "Failed to fetch faculty details" });
  }
});

// Get attendance for a course
router.get("/courses/:courseId/attendance", verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const courseAttendance = attendance[courseId];
    
    if (!courseAttendance) {
      return res.status(404).json({ message: "Attendance records not found" });
    }
    
    // Get user-specific attendance if a userId is provided
    if (req.query.userId) {
      const userSummary = courseAttendance.summary[req.query.userId];
      if (!userSummary) {
        return res.status(404).json({ message: "User attendance not found" });
      }
      
      const userAttendance = {
        summary: userSummary,
        dates: courseAttendance.dates.map(date => ({
          ...date,
          attended: date.attendedStudents.includes(req.query.userId)
        }))
      };
      
      return res.json(userAttendance);
    }
    
    // Return all attendance data (for admins/faculty)
    res.json(courseAttendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
});

// Mark attendance for a student
router.post("/courses/:courseId/attendance", verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { date } = req.body;
    
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }
    
    if (!attendance[courseId]) {
      attendance[courseId] = {
        dates: [],
        summary: {}
      };
    }
    
    // Check if date already exists
    let dateRecord = attendance[courseId].dates.find(d => d.date === date);
    
    if (!dateRecord) {
      // Create new date record
      dateRecord = {
        date,
        attendedStudents: []
      };
      attendance[courseId].dates.push(dateRecord);
    }
    
    // Check if student is already marked present
    if (!dateRecord.attendedStudents.includes(req.userId)) {
      dateRecord.attendedStudents.push(req.userId);
      
      // Update summary
      if (!attendance[courseId].summary[req.userId]) {
        attendance[courseId].summary[req.userId] = {
          total: attendance[courseId].dates.length,
          attended: 1,
          percentage: (1 / attendance[courseId].dates.length) * 100
        };
      } else {
        const summary = attendance[courseId].summary[req.userId];
        summary.attended += 1;
        summary.total = attendance[courseId].dates.length;
        summary.percentage = (summary.attended / summary.total) * 100;
      }
    }
    
    res.status(201).json({ 
      message: "Attendance marked successfully",
      attendance: attendance[courseId].summary[req.userId]
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Failed to mark attendance" });
  }
});

// Get faculty feedback for a course
router.get("/courses/:courseId/feedback", async (req, res) => {
  try {
    const { courseId } = req.params;
    const feedback = facultyFeedback[courseId] || [];
    
    res.json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
});

// Submit faculty feedback for a course
router.post("/courses/:courseId/feedback", verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Valid rating (1-5) is required" });
    }
    
    if (!comment || comment.trim() === "") {
      return res.status(400).json({ message: "Comment is required" });
    }
    
    // Create new feedback entry
    const newFeedback = {
      id: `fb${Date.now()}`,
      userId: req.userId,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    
    if (!facultyFeedback[courseId]) {
      facultyFeedback[courseId] = [];
    }
    
    facultyFeedback[courseId].push(newFeedback);
    
    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: newFeedback
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
});

// Get available tests for a course
router.get("/courses/:courseId/tests", verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const tests = onlineTests[courseId] || [];
    
    // Remove questions from the response for security
    const testsWithoutQuestions = tests.map(({ id, title, duration, totalQuestions, passingScore, availableUntil }) => ({
      id, title, duration, totalQuestions, passingScore, availableUntil
    }));
    
    res.json(testsWithoutQuestions);
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({ message: "Failed to fetch tests" });
  }
});

// Get a specific test for a student to take
router.get("/courses/:courseId/tests/:testId", verifyToken, async (req, res) => {
  try {
    const { courseId, testId } = req.params;
    
    // Check if course exists
    if (!onlineTests[courseId]) {
      return res.status(404).json({ message: "Course tests not found" });
    }
    
    // Find the specific test
    const test = onlineTests[courseId].find(t => t.id === testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    
    // Check if student has already taken the test
    const userResults = testResults[req.userId];
    if (userResults && userResults[testId]) {
      return res.status(400).json({ 
        message: "You have already taken this test",
        result: userResults[testId]
      });
    }
    
    // Check if test is still available
    const now = new Date();
    const testEndDate = new Date(test.availableUntil);
    if (now > testEndDate) {
      return res.status(400).json({ message: "This test is no longer available" });
    }
    
    // Remove correct answers from questions for security
    const secureTest = {
      ...test,
      questions: test.questions.map(({ id, text, options }) => ({
        id, text, options
      }))
    };
    
    res.json(secureTest);
  } catch (error) {
    console.error("Error fetching test:", error);
    res.status(500).json({ message: "Failed to fetch test" });
  }
});

// Submit a test
router.post("/courses/:courseId/tests/:testId/submit", verifyToken, async (req, res) => {
  try {
    const { courseId, testId } = req.params;
    const { answers, timeSpent } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers must be provided as an array" });
    }
    
    // Check if course exists
    if (!onlineTests[courseId]) {
      return res.status(404).json({ message: "Course tests not found" });
    }
    
    // Find the specific test
    const test = onlineTests[courseId].find(t => t.id === testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    
    // Check if student has already taken the test
    if (testResults[req.userId] && testResults[req.userId][testId]) {
      return res.status(400).json({ message: "You have already taken this test" });
    }
    
    // Grade the test
    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (index < test.questions.length && answer === test.questions[index].correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / test.questions.length) * 100);
    const passed = score >= test.passingScore;
    
    // Save results
    if (!testResults[req.userId]) {
      testResults[req.userId] = {};
    }
    
    testResults[req.userId][testId] = {
      score,
      submittedOn: new Date().toISOString().split('T')[0],
      timeSpent: timeSpent || test.duration,
      answers,
      passed
    };
    
    res.json({
      message: `Test submitted successfully. Your score: ${score}%`,
      result: testResults[req.userId][testId]
    });
  } catch (error) {
    console.error("Error submitting test:", error);
    res.status(500).json({ message: "Failed to submit test" });
  }
});

// Get test results for a student
router.get("/my-results", verifyToken, async (req, res) => {
  try {
    const userResults = testResults[req.userId] || {};
    res.json(userResults);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Failed to fetch results" });
  }
});

// Get specific test result
router.get("/courses/:courseId/tests/:testId/result", verifyToken, async (req, res) => {
  try {
    const { courseId, testId } = req.params;
    
    // Check if user has taken the test
    if (!testResults[req.userId] || !testResults[req.userId][testId]) {
      return res.status(404).json({ message: "Test result not found" });
    }
    
    res.json(testResults[req.userId][testId]);
  } catch (error) {
    console.error("Error fetching test result:", error);
    res.status(500).json({ message: "Failed to fetch test result" });
  }
});

// Mark a lesson as completed
router.post("/courses/:courseId/modules/:moduleId/lessons/:lessonId/complete", verifyToken, async (req, res) => {
  try {
    const { courseId, moduleId, lessonId } = req.params;
    
    // Find the course
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    // Find the module
    const module = course.modules.find(m => m.id === moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    
    // Find the lesson
    const lesson = module.lessons.find(l => l.id === lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    
    // Mark as completed
    lesson.completed = true;
    
    res.json({
      message: "Lesson marked as completed",
      lesson
    });
  } catch (error) {
    console.error("Error marking lesson as completed:", error);
    res.status(500).json({ message: "Failed to mark lesson as completed" });
  }
});

module.exports = router; 