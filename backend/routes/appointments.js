const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Apply authentication to all appointment routes
router.use(authenticateToken);

// Placeholder for appointment routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Appointment routes - to be implemented',
    endpoints: [
      'GET / - Get all appointments',
      'GET /:id - Get appointment by ID',
      'POST / - Create new appointment',
      'PUT /:id - Update appointment',
      'DELETE /:id - Delete appointment'
    ]
  });
});

module.exports = router;
