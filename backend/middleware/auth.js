const jwt = require('jsonwebtoken');
const { getDatabase } = require('../database/init');

const JWT_SECRET = process.env.JWT_SECRET || 'zendenta-jwt-secret-2024';

// Verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
    
    req.user = user;
    next();
  });
}

// Check if user has required role
function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
}

// Check if user is admin
function requireAdmin(req, res, next) {
  return requireRole(['admin'])(req, res, next);
}

// Check if user is doctor or admin
function requireDoctor(req, res, next) {
  return requireRole(['admin', 'doctor'])(req, res, next);
}

// Get current user from database
async function getCurrentUser(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const db = getDatabase();
    
    db.get('SELECT id, username, email, full_name, role, specialization, phone, avatar_url, is_active, last_login, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          error: 'Database error'
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          error: 'User account is deactivated'
        });
      }

      req.currentUser = user;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication error'
    });
  }
}

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Refresh token
function refreshToken(req, res) {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      error: 'Refresh token required'
    });
  }

  jwt.verify(refreshToken, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    const newToken = generateToken(user);
    
    res.json({
      success: true,
      token: newToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  });
}

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireDoctor,
  getCurrentUser,
  generateToken,
  refreshToken,
  JWT_SECRET
};
