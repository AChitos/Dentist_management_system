import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Validation middleware
const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
];

const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 2 }),
  body('lastName').trim().isLength({ min: 2 }),
  body('role').isIn(['ADMIN', 'DOCTOR', 'STAFF', 'RECEPTIONIST']),
];

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { email, password } = req.body;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      specialization: true,
    },
  });

  if (!user || !user.isActive) {
    return res.status(401).json({
      error: 'Invalid credentials',
      message: 'Email or password is incorrect',
    });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      error: 'Invalid credentials',
      message: 'Email or password is incorrect',
    });
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    message: 'Login successful',
    token,
    user: userWithoutPassword,
  });
}));

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Private (Admin only)
router.post('/register', authenticateToken, validateRegister, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  // Check if user has admin role
  if (req.user!.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Only administrators can register new users',
    });
  }

  const { email, password, firstName, lastName, role, specialization } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(409).json({
      error: 'User already exists',
      message: 'A user with this email already exists',
    });
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      specialization,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      specialization: true,
      isActive: true,
      createdAt: true,
    },
  });

  res.status(201).json({
    message: 'User registered successfully',
    user: newUser,
  });
}));

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', authenticateToken, asyncHandler(async (req, res) => {
  // Generate new token
  const token = jwt.sign(
    { 
      userId: req.user!.id, 
      email: req.user!.email, 
      role: req.user!.role 
    },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  res.json({
    message: 'Token refreshed successfully',
    token,
  });
}));

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // But we can log the logout event for audit purposes
  
  res.json({
    message: 'Logout successful',
  });
}));

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      specialization: true,
      phone: true,
      avatar: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      message: 'User profile not found',
    });
  }

  res.json({
    user,
  });
}));

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', authenticateToken, [
  body('currentPassword').isLength({ min: 6 }),
  body('newPassword').isLength({ min: 6 }),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { currentPassword, newPassword } = req.body;

  // Get current user with password
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { password: true },
  });

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      message: 'User profile not found',
    });
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    return res.status(401).json({
      error: 'Invalid password',
      message: 'Current password is incorrect',
    });
  }

  // Hash new password
  const saltRounds = 12;
  const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

  // Update password
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { password: hashedNewPassword },
  });

  res.json({
    message: 'Password changed successfully',
  });
}));

export default router;
