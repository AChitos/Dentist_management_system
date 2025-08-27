const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Apply authentication to all treatment routes
router.use(authenticateToken);

// Placeholder for treatment routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Treatment routes - to be implemented',
    endpoints: [
      'GET / - Get all treatments',
      'GET /:id - Get treatment by ID',
      'POST / - Create new treatment',
      'PUT /:id - Update treatment',
      'DELETE /:id - Delete treatment'
    ]
  });
});

module.exports = router;
