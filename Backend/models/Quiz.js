const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Option text is required'],
    trim: true
  },
  isCorrect: {
    type: Boolean,
    default: false
  }
});

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: {
    type: [optionSchema],
    validate: {
      validator: function(options) {
        return options.length >= 2 && options.length <= 5;
      },
      message: 'Each question must have between 2 and 5 options'
    }
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  questions: {
    type: [questionSchema],
    required: [true, 'Questions are required'],
    validate: {
      validator: function(questions) {
        return questions.length > 0;
      },
      message: 'Quiz must have at least one question'
    }
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    trim: true,
    default: 'General'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  timeLimit: {
    type: Number, // in minutes
    default: null
  },
  attempts: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: Number,
    totalQuestions: Number,
    answers: [{
      questionIndex: Number,
      selectedOption: Number,
      isCorrect: Boolean
    }],
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageScore: {
    type: Number,
    default: 0
  },
  totalAttempts: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Method to calculate average score
quizSchema.methods.calculateAverageScore = function() {
  if (this.attempts.length === 0) return 0;
  
  const totalScore = this.attempts.reduce((sum, attempt) => sum + attempt.score, 0);
  return Math.round((totalScore / this.attempts.length) * 100) / 100;
};

// Method to add attempt
quizSchema.methods.addAttempt = function(userId, score, totalQuestions, answers) {
  this.attempts.push({
    user: userId,
    score,
    totalQuestions,
    answers
  });
  
  this.totalAttempts = this.attempts.length;
  this.averageScore = this.calculateAverageScore();
  
  return this.save();
};

// Static method to get public quizzes
quizSchema.statics.getPublicQuizzes = function() {
  return this.find({ isPublic: true })
    .populate('creator', 'firstName lastName')
    .select('-questions.options.isCorrect')
    .sort({ createdAt: -1 });
};

// Static method to get quiz by ID (without correct answers)
quizSchema.statics.getQuizForTaking = function(quizId) {
  return this.findById(quizId)
    .populate('creator', 'firstName lastName')
    .select('-questions.options.isCorrect');
};

module.exports = mongoose.model('Quiz', quizSchema); 