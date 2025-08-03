const mongoose = require('mongoose');

const quizAssignmentSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'expired'],
    default: 'pending'
  },
  completedAt: {
    type: Date
  },
  score: {
    type: Number
  },
  totalQuestions: {
    type: Number
  },
  timeTaken: {
    type: Number, // Time taken in seconds
    default: 0
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
quizAssignmentSchema.index({ assignedTo: 1, status: 1 });
quizAssignmentSchema.index({ quiz: 1, assignedTo: 1 }, { unique: true });

module.exports = mongoose.model('QuizAssignment', quizAssignmentSchema); 