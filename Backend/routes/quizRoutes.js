const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Public routes (with optional auth)
router.get('/public', optionalAuth, quizController.getPublicQuizzes);

// Protected routes
router.post('/', authenticateToken, quizController.createQuiz);
router.get('/user/created', authenticateToken, quizController.getUserQuizzes);
router.get('/assigned', authenticateToken, quizController.getAssignedQuizzes);
router.get('/assignments/results', authenticateToken, quizController.getAssignmentResults);
router.get('/assigned/:quizId', authenticateToken, quizController.getAssignedQuizForTaking); // New route for assigned quizzes
router.put('/:quizId', authenticateToken, quizController.updateQuiz);
router.delete('/:quizId', authenticateToken, quizController.deleteQuiz);
router.post('/:quizId/submit', authenticateToken, quizController.submitQuiz);
router.post('/:quizId/assign', authenticateToken, quizController.assignQuiz);

// Generic quiz route (must be last to avoid conflicts)
router.get('/:quizId', optionalAuth, quizController.getQuizForTaking);

module.exports = router; 