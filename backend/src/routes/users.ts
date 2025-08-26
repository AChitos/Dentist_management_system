import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';
import { requireAdmin, requireStaff } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = Router();

// Validation middleware
const validateUser = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('firstName').isString().notEmpty().withMessage('First name is required'),
  body('lastName').isString().notEmpty().withMessage('Last name is required'),
  body('role').isIn(['ADMIN', 'DOCTOR', 'STAFF', 'RECEPTIONIST']).withMessage('Valid role is required'),
  body('phone').optional().isString().withMessage('Phone must be a string'),
  body('specialization').optional().isString().withMessage('Specialization must be a string'),
];

const validateUserUpdate = [
  body('firstName').optional().isString().notEmpty().withMessage('First name must be a non-empty string'),
  body('lastName').optional().isString().notEmpty().withMessage('Last name must be a non-empty string'),
  body('role').optional().isIn(['ADMIN', 'DOCTOR', 'STAFF', 'RECEPTIONIST']).withMessage('Valid role is required'),
  body('phone').optional().isString().withMessage('Phone must be a string'),
  body('specialization').optional().isString().withMessage('Specialization must be a string'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

const validatePasswordChange = [
  body('currentPassword').isString().notEmpty().withMessage('Current password is required'),
  body('newPassword').isString().isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

const validateSearch = [
  query('q').optional().isString().withMessage('Search query must be a string'),
  query('role').optional().isIn(['ADMIN', 'DOCTOR', 'STAFF', 'RECEPTIONIST']).withMessage('Valid role is required'),
  query('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

// @route   GET /api/users
// @desc    Get all users with filtering and pagination
// @access  Private (Admin/Staff)
router.get('/', validateSearch, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { q: searchQuery, role, isActive, page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  // Build search conditions
  const where: any = {};
  
  if (searchQuery) {
    where.OR = [
      { firstName: { contains: searchQuery as string, mode: 'insensitive' } },
      { lastName: { contains: searchQuery as string, mode: 'insensitive' } },
      { email: { contains: searchQuery as string, mode: 'insensitive' } },
      { specialization: { contains: searchQuery as string, mode: 'insensitive' } },
    ];
  }
  
  if (role) {
    where.role = role;
  }
  
  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  // Get users with count
  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { lastName: 'asc' },
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
        _count: {
          select: {
            appointments: true,
            treatments: true,
            medicalRecords: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / Number(limit));

  res.json({
    users,
    pagination: {
      currentPage: Number(page),
      totalPages,
      totalCount,
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1,
    },
  });
}));

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Admin/Staff)
router.get('/:id', requireStaff, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
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
      _count: {
        select: {
          appointments: true,
          treatments: true,
          medicalRecords: true,
          billing: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      message: 'User with the specified ID does not exist',
    });
  }

  res.json({ user });
}));

// @route   POST /api/users
// @desc    Create a new user (Admin only)
// @access  Private (Admin)
router.post('/', validateUser, requireAdmin, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const userData = req.body;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (existingUser) {
    return res.status(409).json({
      error: 'Email already exists',
      message: 'A user with this email already exists',
    });
  }

  // Generate a random password
  const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(randomPassword, 12);

  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
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
      createdAt: true,
    },
  });

  res.status(201).json({
    message: 'User created successfully',
    user,
    temporaryPassword: randomPassword,
    note: 'Please share this temporary password with the user. They should change it on first login.',
  });
}));

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin/Staff - can update own profile, Admin can update anyone)
router.put('/:id', validateUserUpdate, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { id } = req.params;
  const updateData = req.body;
  const currentUser = (req as any).user;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    return res.status(404).json({
      error: 'User not found',
      message: 'User with the specified ID does not exist',
    });
  }

  // Check permissions
  if (currentUser.role !== 'ADMIN' && currentUser.id !== id) {
    return res.status(403).json({
      error: 'Access denied',
      message: 'You can only update your own profile',
    });
  }

  // Only admins can change roles
  if (updateData.role && currentUser.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Only administrators can change user roles',
    });
  }

  // Only admins can deactivate users
  if (updateData.isActive === false && currentUser.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Only administrators can deactivate users',
    });
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
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
      updatedAt: true,
    },
  });

  res.json({
    message: 'User updated successfully',
    user,
  });
}));

// @route   PATCH /api/users/:id/password
// @desc    Change user password
// @access  Private (Admin can change anyone's password, users can change their own)
router.patch('/:id/password', validatePasswordChange, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;
  const currentUser = (req as any).user;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    return res.status(404).json({
      error: 'User not found',
      message: 'User with the specified ID does not exist',
    });
  }

  // Check permissions
  if (currentUser.role !== 'ADMIN' && currentUser.id !== id) {
    return res.status(403).json({
      error: 'Access denied',
      message: 'You can only change your own password',
    });
  }

  // Verify current password (skip for admin password changes)
  if (currentUser.role !== 'ADMIN') {
    const isPasswordValid = await bcrypt.compare(currentPassword, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Current password is incorrect',
      });
    }
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });

  res.json({
    message: 'Password changed successfully',
  });
}));

// @route   PATCH /api/users/:id/reset-password
// @desc    Reset user password (Admin only)
// @access  Private (Admin)
router.patch('/:id/reset-password', requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    return res.status(404).json({
      error: 'User not found',
      message: 'User with the specified ID does not exist',
    });
  }

  // Generate a random password
  const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(randomPassword, 12);

  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });

  res.json({
    message: 'Password reset successfully',
    temporaryPassword: randomPassword,
    note: 'Please share this temporary password with the user. They should change it on next login.',
  });
}));

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin)
router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    return res.status(404).json({
      error: 'User not found',
      message: 'User with the specified ID does not exist',
    });
  }

  // Prevent deletion of the last admin
  if (existingUser.role === 'ADMIN') {
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN', isActive: true },
    });

    if (adminCount <= 1) {
      return res.status(400).json({
        error: 'Cannot delete user',
        message: 'Cannot delete the last administrator',
      });
    }
  }

  // Check if user has associated records
  const hasRecords = await prisma.user.findFirst({
    where: {
      id,
      OR: [
        { appointments: { some: {} } },
        { treatments: { some: {} } },
        { medicalRecords: { some: {} } },
        { billing: { some: {} } },
      ],
    },
  });

  if (hasRecords) {
    // Soft delete
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({
      message: 'User deactivated successfully (has associated records)',
    });
  } else {
    // Hard delete
    await prisma.user.delete({
      where: { id },
    });

    res.json({
      message: 'User deleted successfully',
    });
  }
}));

// @route   GET /api/users/doctors
// @desc    Get all doctors
// @access  Private (Staff)
router.get('/doctors', requireStaff, asyncHandler(async (req, res) => {
  const doctors = await prisma.user.findMany({
    where: {
      role: { in: ['ADMIN', 'DOCTOR'] },
      isActive: true,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      specialization: true,
      phone: true,
      avatar: true,
    },
    orderBy: { lastName: 'asc' },
  });

  res.json({ doctors });
}));

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', requireStaff, asyncHandler(async (req, res) => {
  const currentUser = (req as any).user;

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
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

  res.json({ user });
}));

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', [
  body('firstName').optional().isString().notEmpty().withMessage('First name must be a non-empty string'),
  body('lastName').optional().isString().notEmpty().withMessage('Last name must be a non-empty string'),
  body('phone').optional().isString().withMessage('Phone must be a string'),
  body('specialization').optional().isString().withMessage('Specialization must be a string'),
], requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const updateData = req.body;
  const currentUser = (req as any).user;

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: updateData,
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
      updatedAt: true,
    },
  });

  res.json({
    message: 'Profile updated successfully',
    user,
  });
}));

export default router;
