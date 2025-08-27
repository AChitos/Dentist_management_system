const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { getDatabase } = require('../database/init');
const { generateToken, authenticateToken, getCurrentUser } = require('../middleware/auth');

// User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    const db = getDatabase();
    
    db.get('SELECT * FROM users WHERE username = ? AND is_active = 1', [username], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          error: 'Database error'
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Update last login
      db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

      // Generate token
      const token = generateToken(user);

      // Remove password from response
      const { password_hash, ...userWithoutPassword } = user;

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: userWithoutPassword
      });
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: error.message
    });
  }
});

// User registration (admin only)
router.post('/register', authenticateToken, async (req, res) => {
  try {
    const { username, email, password, full_name, role, specialization, phone } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only administrators can register new users'
      });
    }

    if (!username || !email || !password || !full_name || !role) {
      return res.status(400).json({
        success: false,
        error: 'All required fields must be provided'
      });
    }

    const db = getDatabase();
    
    // Check if username or email already exists
    db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], async (err, existingUser) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          error: 'Database error'
        });
      }

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'Username or email already exists'
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert new user
      db.run(`
        INSERT INTO users (username, email, password_hash, full_name, role, specialization, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [username, email, hashedPassword, full_name, role, specialization || null, phone || null], function(err) {
        if (err) {
          console.error('Insert error:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to create user'
          });
        }

        const newUserId = this.lastID;

        // Get the created user
        db.get('SELECT id, username, email, full_name, role, specialization, phone, avatar_url, is_active, created_at FROM users WHERE id = ?', [newUserId], (err, newUser) => {
          if (err) {
            console.error('Fetch error:', err);
            return res.status(500).json({
              success: false,
              error: 'Failed to fetch created user'
            });
          }

          res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: newUser
          });
        });
      });
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: error.message
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, getCurrentUser, (req, res) => {
  res.json({
    success: true,
    user: req.currentUser
  });
});

// Update user profile
router.put('/profile', authenticateToken, getCurrentUser, async (req, res) => {
  try {
    const { full_name, specialization, phone, avatar_url } = req.body;
    const userId = req.currentUser.id;

    const db = getDatabase();
    
    db.run(`
      UPDATE users 
      SET full_name = COALESCE(?, full_name),
          specialization = COALESCE(?, specialization),
          phone = COALESCE(?, phone),
          avatar_url = COALESCE(?, avatar_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [full_name, specialization, phone, avatar_url, userId], function(err) {
      if (err) {
        console.error('Update error:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to update profile'
        });
      }

      // Get updated user
      db.get('SELECT id, username, email, full_name, role, specialization, phone, avatar_url, is_active, created_at FROM users WHERE id = ?', [userId], (err, updatedUser) => {
        if (err) {
          console.error('Fetch error:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to fetch updated user'
          });
        }

        res.json({
          success: true,
          message: 'Profile updated successfully',
          user: updatedUser
        });
      });
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: 'Profile update failed',
      message: error.message
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, getCurrentUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.currentUser.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters long'
      });
    }

    const db = getDatabase();
    
    // Get current user with password
    db.get('SELECT password_hash FROM users WHERE id = ?', [userId], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          error: 'Database error'
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }

      // Hash new password
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      db.run('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [hashedNewPassword, userId], function(err) {
        if (err) {
          console.error('Password update error:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to update password'
          });
        }

        res.json({
          success: true,
          message: 'Password changed successfully'
        });
      });
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      error: 'Password change failed',
      message: error.message
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Refresh token
router.post('/refresh', (req, res) => {
  const { refreshToken } = require('../middleware/auth');
  refreshToken(req, res);
});

module.exports = router;
