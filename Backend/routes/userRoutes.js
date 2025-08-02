const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// User statistics and profile
router.get('/stats', userController.getUserStats);
router.get('/history', userController.getQuizHistory);
router.get('/created-quizzes', userController.getCreatedQuizzes);

// Leaderboard (public but requires auth for tracking)
router.get('/leaderboard', userController.getLeaderboard);

// Account management
router.post('/deactivate', userController.deactivateAccount);

module.exports = router; 