import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';
import { requireStaff } from '../middleware/auth';

const router = Router();

// Validation middleware
const validateBilling = [
  body('patientId').isString().notEmpty().withMessage('Patient ID is required'),
  body('doctorId').isString().notEmpty().withMessage('Doctor ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Valid amount is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
];

const validatePayment = [
  body('amount').isFloat({ min: 0 }).withMessage('Valid payment amount is required'),
  body('paymentMethod').isIn(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'INSURANCE', 'BANK_TRANSFER', 'CHECK']).withMessage('Valid payment method is required'),
  body('paymentDate').isISO8601().withMessage('Valid payment date is required'),
  body('reference').optional().isString().withMessage('Reference must be a string'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
];

const validateSearch = [
  query('q').optional().isString().withMessage('Search query must be a string'),
  query('status').optional().isIn(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED', 'PARTIAL']).withMessage('Valid status is required'),
  query('patientId').optional().isString().withMessage('Patient ID must be a string'),
  query('dateFrom').optional().isISO8601().withMessage('Valid start date is required'),
  query('dateTo').optional().isISO8601().withMessage('Valid end date is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

// @route   GET /api/billing
// @desc    Get all billing records with filtering and pagination
// @access  Private
router.get('/', validateSearch, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { q: searchQuery, status, patientId, dateFrom, dateTo, page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  // Build search conditions
  const where: any = {};
  
  if (searchQuery) {
    where.OR = [
      { description: { contains: searchQuery as string, mode: 'insensitive' } },
      { reference: { contains: searchQuery as string, mode: 'insensitive' } },
    ];
  }
  
  if (status) {
    where.status = status;
  }
  
  if (patientId) {
    where.patientId = patientId;
  }
  
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) {
      where.createdAt.gte = new Date(dateFrom as string);
    }
    if (dateTo) {
      where.createdAt.lte = new Date(dateTo as string);
    }
  }

  // Get billing records with count
  const [billingRecords, totalCount] = await Promise.all([
    prisma.billing.findMany({
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
        treatment: {
          select: {
            id: true,
            name: true,
            category: true,
            status: true,
          },
        },
      },
    }),
    prisma.billing.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / Number(limit));

  res.json({
    billingRecords,
    pagination: {
      currentPage: Number(page),
      totalPages,
      totalCount,
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1,
    },
  });
}));

// @route   GET /api/billing/:id
// @desc    Get billing record by ID
// @access  Private
router.get('/:id', requireStaff, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const billingRecord = await prisma.billing.findUnique({
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
          address: true,
          city: true,
          state: true,
          zipCode: true,
          insuranceProvider: true,
          insuranceNumber: true,
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
      treatment: {
        select: {
          id: true,
          name: true,
          category: true,
          status: true,
          cost: true,
          insuranceCoverage: true,
        },
      },
    },
  });

  if (!billingRecord) {
    return res.status(404).json({
      error: 'Billing record not found',
      message: 'Billing record with the specified ID does not exist',
    });
  }

  res.json({ billingRecord });
}));

// @route   POST /api/billing
// @desc    Create a new billing record
// @access  Private
router.post('/', validateBilling, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const billingData = req.body;

  // Check if patient exists
  const patient = await prisma.patient.findUnique({
    where: { id: billingData.patientId },
  });

  if (!patient) {
    return res.status(404).json({
      error: 'Patient not found',
      message: 'Patient with the specified ID does not exist',
    });
  }

  // Check if doctor exists
  const doctor = await prisma.user.findUnique({
    where: { id: billingData.doctorId },
  });

  if (!doctor || !['ADMIN', 'DOCTOR'].includes(doctor.role)) {
    return res.status(404).json({
      error: 'Doctor not found',
      message: 'Doctor with the specified ID does not exist',
    });
  }

  // Check if treatment exists (if provided)
  if (billingData.treatmentId) {
    const treatment = await prisma.treatment.findUnique({
      where: { id: billingData.treatmentId },
    });

    if (!treatment) {
      return res.status(404).json({
        error: 'Treatment not found',
        message: 'Treatment with the specified ID does not exist',
      });
    }
  }

  // Calculate amounts
  const insuranceAmount = billingData.insuranceAmount || 0;
  const patientAmount = Math.max(0, billingData.amount - insuranceAmount);

  const billingRecord = await prisma.billing.create({
    data: {
      ...billingData,
      insuranceAmount,
      patientAmount,
      status: 'PENDING',
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
      treatment: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
    },
  });

  res.status(201).json({
    message: 'Billing record created successfully',
    billingRecord,
  });
}));

// @route   PUT /api/billing/:id
// @desc    Update billing record
// @access  Private
router.put('/:id', validateBilling, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { id } = req.params;
  const updateData = req.body;

  // Check if billing record exists
  const existingRecord = await prisma.billing.findUnique({
    where: { id },
  });

  if (!existingRecord) {
    return res.status(404).json({
      error: 'Billing record not found',
      message: 'Billing record with the specified ID does not exist',
    });
  }

  // Don't allow updates to paid records
  if (existingRecord.status === 'PAID') {
    return res.status(400).json({
      error: 'Cannot update paid record',
      message: 'Paid billing records cannot be modified',
    });
  }

  // Calculate amounts
  const insuranceAmount = updateData.insuranceAmount || 0;
  const patientAmount = Math.max(0, updateData.amount - insuranceAmount);

  const billingRecord = await prisma.billing.update({
    where: { id },
    data: {
      ...updateData,
      insuranceAmount,
      patientAmount,
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
      treatment: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
    },
  });

  res.json({
    message: 'Billing record updated successfully',
    billingRecord,
  });
}));

// @route   POST /api/billing/:id/payment
// @desc    Record a payment for a billing record
// @access  Private
router.post('/:id/payment', validatePayment, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { id } = req.params;
  const paymentData = req.body;

  // Check if billing record exists
  const billingRecord = await prisma.billing.findUnique({
    where: { id },
  });

  if (!billingRecord) {
    return res.status(404).json({
      error: 'Billing record not found',
      message: 'Billing record with the specified ID does not exist',
    });
  }

  // Don't allow payments on cancelled records
  if (billingRecord.status === 'CANCELLED') {
    return res.status(400).json({
      error: 'Cannot process payment',
      message: 'Payments cannot be processed for cancelled billing records',
    });
  }

  // Check if payment amount is valid
  if (paymentData.amount > billingRecord.patientAmount) {
    return res.status(400).json({
      error: 'Invalid payment amount',
      message: 'Payment amount cannot exceed the patient amount due',
    });
  }

  // Update billing record
  const updatedBilling = await prisma.billing.update({
    where: { id },
    data: {
      paidAmount: (billingRecord.paidAmount || 0) + paymentData.amount,
      paidDate: new Date(paymentData.paymentDate),
      status: paymentData.amount >= billingRecord.patientAmount ? 'PAID' : 'PARTIAL',
      lastPaymentDate: new Date(),
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

  // Create payment record
  const paymentRecord = await prisma.payment.create({
    data: {
      billingId: id,
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      paymentDate: new Date(paymentData.paymentDate),
      reference: paymentData.reference,
      notes: paymentData.notes,
      recordedBy: (req as any).user.id,
    },
  });

  res.json({
    message: 'Payment recorded successfully',
    billingRecord: updatedBilling,
    paymentRecord,
  });
}));

// @route   DELETE /api/billing/:id
// @desc    Delete billing record
// @access  Private
router.delete('/:id', requireStaff, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if billing record exists
  const existingRecord = await prisma.billing.findUnique({
    where: { id },
  });

  if (!existingRecord) {
    return res.status(404).json({
      error: 'Billing record not found',
      message: 'Billing record with the specified ID does not exist',
    });
  }

  // Only allow deletion of pending records
  if (existingRecord.status !== 'PENDING') {
    return res.status(400).json({
      error: 'Cannot delete billing record',
      message: 'Only pending billing records can be deleted',
    });
  }

  // Delete associated payments
  await prisma.payment.deleteMany({
    where: { billingId: id },
  });

  // Delete billing record
  await prisma.billing.delete({
    where: { id },
  });

  res.json({
    message: 'Billing record deleted successfully',
  });
}));

// @route   GET /api/billing/patient/:patientId
// @desc    Get billing records for a specific patient
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

  const [billingRecords, totalCount] = await Promise.all([
    prisma.billing.findMany({
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
        treatment: {
          select: {
            id: true,
            name: true,
            category: true,
            status: true,
          },
        },
      },
    }),
    prisma.billing.count({ where: { patientId } }),
  ]);

  const totalPages = Math.ceil(totalCount / Number(limit));

  res.json({
    billingRecords,
    pagination: {
      currentPage: Number(page),
      totalPages,
      totalCount,
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1,
    },
  });
}));

// @route   GET /api/billing/overdue
// @desc    Get overdue billing records
// @access  Private
router.get('/overdue', requireStaff, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const now = new Date();

  const [overdueRecords, totalCount] = await Promise.all([
    prisma.billing.findMany({
      where: {
        dueDate: { lt: now },
        status: { in: ['PENDING', 'PARTIAL'] },
      },
      skip,
      take: Number(limit),
      orderBy: { dueDate: 'asc' },
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
          },
        },
      },
    }),
    prisma.billing.count({
      where: {
        dueDate: { lt: now },
        status: { in: ['PENDING', 'PARTIAL'] },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / Number(limit));

  res.json({
    overdueRecords,
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
