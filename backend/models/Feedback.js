const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  // Additional fields for more detailed feedback
  teachingQuality: {
    type: Number,
    min: 1,
    max: 5
  },
  contentQuality: {
    type: Number,
    min: 1,
    max: 5
  },
  materialQuality: {
    type: Number,
    min: 1,
    max: 5
  },
  interactionQuality: {
    type: Number,
    min: 1,
    max: 5
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'anonymous'],
    default: 'public'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  facultyResponse: {
    text: String,
    date: Date
  }
});

// Compound index to ensure a user can provide only one feedback per course
feedbackSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback; 