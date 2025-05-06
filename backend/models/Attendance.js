const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  attendedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Optional fields for more detailed tracking
  startTime: {
    type: String,
    default: ""
  },
  endTime: {
    type: String,
    default: ""
  },
  topic: {
    type: String,
    default: ""
  },
  notes: {
    type: String,
    default: ""
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Compound index to ensure uniqueness of course + date combination
attendanceRecordSchema.index({ courseId: 1, date: 1 }, { unique: true });

const AttendanceRecord = mongoose.model("AttendanceRecord", attendanceRecordSchema);

// Schema for student attendance summary
const attendanceSummarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    default: 0
  },
  attended: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  // Optional fields for detailed tracking
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  monthlyBreakdown: [{
    month: String, // "YYYY-MM" format
    total: Number,
    attended: Number,
    percentage: Number
  }]
});

// Compound index for user + course combination
attendanceSummarySchema.index({ userId: 1, courseId: 1 }, { unique: true });

const AttendanceSummary = mongoose.model("AttendanceSummary", attendanceSummarySchema);

module.exports = {
  AttendanceRecord,
  AttendanceSummary
}; 