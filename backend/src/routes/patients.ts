import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';
import { requireStaff } from '../middleware/auth';

const router = Router();

// Validation middleware
const validatePatient = [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('dateOfBirth').isISO8601().withMessage('Invalid date of birth'),
  body('gender').isIn(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).withMessage('Invalid gender'),
  body('phone').isMobilePhone().withMessage('Invalid phone number'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
];

const validateSearch = [
  query('q').optional().isString().withMessage('Search query must be a string'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

// @route   GET /api/patients
// @desc    Get all patients with pagination and search
// @access  Private
router.get('/', validateSearch, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { q: searchQuery, page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  // Build search conditions
  const where: any = { isActive: true };
  
  if (searchQuery) {
    where.OR = [
      { firstName: { contains: searchQuery as string, mode: 'insensitive' } },
      { lastName: { contains: searchQuery as string, mode: 'insensitive' } },
      { patientId: { contains: searchQuery as string, mode: 'insensitive' } },
      { phone: { contains: searchQuery as string, mode: 'insensitive' } },
      { email: { contains: searchQuery as string, mode: 'insensitive' } },
    ];
  }

  // Get patients with count
  const [patients, totalCount] = await Promise.all([
    prisma.patient.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { lastName: 'asc' },
      select: {
        id: true,
        patientId: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        phone: true,
        email: true,
        city: true,
        state: true,
        insuranceProvider: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            appointments: true,
            treatments: true,
            medicalRecords: true,
          },
        },
      },
    }),
    prisma.patient.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / Number(limit));

  res.json({
    patients,
    pagination: {
      currentPage: Number(page),
      totalPages,
      totalCount,
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1,
    },
  });
}));

// @route   GET /api/patients/:id
// @desc    Get patient by ID with full details
// @access  Private
router.get('/:id', requireStaff, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      appointments: {
        orderBy: { date: 'desc' },
        take: 10,
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true,
              specialization: true,
            },
          },
        },
      },
      treatments: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      medicalRecords: {
        orderBy: { date: 'desc' },
        take: 10,
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      billing: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      documents: {
        orderBy: { uploadedAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!patient) {
    return res.status(404).json({
      error: 'Patient not found',
      message: 'Patient with the specified ID does not exist',
    });
  }

  res.json({ patient });
}));

// @route   POST /api/patients
// @desc    Create a new patient
// @access  Private
router.post('/', validatePatient, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const patientData = req.body;

  // Generate unique patient ID
  const generatePatientId = async (): Promise<string> => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const patientId = `P${year}${randomNum}`;
    
    const existing = await prisma.patient.findUnique({ where: { patientId } });
    if (existing) {
      return generatePatientId();
    }
    return patientId;
  };

  patientData.patientId = await generatePatientId();

  const patient = await prisma.patient.create({
    data: patientData,
    select: {
      id: true,
      patientId: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      gender: true,
      phone: true,
      email: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      emergencyContact: true,
      emergencyPhone: true,
      insuranceProvider: true,
      insuranceNumber: true,
      medicalHistory: true,
      allergies: true,
      medications: true,
      isActive: true,
      createdAt: true,
    },
  });

  res.status(201).json({
    message: 'Patient created successfully',
    patient,
  });
}));

// @route   PUT /api/patients/:id
// @desc    Update patient information
// @access  Private
router.put('/:id', validatePatient, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { id } = req.params;
  const updateData = req.body;

  // Check if patient exists
  const existingPatient = await prisma.patient.findUnique({
    where: { id },
  });

  if (!existingPatient) {
    return res.status(404).json({
      error: 'Patient not found',
      message: 'Patient with the specified ID does not exist',
    });
  }

  const patient = await prisma.patient.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      patientId: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      gender: true,
      phone: true,
      email: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      emergencyContact: true,
      emergencyPhone: true,
      insuranceProvider: true,
      insuranceNumber: true,
      medicalHistory: true,
      allergies: true,
      medications: true,
      isActive: true,
      updatedAt: true,
    },
  });

  res.json({
    message: 'Patient updated successfully',
    patient,
  });
}));

// @route   DELETE /api/patients/:id
// @desc    Soft delete patient (set isActive to false)
// @access  Private
router.delete('/:id', requireStaff, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if patient exists
  const existingPatient = await prisma.patient.findUnique({
    where: { id },
  });

  if (!existingPatient) {
    return res.status(404).json({
      error: 'Patient not found',
      message: 'Patient with the specified ID does not exist',
    });
  }

  // Soft delete by setting isActive to false
  await prisma.patient.update({
    where: { id },
    data: { isActive: false },
  });

  res.json({
    message: 'Patient deleted successfully',
  });
}));

// @route   GET /api/patients/:id/appointments
// @desc    Get patient appointments
// @access  Private
router.get('/:id/appointments', requireStaff, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [appointments, totalCount] = await Promise.all([
    prisma.appointment.findMany({
      where: { patientId: id },
      skip,
      take: Number(limit),
      orderBy: { date: 'desc' },
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
      },
    }),
    prisma.appointment.count({ where: { patientId: id } }),
  ]);

  const totalPages = Math.ceil(totalCount / Number(limit));

  res.json({
    appointments,
    pagination: {
      currentPage: Number(page),
      totalPages,
      totalCount,
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1,
    },
  });
}));

// @route   GET /api/patients/:id/medical-history
// @desc    Get patient medical history
// @access  Private
router.get('/:id/medical-history', requireStaff, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [medicalRecords, totalCount] = await Promise.all([
    prisma.medicalRecord.findMany({
      where: { patientId: id },
      skip,
      take: Number(limit),
      orderBy: { date: 'desc' },
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
        treatment: {
          select: {
            name: true,
            category: true,
            status: true,
          },
        },
      },
    }),
    prisma.medicalRecord.count({ where: { patientId: id } }),
  ]);

  const totalPages = Math.ceil(totalCount / Number(limit));

  res.json({
    medicalRecords,
    pagination: {
      currentPage: Number(page),
      totalPages,
      totalCount,
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1,
    },
  });
}));

export default router;
