const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Apply authentication to all user routes
router.use(authenticateToken);

// Placeholder for user routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'User routes - to be implemented',
    endpoints: [
      'GET / - Get all users',
      'GET /:id - Get user by ID',
      'POST / - Create new user',
      'PUT /:id - Update user',
      'DELETE /:id - Delete user'
    ]
  });
});

module.exports = router;
