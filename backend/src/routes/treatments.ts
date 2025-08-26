import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';
import { requireStaff } from '../middleware/auth';

const router = Router();

// Validation middleware
const validateTreatment = [
  body('patientId').isString().notEmpty().withMessage('Patient ID is required'),
  body('doctorId').isString().notEmpty().withMessage('Doctor ID is required'),
  body('name').isString().notEmpty().withMessage('Treatment name is required'),
  body('category').isIn(['PREVENTIVE', 'RESTORATIVE', 'SURGICAL', 'ORTHODONTIC', 'COSMETIC', 'EMERGENCY', 'DIAGNOSTIC']).withMessage('Valid treatment category is required'),
  body('cost').isFloat({ min: 0 }).withMessage('Valid cost is required'),
  body('insuranceCoverage').optional().isFloat({ min: 0 }).withMessage('Insurance coverage must be a positive number'),
];

const validateSearch = [
  query('q').optional().isString().withMessage('Search query must be a string'),
  query('category').optional().isIn(['PREVENTIVE', 'RESTORATIVE', 'SURGICAL', 'ORTHODONTIC', 'COSMETIC', 'EMERGENCY', 'DIAGNOSTIC']).withMessage('Valid category is required'),
  query('status').optional().isIn(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD']).withMessage('Valid status is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

// @route   GET /api/treatments
// @desc    Get all treatments with filtering and pagination
// @access  Private
router.get('/', validateSearch, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { q: searchQuery, category, status, page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  // Build search conditions
  const where: any = {};
  
  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery as string, mode: 'insensitive' } },
      { description: { contains: searchQuery as string, mode: 'insensitive' } },
    ];
  }
  
  if (category) {
    where.category = category;
  }
  
  if (status) {
    where.status = status;
  }

  // Get treatments with count
  const [treatments, totalCount] = await Promise.all([
    prisma.treatment.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        patient: {
          select: {
            id: true,
            patientId: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
        _count: {
          select: {
            medicalRecords: true,
          },
        },
      },
    }),
    prisma.treatment.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / Number(limit));

  res.json({
    treatments,
    pagination: {
      currentPage: Number(page),
      totalPages,
      totalCount,
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1,
    },
  });
}));

// @route   GET /api/treatments/:id
// @desc    Get treatment by ID
// @access  Private
router.get('/:id', requireStaff, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const treatment = await prisma.treatment.findUnique({
    where: { id },
    include: {
      patient: {
        select: {
          id: true,
          patientId: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
          dateOfBirth: true,
          gender: true,
          medicalHistory: true,
          allergies: true,
        },
      },
      doctor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          specialization: true,
          phone: true,
        },
      },
      medicalRecords: {
        orderBy: { date: 'desc' },
        take: 10,
        select: {
          id: true,
          date: true,
          diagnosis: true,
          treatment: true,
          notes: true,
        },
      },
    },
  });

  if (!treatment) {
    return res.status(404).json({
      error: 'Treatment not found',
      message: 'Treatment with the specified ID does not exist',
    });
  }

  res.json({ treatment });
}));

// @route   POST /api/treatments
// @desc    Create a new treatment
// @access  Private
router.post('/', validateTreatment, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const treatmentData = req.body;

  // Check if patient exists
  const patient = await prisma.patient.findUnique({
    where: { id: treatmentData.patientId },
  });

  if (!patient) {
    return res.status(404).json({
      error: 'Patient not found',
      message: 'Patient with the specified ID does not exist',
    });
  }

  // Check if doctor exists
  const doctor = await prisma.user.findUnique({
    where: { id: treatmentData.doctorId },
  });

  if (!doctor || !['ADMIN', 'DOCTOR'].includes(doctor.role)) {
    return res.status(404).json({
      error: 'Doctor not found',
      message: 'Doctor with the specified ID does not exist',
    });
  }

  // Calculate patient amount
  const patientAmount = treatmentData.cost - (treatmentData.insuranceCoverage || 0);

  const treatment = await prisma.treatment.create({
    data: {
      ...treatmentData,
      patientAmount: Math.max(0, patientAmount),
    },
    include: {
      patient: {
        select: {
          id: true,
          patientId: true,
          firstName: true,
          lastName: true,
        },
      },
      doctor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  // Create billing record
  await prisma.billing.create({
    data: {
      patientId: treatmentData.patientId,
      doctorId: treatmentData.doctorId,
      treatmentId: treatment.id,
      amount: treatmentData.cost,
      insuranceAmount: treatmentData.insuranceCoverage || 0,
      patientAmount: Math.max(0, patientAmount),
      status: 'PENDING',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  res.status(201).json({
    message: 'Treatment created successfully',
    treatment,
  });
}));

// @route   PUT /api/treatments/:id
// @desc    Update treatment
// @access  Private
router.put('/:id', validateTreatment, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { id } = req.params;
  const updateData = req.body;

  // Check if treatment exists
  const existingTreatment = await prisma.treatment.findUnique({
    where: { id },
  });

  if (!existingTreatment) {
    return res.status(404).json({
      error: 'Treatment not found',
      message: 'Treatment with the specified ID does not exist',
    });
  }

  // Calculate patient amount
  const patientAmount = updateData.cost - (updateData.insuranceCoverage || 0);

  const treatment = await prisma.treatment.update({
    where: { id },
    data: {
      ...updateData,
      patientAmount: Math.max(0, patientAmount),
    },
    include: {
      patient: {
        select: {
          id: true,
          patientId: true,
          firstName: true,
          lastName: true,
        },
      },
      doctor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  // Update billing record
  await prisma.billing.updateMany({
    where: { treatmentId: id },
    data: {
      amount: updateData.cost,
      insuranceAmount: updateData.insuranceCoverage || 0,
      patientAmount: Math.max(0, patientAmount),
    },
  });

  res.json({
    message: 'Treatment updated successfully',
    treatment,
  });
}));

// @route   PATCH /api/treatments/:id/status
// @desc    Update treatment status
// @access  Private
router.patch('/:id/status', [
  body('status').isIn(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD']).withMessage('Valid status is required'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
  body('plannedDate').optional().isISO8601().withMessage('Valid planned date is required'),
  body('completedDate').optional().isISO8601().withMessage('Valid completed date is required'),
], requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { id } = req.params;
  const { status, notes, plannedDate, completedDate } = req.body;

  // Check if treatment exists
  const existingTreatment = await prisma.treatment.findUnique({
    where: { id },
  });

  if (!existingTreatment) {
    return res.status(404).json({
      error: 'Treatment not found',
      message: 'Treatment with the specified ID does not exist',
    });
  }

  const updateData: any = { status };
  
  if (notes) updateData.notes = notes;
  if (plannedDate) updateData.plannedDate = new Date(plannedDate);
  if (completedDate) updateData.completedDate = new Date(completedDate);

  const treatment = await prisma.treatment.update({
    where: { id },
    data: updateData,
    include: {
      patient: {
        select: {
          id: true,
          patientId: true,
          firstName: true,
          lastName: true,
        },
      },
      doctor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  res.json({
    message: 'Treatment status updated successfully',
    treatment,
  });
}));

// @route   DELETE /api/treatments/:id
// @desc    Delete treatment
// @access  Private
router.delete('/:id', requireStaff, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if treatment exists
  const existingTreatment = await prisma.treatment.findUnique({
    where: { id },
  });

  if (!existingTreatment) {
    return res.status(404).json({
      error: 'Treatment not found',
      message: 'Treatment with the specified ID does not exist',
    });
  }

  // Only allow deletion of planned treatments
  if (existingTreatment.status !== 'PLANNED') {
    return res.status(400).json({
      error: 'Cannot delete treatment',
      message: 'Only planned treatments can be deleted',
    });
  }

  // Delete associated billing records
  await prisma.billing.deleteMany({
    where: { treatmentId: id },
  });

  // Delete treatment
  await prisma.treatment.delete({
    where: { id },
  });

  res.json({
    message: 'Treatment deleted successfully',
  });
}));

// @route   GET /api/treatments/patient/:patientId
// @desc    Get treatments for a specific patient
// @access  Private
router.get('/patient/:patientId', requireStaff, asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  // Check if patient exists
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
  });

  if (!patient) {
    return res.status(404).json({
      error: 'Patient not found',
      message: 'Patient with the specified ID does not exist',
    });
  }

  const [treatments, totalCount] = await Promise.all([
    prisma.treatment.findMany({
      where: { patientId },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
        _count: {
          select: {
            medicalRecords: true,
          },
        },
      },
    }),
    prisma.treatment.count({ where: { patientId } }),
  ]);

  const totalPages = Math.ceil(totalCount / Number(limit));

  res.json({
    treatments,
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
