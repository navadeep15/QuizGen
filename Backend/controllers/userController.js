const User = require('../models/User');
const Quiz = require('../models/Quiz');

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('quizzesCreated')
      .populate({
        path: 'quizzesTaken.quiz',
        select: 'title category'
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate statistics
    const totalQuizzesCreated = user.quizzesCreated.length;
    const totalQuizzesTaken = user.quizzesTaken.length;
    
    let totalScore = 0;
    let averageScore = 0;
    
    if (user.quizzesTaken.length > 0) {
      totalScore = user.quizzesTaken.reduce((sum, attempt) => sum + attempt.score, 0);
      const totalQuestions = user.quizzesTaken.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
      averageScore = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
    }

    // Get recent activity
    const recentAttempts = user.quizzesTaken
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 5);

    // Get category breakdown
    const categoryStats = {};
    user.quizzesTaken.forEach(attempt => {
      if (attempt.quiz && attempt.quiz.category) {
        if (!categoryStats[attempt.quiz.category]) {
          categoryStats[attempt.quiz.category] = { count: 0, totalScore: 0, totalQuestions: 0 };
        }
        categoryStats[attempt.quiz.category].count++;
        categoryStats[attempt.quiz.category].totalScore += attempt.score;
        categoryStats[attempt.quiz.category].totalQuestions += attempt.totalQuestions;
      }
    });

    // Calculate category averages
    Object.keys(categoryStats).forEach(category => {
      const stats = categoryStats[category];
      stats.averageScore = stats.totalQuestions > 0 
        ? Math.round((stats.totalScore / stats.totalQuestions) * 100) 
        : 0;
    });

    res.json({
      success: true,
      data: {
        quizzesCreated: totalQuizzesCreated,
        quizzesTaken: totalQuizzesTaken,
        averageScore,
        totalQuestions: user.quizzesTaken.reduce((sum, attempt) => sum + attempt.totalQuestions, 0),
        categoryStats,
        recentAttempts
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
};

// Get user's quiz history
exports.getQuizHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findById(req.userId)
      .populate({
        path: 'quizzesTaken.quiz',
        select: 'title category difficulty'
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const total = user.quizzesTaken.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedHistory = user.quizzesTaken
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedHistory
    });
  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz history',
      error: error.message
    });
  }
};

// Get user's created quizzes
exports.getCreatedQuizzes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findById(req.userId)
      .populate({
        path: 'quizzesCreated',
        select: 'title description category difficulty totalAttempts averageScore createdAt'
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const total = user.quizzesCreated.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedQuizzes = user.quizzesCreated
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedQuizzes
    });
  } catch (error) {
    console.error('Get created quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching created quizzes',
      error: error.message
    });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const { limit = 10, category } = req.query;

    let matchStage = {};
    if (category) {
      matchStage = { 'quizzesTaken.quiz.category': category };
    }

    const leaderboard = await User.aggregate([
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quizzesTaken.quiz',
          foreignField: '_id',
          as: 'quizDetails'
        }
      },
      {
        $unwind: '$quizzesTaken'
      },
      {
        $match: matchStage
      },
      {
        $group: {
          _id: '$_id',
          firstName: { $first: '$firstName' },
          lastName: { $first: '$lastName' },
          totalQuizzesTaken: { $sum: 1 },
          totalScore: { $sum: '$quizzesTaken.score' },
          totalQuestions: { $sum: '$quizzesTaken.totalQuestions' }
        }
      },
      {
        $addFields: {
          averageScore: {
            $cond: {
              if: { $gt: ['$totalQuestions', 0] },
              then: { $round: [{ $multiply: [{ $divide: ['$totalScore', '$totalQuestions'] }, 100] }, 2] },
              else: 0
            }
          }
        }
      },
      {
        $match: {
          totalQuizzesTaken: { $gte: 1 }
        }
      },
      {
        $sort: { averageScore: -1, totalQuizzesTaken: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          totalQuizzesTaken: 1,
          averageScore: 1,
          totalScore: 1,
          totalQuestions: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        leaderboard
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
};

// Deactivate user account
exports.deactivateAccount = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    // Deactivate account
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating account',
      error: error.message
    });
  }
}; 