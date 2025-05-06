# Simple-Course API Documentation

This document provides comprehensive documentation for the Simple-Course API, which serves as the backend for the Simple-Course feature in the e-learning platform.

## Overview

The Simple-Course API provides functionality for:

- Course management and details
- Faculty information
- Attendance tracking
- Faculty feedback collection
- Online tests and quizzes
- Student progress and results tracking

## Base URL

All API endpoints are prefixed with:

```
/api/simple-course
```

## Authentication

Most endpoints require authentication using a JWT token. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Endpoints

### Courses

#### Get All Courses

```
GET /courses
```

Returns a list of all available courses with basic information.

**Response:**
```json
[
  {
    "id": "web-dev",
    "title": "The Complete Web Development Bootcamp",
    "instructor": "Dr. Angela Yu",
    "description": "Learn HTML, CSS, JavaScript, React, Node and more...",
    "image": "https://cdn-icons-png.flaticon.com/512/2721/2721295.png",
    "level": "Beginner to Advanced",
    "rating": 4.8,
    "students": 768450
  }
]
```

#### Get Course Details

```
GET /courses/:courseId
```

Returns detailed information about a specific course, including modules and lessons.

**Response:**
```json
{
  "id": "web-dev",
  "title": "The Complete Web Development Bootcamp",
  "instructor": "Dr. Angela Yu",
  "description": "Learn HTML, CSS, JavaScript, React, Node and more...",
  "image": "https://cdn-icons-png.flaticon.com/512/2721/2721295.png",
  "level": "Beginner to Advanced",
  "rating": 4.8,
  "students": 768450,
  "modules": [
    {
      "id": "module-1",
      "title": "Introduction to HTML",
      "lessons": [
        {
          "id": "html-basics",
          "title": "HTML Basics",
          "duration": "45 min",
          "completed": false
        }
      ]
    }
  ],
  "facultyDetails": {
    "name": "Dr. Angela Yu",
    "title": "Senior Web Development Instructor",
    "bio": "Dr. Angela Yu is a developer and lead instructor...",
    "expertise": ["HTML/CSS", "JavaScript", "React", "Node.js"],
    "photo": "https://randomuser.me/api/portraits/women/44.jpg",
    "contactHours": "Mondays and Wednesdays 3-5pm"
  }
}
```

### Faculty

#### Get Faculty Details

```
GET /courses/:courseId/faculty
```

Returns detailed information about the faculty for a specific course.

**Response:**
```json
{
  "name": "Dr. Angela Yu",
  "title": "Senior Web Development Instructor",
  "bio": "Dr. Angela Yu is a developer and lead instructor...",
  "expertise": ["HTML/CSS", "JavaScript", "React", "Node.js"],
  "photo": "https://randomuser.me/api/portraits/women/44.jpg",
  "contactHours": "Mondays and Wednesdays 3-5pm"
}
```

### Attendance

#### Get Course Attendance (Faculty View)

```
GET /courses/:courseId/attendance
```

**Authentication Required**: Yes  
**Role Required**: Faculty/Admin

Returns attendance records for all students in a course.

**Response:**
```json
{
  "dates": [
    {
      "date": "2023-10-01",
      "attendedStudents": ["user123", "user456", "user789"]
    },
    {
      "date": "2023-10-03",
      "attendedStudents": ["user123", "user789"]
    }
  ],
  "summary": {
    "user123": {
      "total": 3,
      "attended": 3,
      "percentage": 100
    },
    "user456": {
      "total": 3,
      "attended": 2,
      "percentage": 66.67
    }
  }
}
```

#### Get Student Attendance

```
GET /courses/:courseId/attendance?userId=user123
```

**Authentication Required**: Yes

Returns attendance records for a specific student in a course.

**Response:**
```json
{
  "summary": {
    "total": 3,
    "attended": 3,
    "percentage": 100
  },
  "dates": [
    {
      "date": "2023-10-01",
      "attended": true
    },
    {
      "date": "2023-10-03",
      "attended": true
    },
    {
      "date": "2023-10-05",
      "attended": true
    }
  ]
}
```

#### Mark Attendance

```
POST /courses/:courseId/attendance
```

**Authentication Required**: Yes

Marks a student as present for a specific date.

**Request Body:**
```json
{
  "date": "2023-10-10"
}
```

**Response:**
```json
{
  "message": "Attendance marked successfully",
  "attendance": {
    "total": 4,
    "attended": 4,
    "percentage": 100
  }
}
```

### Feedback

#### Get Course Feedback

```
GET /courses/:courseId/feedback
```

Returns all feedback for a specific course.

**Response:**
```json
[
  {
    "id": "fb1",
    "userId": "user123",
    "rating": 4.5,
    "comment": "Dr. Yu explains complex concepts in a simple manner. Great course!",
    "date": "2023-09-15"
  },
  {
    "id": "fb2",
    "userId": "user456",
    "rating": 5,
    "comment": "Excellent teaching style and comprehensive content.",
    "date": "2023-09-18"
  }
]
```

#### Submit Feedback

```
POST /courses/:courseId/feedback
```

**Authentication Required**: Yes

Submits feedback for a course.

**Request Body:**
```json
{
  "rating": 4.8,
  "comment": "Excellent course! The instructor explains complex topics clearly."
}
```

**Response:**
```json
{
  "message": "Feedback submitted successfully",
  "feedback": {
    "id": "fb123456",
    "userId": "user123",
    "rating": 4.8,
    "comment": "Excellent course! The instructor explains complex topics clearly.",
    "date": "2023-10-15"
  }
}
```

### Online Tests

#### Get Available Tests

```
GET /courses/:courseId/tests
```

**Authentication Required**: Yes

Returns a list of available tests for a course without the questions.

**Response:**
```json
[
  {
    "id": "test-html",
    "title": "HTML Fundamentals Quiz",
    "duration": 30,
    "totalQuestions": 20,
    "passingScore": 70,
    "availableUntil": "2023-12-31"
  },
  {
    "id": "test-css",
    "title": "CSS Styling Test",
    "duration": 45,
    "totalQuestions": 25,
    "passingScore": 70,
    "availableUntil": "2023-12-31"
  }
]
```

#### Get Test to Take

```
GET /courses/:courseId/tests/:testId
```

**Authentication Required**: Yes

Returns the full test with questions for a student to take.

**Response:**
```json
{
  "id": "test-html",
  "title": "HTML Fundamentals Quiz",
  "duration": 30,
  "totalQuestions": 20,
  "passingScore": 70,
  "availableUntil": "2023-12-31",
  "questions": [
    {
      "id": "q1",
      "text": "What does HTML stand for?",
      "options": [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Hyperlinks and Text Markup Language",
        "Home Tool Markup Language"
      ]
    }
  ]
}
```

#### Submit Test

```
POST /courses/:courseId/tests/:testId/submit
```

**Authentication Required**: Yes

Submits a completed test for grading.

**Request Body:**
```json
{
  "answers": [0, 0, 1, 2, 0],
  "timeSpent": 25
}
```

**Response:**
```json
{
  "message": "Test submitted successfully. Your score: 85%",
  "result": {
    "score": 85,
    "submittedOn": "2023-10-15",
    "timeSpent": 25,
    "answers": [0, 0, 1, 2, 0],
    "passed": true
  }
}
```

### Results

#### Get All Test Results

```
GET /my-results
```

**Authentication Required**: Yes

Returns all test results for the authenticated student.

**Response:**
```json
{
  "test-html": {
    "score": 85,
    "submittedOn": "2023-09-10",
    "timeSpent": 25,
    "answers": [0, 0, 1, 2, 0],
    "passed": true
  },
  "test-react-basics": {
    "score": 80,
    "submittedOn": "2023-09-15",
    "timeSpent": 35,
    "answers": [0, 0, 2, 1, 0],
    "passed": true
  }
}
```

#### Get Specific Test Result

```
GET /courses/:courseId/tests/:testId/result
```

**Authentication Required**: Yes

Returns the result of a specific test for the authenticated student.

**Response:**
```json
{
  "score": 85,
  "submittedOn": "2023-09-10",
  "timeSpent": 25,
  "answers": [0, 0, 1, 2, 0],
  "passed": true
}
```

### Progress Tracking

#### Mark Lesson as Completed

```
POST /courses/:courseId/modules/:moduleId/lessons/:lessonId/complete
```

**Authentication Required**: Yes

Marks a specific lesson as completed for the authenticated student.

**Response:**
```json
{
  "message": "Lesson marked as completed",
  "lesson": {
    "id": "html-basics",
    "title": "HTML Basics",
    "duration": "45 min",
    "completed": true
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "message": "Invalid input data"
}
```

### 401 Unauthorized

```json
{
  "message": "Unauthorized: No token provided"
}
```

### 404 Not Found

```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "message": "Internal server error"
}
```

## Data Models

### Course

```json
{
  "id": "string",
  "title": "string",
  "instructor": "string",
  "description": "string",
  "image": "string",
  "level": "string",
  "rating": "number",
  "students": "number",
  "modules": "array",
  "facultyDetails": "object"
}
```

### Module

```json
{
  "id": "string",
  "title": "string",
  "lessons": "array"
}
```

### Lesson

```json
{
  "id": "string",
  "title": "string",
  "duration": "string",
  "completed": "boolean"
}
```

### Faculty Details

```json
{
  "name": "string",
  "title": "string",
  "bio": "string",
  "expertise": "array",
  "photo": "string",
  "contactHours": "string"
}
```

### Attendance Record

```json
{
  "date": "string",
  "attendedStudents": "array"
}
```

### Attendance Summary

```json
{
  "total": "number",
  "attended": "number",
  "percentage": "number"
}
```

### Feedback

```json
{
  "id": "string",
  "userId": "string",
  "rating": "number",
  "comment": "string",
  "date": "string"
}
```

### Test

```json
{
  "id": "string",
  "title": "string",
  "duration": "number",
  "totalQuestions": "number",
  "passingScore": "number",
  "availableUntil": "string",
  "questions": "array"
}
```

### Question

```json
{
  "id": "string",
  "text": "string",
  "options": "array",
  "correctAnswer": "number"
}
```

### Test Result

```json
{
  "score": "number",
  "submittedOn": "string",
  "timeSpent": "number",
  "answers": "array",
  "passed": "boolean"
}
``` 