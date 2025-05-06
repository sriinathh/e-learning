const mongoose = require("mongoose");

// Schema for test questions
const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 2; // Minimum 2 options required
      },
      message: 'A question must have at least 2 options'
    }
  },
  correctAnswer: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return v >= 0 && v < this.options.length;
      },
      message: 'Correct answer index must be valid'
    }
  },
  // Optional fields for advanced features
  explanation: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  },
  points: {
    type: Number,
    default: 1
  },
  type: {
    type: String,
    enum: ['singleChoice', 'multipleChoice', 'trueFalse', 'matching'],
    default: 'singleChoice'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
});

// Schema for online tests
const onlineTestSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  totalQuestions: {
    type: Number,
    default: function() {
      return this.questions.length;
    }
  },
  passingScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  availableFrom: {
    type: Date,
    default: Date.now
  },
  availableUntil: {
    type: Date,
    required: true
  },
  questions: [questionSchema],
  // Optional fields for advanced features
  isRandomized: {
    type: Boolean,
    default: false
  },
  allowRetakes: {
    type: Boolean,
    default: false
  },
  maxRetakes: {
    type: Number,
    default: 0
  },
  showAnswers: {
    type: Boolean,
    default: true
  },
  showAnswersAfter: {
    type: Date
  },
  timeLimit: {
    type: Number, // in minutes
    default: function() {
      return this.duration;
    }
  },
  instructions: {
    type: String,
    default: ""
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const OnlineTest = mongoose.model("OnlineTest", onlineTestSchema);

// Schema for test results
const testResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OnlineTest',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  submittedOn: {
    type: Date,
    default: Date.now
  },
  timeSpent: {
    type: Number, // in minutes
    required: true
  },
  answers: {
    type: [Number], // Array of selected option indexes
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  // Optional fields for detailed results
  attemptNumber: {
    type: Number,
    default: 1
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  incorrectAnswers: {
    type: Number,
    default: 0
  },
  unanswered: {
    type: Number,
    default: 0
  },
  detailedResponses: [{
    questionId: String,
    selectedAnswer: Number,
    isCorrect: Boolean,
    timeTaken: Number // seconds spent on this question
  }],
  feedback: {
    type: String,
    default: ""
  }
});

// Compound index to efficiently fetch a user's test results
testResultSchema.index({ userId: 1, testId: 1 });

const TestResult = mongoose.model("TestResult", testResultSchema);

module.exports = {
  OnlineTest,
  TestResult
}; 