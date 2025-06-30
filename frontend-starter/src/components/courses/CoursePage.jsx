import React, { useState, useEffect, useRef } from "react";
import "./CoursePage.css"; // Import the CSS
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import campusLogo from "../../assets/campus.jpg";
import instructorSignature from "../../assets/ins.png";
import coordinatorSignature from "../../assets/cor.png";
import Certificate from "./Certificate";
import { 
  FaCertificate, 
  FaPlay, 
  FaPause, 
  FaBookmark, 
  FaCheckCircle, 
  FaSearch, 
  FaShoppingCart, 
  FaBell, 
  FaUser,
  FaStar,
  FaHeart,
  FaRegHeart,
  FaRegClock,
  FaAngleDown,
  FaCode,
  FaArrowLeft,
  FaFilter,
  FaGraduationCap,
  FaChartLine,
  FaEdit,
  FaBook,
  FaClipboardCheck,
  FaLaptopCode,
  FaTrophy,
  FaMedal,
  FaRegLightbulb
} from "react-icons/fa";

// Updated course list with Udemy-like details
const coursesList = [
  {
    id: 1,
    name: "The Complete 2023 Web Development Bootcamp",
    logo: "https://cdn-icons-png.flaticon.com/512/2721/2721295.png",
    instructor: "Dr. Angela Yu",
    instructorTitle: "Developer and Lead Instructor",
    instructorImage: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.8,
    reviewCount: 152644,
    studentsCount: 768450,
    lastUpdated: "December 2023",
    language: "English",
    level: "Beginner to Advanced",
    description: "Master HTML, CSS, JavaScript, React, Node and more with the most comprehensive web development course. Build responsive real-world websites and apps.",
    whatYouWillLearn: [
      "Build 16 web development projects for your portfolio",
      "Learn the latest technologies, including Javascript, React, Node and more",
      "Build fully-fledged websites and web apps",
      "Work as a freelance web developer",
      "Master frontend development with React",
      "Master backend development with Node"
    ],
    notes: "https://example.com/frontend-bootcamp.pdf",
    video: "https://www.youtube.com/watch?v=7TMescjxlrw", // Main course video
    nextVideos: [
      { id: 1, title: "Introduction to HTML5", videoUrl: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ", duration: "15:20", isCompleted: false },
      { id: 2, title: "CSS Flexbox and Grid", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "23:45", isCompleted: false },
      { id: 3, title: "JavaScript ES6 Features", videoUrl: "https://www.youtube.com/watch?v=0gUtbXXShJY", duration: "18:30", isCompleted: false },
      { id: 4, title: "React Fundamentals", videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", duration: "27:15", isCompleted: false },
      { id: 5, title: "Node.js Basics", videoUrl: "https://www.youtube.com/watch?v=fBNz5xF-Kx4", duration: "21:40", isCompleted: false },
      { id: 6, title: "MongoDB Integration", videoUrl: "https://www.youtube.com/watch?v=XeDM28c5kO4", duration: "19:55", isCompleted: false }
    ],
    quiz: [
      {
        question: "What does HTML stand for?",
        options: [
          "Hyper Trainer Marking Language",
          "HyperText Markup Language",
          "HyperText Markdown Language",
          "None of the above",
        ],
        answer: "HyperText Markup Language",
      },
      {
        question: "Which one is a frontend language?",
        options: ["Python", "Java", "HTML", "Node.js"],
        answer: "HTML",
      },
      {
        question: "What is the main purpose of CSS?",
        options: ["Structure", "Functionality", "Styling", "Database"],
        answer: "Styling",
      },
    ],
  },
  {
    id: 2,
    name: "Node.js: The Complete Guide to Backend Development",
    logo: "https://cdn-icons-png.flaticon.com/512/2818/2818333.png",
    instructor: "Srinath",
    instructorTitle: "Professional Web Developer and Instructor",
    instructorImage: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.7,
    reviewCount: 89452,
    studentsCount: 352180,
    lastUpdated: "October 2023",
    language: "English",
    level: "Intermediate",
    description: "Master Node.js, Express.js, MongoDB and more with practical projects. Create robust backend systems with authentication, databases, and APIs.",
    whatYouWillLearn: [
      "Build RESTful APIs with Node.js and Express",
      "Work with MongoDB and Mongoose",
      "Implement authentication and authorization",
      "Deploy Node.js applications to production",
      "Learn server-side rendering with templates",
      "Master asynchronous programming patterns"
    ],
    notes: "https://example.com/backend-bootcamp.pdf",
    video: "https://www.youtube.com/watch?v=tN6oJu2DqCM",
    nextVideos: [
      { id: 1, title: "Node.js Fundamentals", videoUrl: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ", duration: "22:10" },
      { id: 2, title: "Express.js Routing", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "18:45" },
      { id: 3, title: "MongoDB CRUD Operations", videoUrl: "https://www.youtube.com/watch?v=0gUtbXXShJY", duration: "25:30" },
      { id: 4, title: "Authentication & Authorization", videoUrl: "https://www.youtube.com/watch?v=oSIv-E60NiU", duration: "31:20" },
      { id: 5, title: "REST API Development", videoUrl: "https://www.youtube.com/watch?v=fgTGADljAeg", duration: "28:15" },
      { id: 6, title: "Deploying Node.js Applications", videoUrl: "https://www.youtube.com/watch?v=JQOFscJaC6I", duration: "24:45" }
    ],
    quiz: [
      {
        question: "What does API stand for?",
        options: ["Application Programming Interface", "Apple Programming Interface", "Automatic Programming Interface", "None of the above"],
        answer: "Application Programming Interface",
      },
      {
        question: "Which database is commonly used with Node.js?",
        options: ["MySQL", "MongoDB", "SQLite", "Oracle"],
        answer: "MongoDB",
      },
      {
        question: "What is Express.js used for?",
        options: ["Building static pages", "Building server-side applications", "Managing databases", "None of the above"],
        answer: "Building server-side applications",
      },
    ],
  },
  {
    id: 3,
    name: "Python for Data Science and Machine Learning Bootcamp",
    logo: "https://cdn-icons-png.flaticon.com/512/2721/2721286.png",
    instructor: "Jose Portilla",
    instructorTitle: "Head of Data Science at Pierian Training",
    instructorImage: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 4.9,
    reviewCount: 127893,
    studentsCount: 432650,
    lastUpdated: "November 2023",
    language: "English",
    level: "Intermediate to Advanced",
    description: "Learn Python and how to use it to analyze data, create visualizations, and use powerful machine learning algorithms. Includes NumPy, Pandas, Matplotlib and more.",
    whatYouWillLearn: [
      "Master Python for data science and machine learning",
      "Use NumPy for numerical processing and Pandas for data analysis",
      "Create data visualizations with Matplotlib and Seaborn",
      "Build machine learning models with Scikit-Learn",
      "Perform linear and logistic regression",
      "Implement clustering, PCA, and neural networks"
    ],
    notes: "https://example.com/data-science-ml.pdf",
    video: "https://www.youtube.com/watch?v=LHBE6Q9XlzI",
    nextVideos: [
      { id: 1, title: "Python for Data Science", videoUrl: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ", duration: "26:40" },
      { id: 2, title: "Pandas Data Analysis", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "31:15" },
      { id: 3, title: "Machine Learning Algorithms", videoUrl: "https://www.youtube.com/watch?v=0gUtbXXShJY", duration: "35:20" },
      { id: 4, title: "Data Visualization with Matplotlib", videoUrl: "https://www.youtube.com/watch?v=UO98lJQ3QGI", duration: "29:45" },
      { id: 5, title: "Neural Networks & Deep Learning", videoUrl: "https://www.youtube.com/watch?v=NfnWJUyUJYU", duration: "42:30" },
      { id: 6, title: "Project: Recommender System", videoUrl: "https://www.youtube.com/watch?v=XdYzsCdR5Rw", duration: "38:15" }
    ],
    quiz: [
      {
        question: "Which Python library is used for data manipulation?",
        options: ["Matplotlib", "Pandas", "Numpy", "TensorFlow"],
        answer: "Pandas",
      },
      {
        question: "Which machine learning algorithm is used for classification?",
        options: ["Linear Regression", "Decision Tree", "K-Means Clustering", "Random Forest"],
        answer: "Decision Tree",
      },
      {
        question: "What is overfitting in machine learning?",
        options: ["Model is too simple", "Model is too complex", "Model performs well on new data", "None of the above"],
        answer: "Model is too complex",
      },
    ],
  },
  {
    id: 4,
    name: "The Complete React Developer Course (with Hooks and Redux)",
    logo: "https://cdn-icons-png.flaticon.com/512/1183/1183672.png",
    instructor: "Andrew Mead",
    instructorTitle: "Full-stack Developer & Teacher",
    instructorImage: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 4.8,
    reviewCount: 87563,
    studentsCount: 295410,
    lastUpdated: "January 2024",
    language: "English",
    level: "All Levels",
    description: "Learn React by building real projects. Includes React Router, Redux, Hooks, Context API, Firebase, and authentication. From zero to React developer.",
    whatYouWillLearn: [
      "Build powerful, fast, user-friendly and reactive web apps",
      "Master fundamental React concepts like components, JSX, and props",
      "Manage complex application state with Redux and Context API",
      "Apply best practices for React hooks and functional components",
      "Connect React applications to databases and RESTful APIs",
      "Deploy your applications to production"
    ],
    notes: "https://example.com/react-developer-course.pdf",
    video: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
    nextVideos: [
      { id: 1, title: "React Fundamentals", videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", duration: "24:15" },
      { id: 2, title: "Working with Components", videoUrl: "https://www.youtube.com/watch?v=Y2hgEGPzTZY", duration: "32:45" },
      { id: 3, title: "React Hooks in Depth", videoUrl: "https://www.youtube.com/watch?v=TNhaISOUy6Q", duration: "28:30" },
      { id: 4, title: "State Management with Redux", videoUrl: "https://www.youtube.com/watch?v=93p3LxR9xfM", duration: "35:20" },
      { id: 5, title: "Routing with React Router", videoUrl: "https://www.youtube.com/watch?v=Law7wfdg_ls", duration: "23:15" },
      { id: 6, title: "Testing React Components", videoUrl: "https://www.youtube.com/watch?v=7r4xVDI2vho", duration: "26:40" }
    ],
    quiz: [
      {
        question: "What is JSX?",
        options: [
          "A database language",
          "A JavaScript extension syntax",
          "A JavaScript library",
          "A CSS framework"
        ],
        answer: "A JavaScript extension syntax",
      },
      {
        question: "What are React Hooks used for?",
        options: [
          "Connecting to external APIs",
          "Using state and other React features in functional components",
          "Creating complex DOM elements",
          "Performance optimization only"
        ],
        answer: "Using state and other React features in functional components",
      },
      {
        question: "Which is NOT a built-in React Hook?",
        options: ["useState", "useEffect", "useComponent", "useContext"],
        answer: "useComponent",
      },
    ],
  },
  {
    id: 5,
    name: "Flutter & Dart - The Complete App Development Course",
    logo: "https://cdn-icons-png.flaticon.com/512/919/919851.png",
    instructor: "Angela Yu",
    instructorTitle: "iOS and Android App Developer & Teacher",
    instructorImage: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.7,
    reviewCount: 65482,
    studentsCount: 189732,
    lastUpdated: "December 2023",
    language: "English",
    level: "Beginner to Advanced",
    description: "Learn Flutter and Dart from scratch to build iOS and Android apps. Create beautiful, responsive UIs and connect to backends for complete apps.",
    whatYouWillLearn: [
      "Build beautiful, fast and native-quality apps with Flutter",
      "Learn Dart from scratch",
      "Build iOS and Android apps with a single codebase",
      "Understand state management techniques",
      "Use Firebase for backend and authentication",
      "Publish your apps to the App Store and Google Play"
    ],
    notes: "https://example.com/flutter-app-development.pdf",
    video: "https://www.youtube.com/watch?v=1ukSR1GRtMU",
    nextVideos: [
      { id: 1, title: "Dart Fundamentals", videoUrl: "https://www.youtube.com/watch?v=5rtujDjt50I", duration: "22:10" },
      { id: 2, title: "First Flutter App", videoUrl: "https://www.youtube.com/watch?v=x0uinJvhNxI", duration: "28:45" },
      { id: 3, title: "Building UI with Widgets", videoUrl: "https://www.youtube.com/watch?v=b_sQ9bMltGU", duration: "33:20" },
      { id: 4, title: "State Management", videoUrl: "https://www.youtube.com/watch?v=lnIBMG_4hZ0", duration: "31:40" },
      { id: 5, title: "Working with APIs", videoUrl: "https://www.youtube.com/watch?v=PyvI_5uM1fg", duration: "25:10" },
      { id: 6, title: "Publishing Your Apps", videoUrl: "https://www.youtube.com/watch?v=0BZDyk9j9FQ", duration: "19:30" }
    ],
    quiz: [
      {
        question: "What is Flutter?",
        options: [
          "A programming language",
          "A UI toolkit for building cross-platform apps",
          "A database management system",
          "A backend framework"
        ],
        answer: "A UI toolkit for building cross-platform apps",
      },
      {
        question: "What programming language is used with Flutter?",
        options: ["Java", "Swift", "Dart", "Kotlin"],
        answer: "Dart",
      },
      {
        question: "What are Widgets in Flutter?",
        options: [
          "Backend components",
          "Small programs that run background tasks",
          "UI building blocks",
          "External plugins"
        ],
        answer: "UI building blocks",
      },
    ],
  },
  {
    id: 6,
    name: "AWS Certified Solutions Architect - Associate Certification",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968361.png",
    instructor: "Stephane Maarek",
    instructorTitle: "AWS Certified Solutions Architect & Developer",
    instructorImage: "https://randomuser.me/api/portraits/men/36.jpg",
    rating: 4.8,
    reviewCount: 78921,
    studentsCount: 245670,
    lastUpdated: "February 2024",
    language: "English",
    level: "Intermediate",
    description: "Prepare for the AWS Certified Solutions Architect Associate exam with hands-on practice. Learn AWS services, architecture best practices, and cloud design patterns.",
    whatYouWillLearn: [
      "Master the AWS platform and services",
      "Design scalable, reliable and secure applications",
      "Implement cost optimization strategies",
      "Understand AWS global infrastructure",
      "Pass the AWS Certified Solutions Architect Associate exam",
      "Apply cloud architecture best practices"
    ],
    notes: "https://example.com/aws-certification.pdf",
    video: "https://www.youtube.com/watch?v=JIbIYCM48to",
    nextVideos: [
      { id: 1, title: "AWS Fundamentals", videoUrl: "https://www.youtube.com/watch?v=Z3SYDTMP3ME", duration: "35:20" },
      { id: 2, title: "IAM and S3", videoUrl: "https://www.youtube.com/watch?v=Ia-UEYYR44s", duration: "42:15" },
      { id: 3, title: "EC2 and EBS", videoUrl: "https://www.youtube.com/watch?v=XZbvQWkpJTI", duration: "38:30" },
      { id: 4, title: "Database Services", videoUrl: "https://www.youtube.com/watch?v=H7qJbvbSjKo", duration: "33:40" },
      { id: 5, title: "VPC and Networking", videoUrl: "https://www.youtube.com/watch?v=fpxDGU2KdkA", duration: "45:10" },
      { id: 6, title: "Security Best Practices", videoUrl: "https://www.youtube.com/watch?v=QMCp_rAlR_U", duration: "29:45" }
    ],
    quiz: [
      {
        question: "What is the AWS service for virtual servers?",
        options: ["S3", "EC2", "RDS", "Lambda"],
        answer: "EC2",
      },
      {
        question: "Which AWS service is a managed database service?",
        options: ["EC2", "S3", "RDS", "IAM"],
        answer: "RDS",
      },
      {
        question: "What is the AWS global network of edge locations called?",
        options: ["Route 53", "CloudFront", "Global Accelerator", "VPC"],
        answer: "CloudFront",
      },
    ],
  },
  {
    id: 7,
    name: "Complete Cybersecurity Bootcamp: Zero to Mastery",
    logo: "https://cdn-icons-png.flaticon.com/512/2092/2092757.png",
    instructor: "Nathan House",
    instructorTitle: "Senior Security Researcher & Penetration Tester",
    instructorImage: "https://randomuser.me/api/portraits/men/29.jpg",
    rating: 4.9,
    reviewCount: 52478,
    studentsCount: 138520,
    lastUpdated: "January 2024",
    language: "English",
    level: "All Levels",
    description: "Learn cybersecurity from scratch: networking, ethical hacking, penetration testing, risk assessment, security policies, and more. Prepare for CompTIA Security+.",
    whatYouWillLearn: [
      "Understand fundamental cybersecurity concepts",
      "Learn ethical hacking and penetration testing techniques",
      "Implement network security and defenses",
      "Master security assessment and risk management",
      "Learn security policies and compliance",
      "Prepare for cybersecurity certifications"
    ],
    notes: "https://example.com/cybersecurity-bootcamp.pdf",
    video: "https://www.youtube.com/watch?v=PaqLGGZDBk4",
    nextVideos: [
      { id: 1, title: "Cybersecurity Fundamentals", videoUrl: "https://www.youtube.com/watch?v=bPVaOlJ6ln0", duration: "32:15" },
      { id: 2, title: "Network Security Essentials", videoUrl: "https://www.youtube.com/watch?v=z6Nz9the8_8", duration: "45:30" },
      { id: 3, title: "Ethical Hacking Introduction", videoUrl: "https://www.youtube.com/watch?v=_v0ckvXVIJc", duration: "38:45" },
      { id: 4, title: "Malware Analysis", videoUrl: "https://www.youtube.com/watch?v=ImxVCF72NGQ", duration: "41:20" },
      { id: 5, title: "Security Policies and Compliance", videoUrl: "https://www.youtube.com/watch?v=lKTFNRtXZRo", duration: "29:15" },
      { id: 6, title: "Penetration Testing", videoUrl: "https://www.youtube.com/watch?v=qwA6MmbeGNo", duration: "47:30" }
    ],
    quiz: [
      {
        question: "What is a vulnerability assessment?",
        options: [
          "A process to identify and quantify security vulnerabilities",
          "A process to exploit security gaps",
          "A method to encrypt data",
          "A tool to monitor network traffic"
        ],
        answer: "A process to identify and quantify security vulnerabilities",
      },
      {
        question: "What is the purpose of a firewall?",
        options: [
          "To encrypt data",
          "To monitor system performance",
          "To filter network traffic",
          "To prevent power surges"
        ],
        answer: "To filter network traffic",
      },
      {
        question: "What is social engineering?",
        options: [
          "Building social networks for businesses",
          "Manipulating people into divulging confidential information",
          "Developing social media applications",
          "Analyzing social trends in cybersecurity"
        ],
        answer: "Manipulating people into divulging confidential information",
      },
    ],
  },
  {
    id: 8,
    name: "Data Structures and Algorithms: Deep Dive Using Java",
    logo: "https://cdn-icons-png.flaticon.com/512/226/226777.png",
    instructor: "Tim Buchalka",
    instructorTitle: "Java Python Android and C# Expert Developer",
    instructorImage: "https://randomuser.me/api/portraits/men/42.jpg",
    rating: 4.6,
    reviewCount: 45632,
    studentsCount: 127830,
    lastUpdated: "November 2023",
    language: "English",
    level: "Intermediate to Advanced",
    description: "Learn data structures and algorithms using Java. Improve your problem-solving skills and prepare for technical interviews with practical examples.",
    whatYouWillLearn: [
      "Master fundamental data structures (arrays, linked lists, trees, graphs)",
      "Understand algorithm design and analysis",
      "Implement sorting and searching algorithms",
      "Solve complex problems using recursion",
      "Apply Big O notation for performance analysis",
      "Prepare for coding interviews at top tech companies"
    ],
    notes: "https://example.com/data-structures-algorithms.pdf",
    video: "https://www.youtube.com/watch?v=CFD9EFcNZTQ",
    nextVideos: [
      { id: 1, title: "Arrays and Big O Notation", videoUrl: "https://www.youtube.com/watch?v=NEtwJASLU8Q", duration: "36:20" },
      { id: 2, title: "Linked Lists Implementation", videoUrl: "https://www.youtube.com/watch?v=195KUinjBpU", duration: "42:15" },
      { id: 3, title: "Stacks and Queues", videoUrl: "https://www.youtube.com/watch?v=wjI1WNcIntg", duration: "31:40" },
      { id: 4, title: "Trees and Binary Search Trees", videoUrl: "https://www.youtube.com/watch?v=oSWTXtMglKE", duration: "45:30" },
      { id: 5, title: "Hash Tables and Collision Handling", videoUrl: "https://www.youtube.com/watch?v=shs0KM3wKv8", duration: "38:25" },
      { id: 6, title: "Graph Algorithms", videoUrl: "https://www.youtube.com/watch?v=tWVWeAqZ0WU", duration: "52:15" }
    ],
    quiz: [
      {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        answer: "O(log n)",
      },
      {
        question: "Which data structure uses LIFO principle?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        answer: "Stack",
      },
      {
        question: "What is a balanced binary tree?",
        options: [
          "A tree with equal number of nodes on left and right",
          "A tree where the difference in height between left and right subtree is at most 1",
          "A tree where all nodes have exactly 2 children",
          "A tree with no duplicate values"
        ],
        answer: "A tree where the difference in height between left and right subtree is at most 1",
      },
    ],
  },
  {
    id: 9,
    name: "UI/UX Design Bootcamp: Learn User Experience Design",
    logo: "https://cdn-icons-png.flaticon.com/512/5234/5234202.png",
    instructor: "Daniel Walter Scott",
    instructorTitle: "UI/UX Designer & Adobe Certified Instructor",
    instructorImage: "https://randomuser.me/api/portraits/men/15.jpg",
    rating: 4.8,
    reviewCount: 38745,
    studentsCount: 105620,
    lastUpdated: "January 2024",
    language: "English",
    level: "Beginner to Advanced",
    description: "Learn UI/UX design from scratch. Master tools like Figma and Adobe XD. Understand design thinking, wireframing, prototyping and user research.",
    whatYouWillLearn: [
      "Master UI/UX design principles and methodologies",
      "Create wireframes, mockups and interactive prototypes",
      "Conduct effective user research and usability testing",
      "Design for web, mobile and responsive interfaces",
      "Build a professional UI/UX portfolio",
      "Learn industry-standard design tools like Figma and Adobe XD"
    ],
    notes: "https://example.com/ux-design-bootcamp.pdf",
    video: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU",
    nextVideos: [
      { id: 1, title: "Introduction to UX Design", videoUrl: "https://www.youtube.com/watch?v=SRec90j6lTY", duration: "28:15" },
      { id: 2, title: "User Research Methods", videoUrl: "https://www.youtube.com/watch?v=bAARmsv1tms", duration: "36:40" },
      { id: 3, title: "Wireframing and Prototyping", videoUrl: "https://www.youtube.com/watch?v=zkiwRmqbNjE", duration: "42:30" },
      { id: 4, title: "UI Design Fundamentals", videoUrl: "https://www.youtube.com/watch?v=7toqIL3Z9Gc", duration: "35:15" },
      { id: 5, title: "Design Systems and Components", videoUrl: "https://www.youtube.com/watch?v=HF7aCwVP378", duration: "31:20" },
      { id: 6, title: "Usability Testing", videoUrl: "https://www.youtube.com/watch?v=0YL0xoSmyZI", duration: "29:45" }
    ],
    quiz: [
      {
        question: "What is a wireframe in UX design?",
        options: [
          "A high-fidelity mockup of the interface",
          "A simple visual representation of the layout",
          "A testing framework for usability",
          "A development environment"
        ],
        answer: "A simple visual representation of the layout",
      },
      {
        question: "What is the purpose of a user persona?",
        options: [
          "To create fictional characters for marketing",
          "To represent different types of users and their needs",
          "To identify technical requirements",
          "To determine the color scheme of the interface"
        ],
        answer: "To represent different types of users and their needs",
      },
      {
        question: "What is the difference between UI and UX?",
        options: [
          "They are the same thing",
          "UI focuses on how things look, UX focuses on how things work",
          "UI is for mobile, UX is for desktop",
          "UI is technical, UX is non-technical"
        ],
        answer: "UI focuses on how things look, UX focuses on how things work",
      },
    ],
  }
];

// Helper function to convert YouTube video URL to embed format
const getYoutubeEmbedLink = (url) => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`
    : url;
};

const CoursePage = () => {
  console.log("CoursePage component mounted");
  const [darkMode, setDarkMode] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [userName, setUserName] = useState("");
  const [courseProgress, setCourseProgress] = useState({});
  const [savedNotes, setSavedNotes] = useState({});
  const [userNote, setUserNote] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCourseContent, setShowCourseContent] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Add dark-mode class to body for global styling
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Initialize course progress
    const initialProgress = {};
    coursesList.forEach(course => {
      initialProgress[course.id] = Math.floor(Math.random() * 100);
    });
    setCourseProgress(initialProgress);
    
    return () => {
      document.body.classList.remove('dark-mode');
    };
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleEnroll = (course) => {
    if (!enrolledCourses.some((c) => c.id === course.id)) {
      setEnrolledCourses([...enrolledCourses, course]);
    }
    setSelectedCourse(course);
    setQuizCompleted(false);
    setQuizAnswers([]);
    setUserNote("");
  };

  const handleSelect = (course) => {
    console.log("Selected course:", course);
    setSelectedCourse(course);
    // Optionally push to the new route with course ID
    // window.location.href = `/courses/${course.id}`;
  };

  const showAll = () => {
    setSelectedCourse(null);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleCourseContent = () => {
    setShowCourseContent(!showCourseContent);
  };

  const handleQuizCompletion = () => {
    setQuizCompleted(true);
    
    if (selectedCourse) {
      setCourseProgress(prev => ({
        ...prev,
        [selectedCourse.id]: Math.min(100, (prev[selectedCourse.id] || 0) + 20)
      }));
    }
  };

  const handleQuizAnswer = (questionIndex, answer) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answer;
    setQuizAnswers(newAnswers);
  };

  const handleNoteChange = (e) => {
    setUserNote(e.target.value);
  };

  const saveNote = () => {
    if (selectedCourse) {
      setSavedNotes({
        ...savedNotes,
        [selectedCourse.id]: userNote
      });
      alert("Your notes have been saved!");
    }
  };

  const toggleNotes = () => {
    setShowNotes(!showNotes);
  };

  const handleVideoCompletion = (videoId) => {
    if (selectedCourse) {
      const updatedCourse = { ...selectedCourse };
      const videoIndex = updatedCourse.nextVideos.findIndex(v => v.id === videoId);
      if (videoIndex !== -1) {
        updatedCourse.nextVideos[videoIndex].isCompleted = true;
        setSelectedCourse(updatedCourse);
        
        // Update progress
        const completedVideos = updatedCourse.nextVideos.filter(v => v.isCompleted).length;
        const totalVideos = updatedCourse.nextVideos.length + 1; // +1 for main video
        const newProgress = Math.floor((completedVideos / totalVideos) * 100);
        
        setCourseProgress(prev => ({
          ...prev,
          [selectedCourse.id]: newProgress
        }));
      }
    }
  };

  const handleGenerateCertificate = () => {
    if (!userName) {
      alert("Please enter your name to generate the certificate.");
      return;
    }
    
    // Show certificate preview
    setShowCertificate(true);
    
    // Optional: You can also generate PDF directly
    setTimeout(() => {
      const input = document.getElementById('certificate-to-print');
      if (input) {
        html2canvas(input)
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
              orientation: 'landscape',
              unit: 'mm',
              format: 'a4'
            });
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 0;
            
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`${selectedCourse.name.replace(/\s+/g, "-").toLowerCase()}-certificate.pdf`);
          });
      } else {
        // Fallback to old method if html2canvas doesn't work
        const doc = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [800, 600],
        });

        // Add Logo (top center)
        const logoUrl = campusLogo;
        const insSignatureUrl = instructorSignature;
        const corSignatureUrl = coordinatorSignature;

        // Logo Position
        doc.addImage(logoUrl, "PNG", 300, 40, 200, 100);

        // Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(36);
        doc.text("Certificate of Completion", 400, 160, null, null, "center");

        // Quote about CampusConnect and Learning
        doc.setFontSize(20);
        doc.setFont("helvetica", "italic");
        doc.text("CampusConnect - Empowering Your Learning Journey", 400, 200, null, null, "center");
        doc.setFontSize(18);
        doc.text("Learning is the key to success!", 400, 230, null, null, "center");

        // Sub-heading
        doc.setFontSize(18);
        doc.setFont("helvetica", "normal");
        doc.text("This is to certify that", 400, 280, null, null, "center");

        // User Name
        doc.setFontSize(28);
        doc.setFont("helvetica", "bold");
        doc.text(userName, 400, 320, null, null, "center");

        // Description
        doc.setFontSize(16);
        doc.setFont("helvetica", "normal");
        doc.text("has successfully completed the course", 400, 360, null, null, "center");

        // Course name
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text(`"${selectedCourse.name}"`, 400, 400, null, null, "center");

        // Date
        const date = new Date().toLocaleDateString();
        doc.setFontSize(16);
        doc.setFont("helvetica", "normal");
        doc.text(`Date: ${date}`, 50, 550);

        // Instructor Signature
        doc.addImage(insSignatureUrl, "PNG", 550, 470, 150, 75);
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text("Instructor Signature", 560, 530);
        
        // Program Director Signature
        doc.addImage(corSignatureUrl, "PNG", 100, 470, 150, 75);
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text("Program Director", 110, 530);

        // Save the document with a styled name
        doc.save(`${selectedCourse.name.replace(/\s+/g, "-").toLowerCase()}-certificate.pdf`);
      }
    }, 100);
  };
  
  // Add this function to close the certificate modal
  const closeCertificate = () => {
    setShowCertificate(false);
  };

  // Add new function to navigate to Udemy-style course page
  const goToUdemyStyleCourse = (courseId) => {
    window.location.href = `/udemy-course/${courseId === 1 ? 'web-dev' : courseId === 2 ? 'react-masterclass' : 'python-ml'}`;
  };

  // Updated renderTopNavbar function with more compact design
  const renderTopNavbar = () => (
    <div className={`top-navbar ${darkMode ? 'dark-mode' : ''}`}>
      <div className="top-navbar-left">
        <div className="logo">CampusConnect</div>
        <div className="top-navbar-search">
          <input type="text" placeholder="Search for courses" />
          <button><FaSearch /></button>
        </div>
      </div>
      <div className="top-navbar-right">
        <button className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? "Light" : "Dark"}
        </button>
        <button className="cart-button" title="Cart"><FaShoppingCart /></button>
        <button className="notifications-button" title="Notifications"><FaBell /></button>
        <button className="user-menu-button" title="Profile"><FaUser /></button>
      </div>
    </div>
  );

  return (
    <div className={`course-page-container ${darkMode ? 'dark-mode' : ''}`}>
      {renderTopNavbar()}
      
      <div className="main-content">
        <div className="courses-content">
          {!selectedCourse ? (
            <>
              <div className="courses-header">
                <div className="courses-header-left">
                  <h2 className="section-title">Available Courses</h2>
                  <p className="courses-count">{coursesList.length} courses available</p>
                </div>
                <div className="courses-header-right">
                  <button className="filter-button">
                    <FaFilter /> Filter
                  </button>
                </div>
              </div>
              
              <div className="courses-grid">
                {coursesList.map((course) => (
                  <div key={course.id} className="course-card">
                    <div className="course-card-image">
                      <img src={course.logo} alt={course.name} className="course-logo" />
                      <div className="course-card-overlay">
                        <button className="preview-button" onClick={() => handleSelect(course)}>
                          <FaPlay /> Preview
                        </button>
                      </div>
                      <div className="course-level-tag">{course.level}</div>
                    </div>
                    <div className="course-content">
                      <h3 className="course-title">{course.name}</h3>
                      <p className="instructor">{course.instructor}</p>
                      <div className="course-rating">
                        <span className="rating-score">{course.rating}</span>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < Math.floor(course.rating) ? "filled" : "empty"} />
                          ))}
                        </div>
                        <span className="review-count">({course.reviewCount?.toLocaleString() || '0'})</span>
                      </div>
                      <p className="students-count">{course.studentsCount?.toLocaleString() || '0'} students</p>
                      <p className="short-desc">{course.description.substring(0, 100)}...</p>
                      
                      <div className="course-card-footer">
                        <button className="enroll-button" onClick={() => handleEnroll(course)}>Enroll Now</button>
                        <button className="wishlist-button" onClick={toggleFavorite} title="Add to wishlist">
                          {isFavorite ? <FaHeart /> : <FaRegHeart />}
                        </button>
                      </div>
                      <div className="course-card-actions">
                        <button className="continue-btn" onClick={() => handleSelect(course)}>View Details</button>
                        <button className="udemy-style-btn" onClick={() => goToUdemyStyleCourse(course.id)}>
                          Enhanced
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="enrolled-section">
              <div className="back-navigation">
                <button className="back-button" onClick={showAll}>
                  <FaArrowLeft /> Back to Courses
                </button>
                <button 
                  className="enhanced-view-btn"
                  onClick={() => goToUdemyStyleCourse(selectedCourse.id)}
                >
                  Enhanced View
                </button>
              </div>
              
              <div className="course-header">
                <h1 className="course-title">{selectedCourse.name}</h1>
                <div className="course-meta">
                  <div className="course-rating">
                    <span className="rating-value">{selectedCourse.rating}</span>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.floor(selectedCourse.rating) ? "filled" : "empty"} />
                      ))}
                    </div>
                    <span className="reviews-count">({selectedCourse.reviewCount?.toLocaleString() || '0'})</span>
                  </div>
                  <div className="course-enrollment">
                    <span>{selectedCourse.studentsCount?.toLocaleString() || '0'} students</span>
                  </div>
                  <div className="course-level">
                    <span className="level-badge">{selectedCourse.level}</span>
                  </div>
                </div>
                <div className="instructor-info">
                  <p>Instructor: <span className="instructor-name">{selectedCourse.instructor}</span>
                    {selectedCourse.instructorTitle && <span className="instructor-title"> • {selectedCourse.instructorTitle}</span>}
                  </p>
                </div>
              </div>
              
              <div className="course-content-wrapper">
                <div className="video-container">
                  <iframe
                    ref={videoRef}
                    src={getYoutubeEmbedLink(selectedCourse.video)}
                    title="Course Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>

              <div className="course-content-below">
                <div className="progress-section">
                  <h3><FaChartLine className="section-icon" /> Your Progress</h3>
                  <div className="progress-container">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${courseProgress[selectedCourse.id] || 0}%` }}
                    ></div>
                  </div>
                  <span className="progress-percentage">
                    <FaGraduationCap className="progress-icon" /> {courseProgress[selectedCourse.id] || 0}% Complete
                  </span>
                </div>
                
                <div className="course-content-cards">
                  <div className="course-content-card">
                    <div className="card-header" onClick={toggleCourseContent}>
                      <h3><FaBook className="header-icon" /> Course Content</h3>
                      <FaAngleDown className={showCourseContent ? "rotate" : ""} />
                    </div>
                    
                    {showCourseContent && (
                      <div className="course-content-body">
                        <div className="content-info">
                          <span><FaLaptopCode /> {selectedCourse.nextVideos.length + 1} lessons</span>
                          <span><FaRegClock /> {calculateTotalDuration(selectedCourse.nextVideos)}</span>
                        </div>
                        
                        <ul className="video-list">
                          <li className="video-item active">
                            <div className="video-item-content">
                              <span className="video-status completed">
                                <FaCheckCircle />
                              </span>
                              <span className="video-title">Introduction</span>
                              <span className="video-duration">10:00</span>
                            </div>
                          </li>
                          
                          {selectedCourse.nextVideos.map((video) => (
                            <li 
                              key={video.id} 
                              className={`video-item ${video.id === 1 ? 'active' : ''}`}
                              onClick={() => {
                                setSelectedCourse(prev => ({
                                  ...prev,
                                  video: video.videoUrl,
                                }));
                                handleVideoCompletion(video.id);
                              }}
                            >
                              <div className="video-item-content">
                                <span className={`video-status ${video.isCompleted ? 'completed' : ''}`}>
                                  {video.isCompleted ? <FaCheckCircle /> : <FaPlay />}
                                </span>
                                <span className="video-title">{video.title}</span>
                                <span className="video-duration">{video.duration}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="notes-card">
                    <div className="card-header" onClick={toggleNotes}>
                      <h3><FaEdit className="header-icon" /> My Notes</h3>
                      <FaAngleDown className={showNotes ? "rotate" : ""} />
                    </div>
                    
                    {showNotes && (
                      <div className="notes-body">
                        <textarea
                          placeholder="Take notes on this lesson..."
                          value={userNote}
                          onChange={handleNoteChange}
                          rows={4}
                          className="notes-textarea"
                        />
                        <button className="save-notes-button" onClick={saveNote}>
                          <FaBookmark /> Save Notes
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="course-tabs">
                  <div className="tab active">Overview</div>
                  <div className="tab">Q&A</div>
                  <div className="tab">Reviews</div>
                  <div className="tab">Resources</div>
                </div>
                
                <div className="course-overview">
                  <h2>About this course</h2>
                  <p className="course-description">{selectedCourse.description}</p>
                  
                  <div className="what-you-learn">
                    <h3>What you'll learn</h3>
                    <ul className="learn-list">
                      {selectedCourse.whatYouWillLearn && selectedCourse.whatYouWillLearn.map((item, index) => (
                        <li key={index} className="learn-item">
                          <FaCheckCircle /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="knowledge-check-section">
                    <h3><FaClipboardCheck className="section-icon" /> Knowledge Check</h3>
                    {!quizCompleted ? (
                      <>
                        <div className="quiz-container">
                          {selectedCourse.quiz && selectedCourse.quiz.map((question, index) => (
                            <div key={index} className="quiz-question">
                              <h4>
                                <span className="question-number">{index + 1}</span> {question.question}
                              </h4>
                              <ul className="quiz-options">
                                {question.options.map((option, optionIndex) => (
                                  <li key={optionIndex} className="quiz-option">
                                    <input
                                      type="radio"
                                      name={`question-${index}`}
                                      value={option}
                                      onChange={() => handleQuizAnswer(index, option)}
                                      checked={quizAnswers[index] === option}
                                      id={`question-${index}-option-${optionIndex}`}
                                    />
                                    <label htmlFor={`question-${index}-option-${optionIndex}`}>
                                      {option}
                                    </label>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <button className="quiz-complete-button" onClick={handleQuizCompletion}>
                          <FaTrophy /> Complete Quiz & Generate Certificate
                        </button>
                      </>
                    ) : (
                      <div className="certificate-section">
                        <div className="certificate-icon">
                          <FaMedal size={48} color="#a435f0" />
                        </div>
                        <h3>Congratulations on completing the quiz!</h3>
                        <p>You can now generate your certificate of completion.</p>
                        <div className="certificate-form">
                          <input
                            type="text"
                            placeholder="Enter your name as it should appear on the certificate"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="certificate-name-input"
                          />
                          <button className="certificate-button" onClick={handleGenerateCertificate}>
                            <FaCertificate /> Generate Certificate
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showCertificate && (
        <div className="certificate-modal-overlay" onClick={closeCertificate}>
          <div className="certificate-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-certificate" onClick={closeCertificate}>×</button>
            <div id="certificate-to-print">
              <Certificate 
                courseData={{
                  name: selectedCourse?.name,
                  instructor: selectedCourse?.instructor,
                  instructorTitle: selectedCourse?.instructorTitle || "Course Instructor",
                  duration: "40 Hours"
                }}
                studentName={userName}
                completionDate={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              />
            </div>
            <button className="print-certificate" onClick={() => window.print()}>
              <FaCertificate /> Print Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to calculate total duration
const calculateTotalDuration = (videos) => {
  let totalMinutes = 0;
  videos.forEach(video => {
    const [minutes, seconds] = video.duration.split(':').map(Number);
    totalMinutes += minutes + seconds / 60;
  });
  
  // Add 10 minutes for intro video
  totalMinutes += 10;
  
  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.floor(totalMinutes % 60);
  
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export default CoursePage;