const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Public routes (with optional auth)
router.get('/public', optionalAuth, quizController.getPublicQuizzes);
router.get('/:quizId', optionalAuth, quizController.getQuizForTaking);

// Protected routes
router.post('/', authenticateToken, quizController.createQuiz);
router.get('/user/created', authenticateToken, quizController.getUserQuizzes);
router.put('/:quizId', authenticateToken, quizController.updateQuiz);
router.delete('/:quizId', authenticateToken, quizController.deleteQuiz);
router.post('/:quizId/submit', authenticateToken, quizController.submitQuiz);
router.post('/:quizId/assign', authenticateToken, quizController.assignQuiz);

module.exports = router; 