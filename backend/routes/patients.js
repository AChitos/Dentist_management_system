const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Apply authentication to all patient routes
router.use(authenticateToken);

// Placeholder for patient routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Patient routes - to be implemented',
    endpoints: [
      'GET / - Get all patients',
      'GET /:id - Get patient by ID',
      'POST / - Create new patient',
      'PUT /:id - Update patient',
      'DELETE /:id - Delete patient'
    ]
  });
});

module.exports = router;
