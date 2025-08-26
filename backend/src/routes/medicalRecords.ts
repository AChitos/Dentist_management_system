import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';
import { requireStaff } from '../middleware/auth';

const router = Router();

// Validation middleware
const validateMedicalRecord = [
  body('patientId').isString().notEmpty().withMessage('Patient ID is required'),
  body('doctorId').isString().notEmpty().withMessage('Doctor ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('diagnosis').optional().isString().withMessage('Diagnosis must be a string'),
  body('symptoms').optional().isString().withMessage('Symptoms must be a string'),
  body('examination').optional().isString().withMessage('Examination must be a string'),
  body('treatment').optional().isString().withMessage('Treatment must be a string'),
  body('prescription').optional().isString().withMessage('Prescription must be a string'),
  body('followUp').optional().isISO8601().withMessage('Valid follow-up date is required'),
];

const validateSearch = [
  query('q').optional().isString().withMessage('Search query must be a string'),
  query('patientId').optional().isString().withMessage('Patient ID must be a string'),
  query('doctorId').optional().isString().withMessage('Doctor ID must be a string'),
  query('dateFrom').optional().isISO8601().withMessage('Valid start date is required'),
  query('dateTo').optional().isISO8601().withMessage('Valid end date is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

// @route   GET /api/medical-records
// @desc    Get all medical records with filtering and pagination
// @access  Private
router.get('/', validateSearch, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { q: searchQuery, patientId, doctorId, dateFrom, dateTo, page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  // Build search conditions
  const where: any = {};
  
  if (searchQuery) {
    where.OR = [
      { diagnosis: { contains: searchQuery as string, mode: 'insensitive' } },
      { symptoms: { contains: searchQuery as string, mode: 'insensitive' } },
      { examination: { contains: searchQuery as string, mode: 'insensitive' } },
      { treatment: { contains: searchQuery as string, mode: 'insensitive' } },
      { notes: { contains: searchQuery as string, mode: 'insensitive' } },
    ];
  }
  
  if (patientId) {
    where.patientId = patientId;
  }
  
  if (doctorId) {
    where.doctorId = doctorId;
  }
  
  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) {
      where.date.gte = new Date(dateFrom as string);
    }
    if (dateTo) {
      where.date.lte = new Date(dateTo as string);
    }
  }

  // Get medical records with count
  const [medicalRecords, totalCount] = await Promise.all([
    prisma.medicalRecord.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { date: 'desc' },
      include: {
        patient: {
          select: {
            id: true,
            patientId: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            gender: true,
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
    prisma.medicalRecord.count({ where }),
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

// @route   GET /api/medical-records/:id
// @desc    Get medical record by ID
// @access  Private
router.get('/:id', requireStaff, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const medicalRecord = await prisma.medicalRecord.findUnique({
    where: { id },
    include: {
      patient: {
        select: {
          id: true,
          patientId: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          gender: true,
          phone: true,
          email: true,
          medicalHistory: true,
          allergies: true,
          medications: true,
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

  if (!medicalRecord) {
    return res.status(404).json({
      error: 'Medical record not found',
      message: 'Medical record with the specified ID does not exist',
    });
  }

  res.json({ medicalRecord });
}));

// @route   POST /api/medical-records
// @desc    Create a new medical record
// @access  Private
router.post('/', validateMedicalRecord, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const medicalRecordData = req.body;

  // Check if patient exists
  const patient = await prisma.patient.findUnique({
    where: { id: medicalRecordData.patientId },
  });

  if (!patient) {
    return res.status(404).json({
      error: 'Patient not found',
      message: 'Patient with the specified ID does not exist',
    });
  }

  // Check if doctor exists
  const doctor = await prisma.user.findUnique({
    where: { id: medicalRecordData.doctorId },
  });

  if (!doctor || !['ADMIN', 'DOCTOR'].includes(doctor.role)) {
    return res.status(404).json({
      error: 'Doctor not found',
      message: 'Doctor with the specified ID does not exist',
    });
  }

  // Check if treatment exists (if provided)
  if (medicalRecordData.treatmentId) {
    const treatment = await prisma.treatment.findUnique({
      where: { id: medicalRecordData.treatmentId },
    });

    if (!treatment) {
      return res.status(404).json({
        error: 'Treatment not found',
        message: 'Treatment with the specified ID does not exist',
      });
    }
  }

  const medicalRecord = await prisma.medicalRecord.create({
    data: medicalRecordData,
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
    message: 'Medical record created successfully',
    medicalRecord,
  });
}));

// @route   PUT /api/medical-records/:id
// @desc    Update medical record
// @access  Private
router.put('/:id', validateMedicalRecord, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { id } = req.params;
  const updateData = req.body;

  // Check if medical record exists
  const existingRecord = await prisma.medicalRecord.findUnique({
    where: { id },
  });

  if (!existingRecord) {
    return res.status(404).json({
      error: 'Medical record not found',
      message: 'Medical record with the specified ID does not exist',
    });
  }

  // Check if treatment exists (if provided)
  if (updateData.treatmentId) {
    const treatment = await prisma.treatment.findUnique({
      where: { id: updateData.treatmentId },
    });

    if (!treatment) {
      return res.status(404).json({
        error: 'Treatment not found',
        message: 'Treatment with the specified ID does not exist',
      });
    }
  }

  const medicalRecord = await prisma.medicalRecord.update({
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
    message: 'Medical record updated successfully',
    medicalRecord,
  });
}));

// @route   DELETE /api/medical-records/:id
// @desc    Delete medical record
// @access  Private
router.delete('/:id', requireStaff, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if medical record exists
  const existingRecord = await prisma.medicalRecord.findUnique({
    where: { id },
  });

  if (!existingRecord) {
    return res.status(404).json({
      error: 'Medical record not found',
      message: 'Medical record with the specified ID does not exist',
    });
  }

  await prisma.medicalRecord.delete({
    where: { id },
  });

  res.json({
    message: 'Medical record deleted successfully',
  });
}));

// @route   GET /api/medical-records/patient/:patientId
// @desc    Get medical records for a specific patient
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

  const [medicalRecords, totalCount] = await Promise.all([
    prisma.medicalRecord.findMany({
      where: { patientId },
      skip,
      take: Number(limit),
      orderBy: { date: 'desc' },
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
    prisma.medicalRecord.count({ where: { patientId } }),
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

// @route   GET /api/medical-records/export/:patientId
// @desc    Export medical records for a patient
// @access  Private
router.get('/export/:patientId', requireStaff, asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const { format = 'json' } = req.query;

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

  const medicalRecords = await prisma.medicalRecord.findMany({
    where: { patientId },
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
  });

  if (format === 'csv') {
    // Generate CSV
    const csvData = [
      ['Date', 'Doctor', 'Diagnosis', 'Symptoms', 'Examination', 'Treatment', 'Prescription', 'Follow-up', 'Notes'],
      ...medicalRecords.map(record => [
        record.date.toISOString().split('T')[0],
        `${record.doctor.firstName} ${record.doctor.lastName}`,
        record.diagnosis || '',
        record.symptoms || '',
        record.examination || '',
        record.treatment || '',
        record.prescription || '',
        record.followUp ? record.followUp.toISOString().split('T')[0] : '',
        record.notes || '',
      ]),
    ];

    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="medical_records_${patient.patientId}.csv"`);
    res.send(csvContent);
  } else {
    // Return JSON
    res.json({
      patient: {
        id: patient.id,
        patientId: patient.patientId,
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
      },
      medicalRecords,
      exportDate: new Date().toISOString(),
      totalRecords: medicalRecords.length,
    });
  }
}));

export default router;
