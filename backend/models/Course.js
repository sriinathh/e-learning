const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ""
  },
  videoUrl: {
    type: String,
    default: ""
  },
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'video', 'link', 'other'],
      default: 'other'
    }
  }]
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  order: {
    type: Number,
    default: 0
  },
  lessons: [lessonSchema]
});

const facultyDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: "Instructor"
  },
  bio: {
    type: String,
    default: ""
  },
  expertise: [String],
  photo: {
    type: String,
    default: ""
  },
  contactHours: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: ""
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    website: String
  }
});

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ""
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    default: 'All Levels'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  students: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  categories: [String],
  tags: [String],
  modules: [moduleSchema],
  facultyDetails: facultyDetailsSchema,
  prerequisites: [String],
  outcomes: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add course index for searching
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Course = mongoose.model("Course", courseSchema);

module.exports = Course; 