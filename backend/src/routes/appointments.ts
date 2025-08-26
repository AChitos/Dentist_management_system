import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';
import { requireStaff } from '../middleware/auth';

const router = Router();

// Validation middleware
const validateAppointment = [
  body('patientId').isString().notEmpty().withMessage('Patient ID is required'),
  body('doctorId').isString().notEmpty().withMessage('Doctor ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time is required (HH:MM)'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid end time is required (HH:MM)'),
  body('duration').isInt({ min: 15, max: 480 }).withMessage('Duration must be between 15 and 480 minutes'),
  body('type').isIn(['CONSULTATION', 'CLEANING', 'FILLING', 'EXTRACTION', 'ROOT_CANAL', 'CROWN', 'BRIDGE', 'IMPLANT', 'ORTHODONTICS', 'EMERGENCY', 'FOLLOW_UP', 'OTHER']).withMessage('Valid appointment type is required'),
];

const validateSearch = [
  query('date').optional().isISO8601().withMessage('Valid date is required'),
  query('doctorId').optional().isString().withMessage('Doctor ID must be a string'),
  query('status').optional().isIn(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).withMessage('Valid status is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

// @route   GET /api/appointments
// @desc    Get all appointments with filtering and pagination
// @access  Private
router.get('/', validateSearch, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { date, doctorId, status, page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  // Build filter conditions
  const where: any = {};
  
  if (date) {
    const searchDate = new Date(date as string);
    where.date = {
      gte: new Date(searchDate.setHours(0, 0, 0, 0)),
      lt: new Date(searchDate.setHours(23, 59, 59, 999)),
    };
  }
  
  if (doctorId) {
    where.doctorId = doctorId;
  }
  
  if (status) {
    where.status = status;
  }

  // Get appointments with count
  const [appointments, totalCount] = await Promise.all([
    prisma.appointment.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { date: 'asc' },
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
      },
    }),
    prisma.appointment.count({ where }),
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

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', requireStaff, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const appointment = await prisma.appointment.findUnique({
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
    },
  });

  if (!appointment) {
    return res.status(404).json({
      error: 'Appointment not found',
      message: 'Appointment with the specified ID does not exist',
    });
  }

  res.json({ appointment });
}));

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private
router.post('/', validateAppointment, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const appointmentData = req.body;

  // Check for scheduling conflicts
  const conflictingAppointment = await prisma.appointment.findFirst({
    where: {
      doctorId: appointmentData.doctorId,
      date: new Date(appointmentData.date),
      status: {
        in: ['SCHEDULED', 'CONFIRMED'],
      },
      OR: [
        {
          startTime: {
            lt: appointmentData.endTime,
          },
          endTime: {
            gt: appointmentData.startTime,
          },
        },
      ],
    },
  });

  if (conflictingAppointment) {
    return res.status(409).json({
      error: 'Scheduling conflict',
      message: 'The selected time slot conflicts with an existing appointment',
    });
  }

  // Check if patient exists
  const patient = await prisma.patient.findUnique({
    where: { id: appointmentData.patientId },
  });

  if (!patient) {
    return res.status(404).json({
      error: 'Patient not found',
      message: 'Patient with the specified ID does not exist',
    });
  }

  // Check if doctor exists
  const doctor = await prisma.user.findUnique({
    where: { id: appointmentData.doctorId },
  });

  if (!doctor || !['ADMIN', 'DOCTOR'].includes(doctor.role)) {
    return res.status(404).json({
      error: 'Doctor not found',
      message: 'Doctor with the specified ID does not exist',
    });
  }

  const appointment = await prisma.appointment.create({
    data: appointmentData,
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

  res.status(201).json({
    message: 'Appointment created successfully',
    appointment,
  });
}));

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put('/:id', validateAppointment, requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { id } = req.params;
  const updateData = req.body;

  // Check if appointment exists
  const existingAppointment = await prisma.appointment.findUnique({
    where: { id },
  });

  if (!existingAppointment) {
    return res.status(404).json({
      error: 'Appointment not found',
      message: 'Appointment with the specified ID does not exist',
    });
  }

  // Check for scheduling conflicts (excluding current appointment)
  const conflictingAppointment = await prisma.appointment.findFirst({
    where: {
      id: { not: id },
      doctorId: updateData.doctorId,
      date: new Date(updateData.date),
      status: {
        in: ['SCHEDULED', 'CONFIRMED'],
      },
      OR: [
        {
          startTime: {
            lt: updateData.endTime,
          },
          endTime: {
            gt: updateData.startTime,
          },
        },
      ],
    },
  });

  if (conflictingAppointment) {
    return res.status(409).json({
      error: 'Scheduling conflict',
      message: 'The selected time slot conflicts with an existing appointment',
    });
  }

  const appointment = await prisma.appointment.update({
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
    message: 'Appointment updated successfully',
    appointment,
  });
}));

// @route   PATCH /api/appointments/:id/status
// @desc    Update appointment status
// @access  Private
router.patch('/:id/status', [
  body('status').isIn(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).withMessage('Valid status is required'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
], requireStaff, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { id } = req.params;
  const { status, notes } = req.body;

  // Check if appointment exists
  const existingAppointment = await prisma.appointment.findUnique({
    where: { id },
  });

  if (!existingAppointment) {
    return res.status(404).json({
      error: 'Appointment not found',
      message: 'Appointment with the specified ID does not exist',
    });
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: { 
      status,
      ...(notes && { notes }),
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

  res.json({
    message: 'Appointment status updated successfully',
    appointment,
  });
}));

// @route   DELETE /api/appointments/:id
// @desc    Delete appointment
// @access  Private
router.delete('/:id', requireStaff, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if appointment exists
  const existingAppointment = await prisma.appointment.findUnique({
    where: { id },
  });

  if (!existingAppointment) {
    return res.status(404).json({
      error: 'Appointment not found',
      message: 'Appointment with the specified ID does not exist',
    });
  }

  // Only allow deletion of future appointments
  if (existingAppointment.date < new Date()) {
    return res.status(400).json({
      error: 'Cannot delete past appointment',
      message: 'Only future appointments can be deleted',
    });
  }

  await prisma.appointment.delete({
    where: { id },
  });

  res.json({
    message: 'Appointment deleted successfully',
  });
}));

// @route   GET /api/appointments/calendar/:date
// @desc    Get appointments for a specific date
// @access  Private
router.get('/calendar/:date', requireStaff, asyncHandler(async (req, res) => {
  const { date } = req.params;
  const { doctorId } = req.query;

  if (!Date.parse(date)) {
    return res.status(400).json({
      error: 'Invalid date',
      message: 'Please provide a valid date',
    });
  }

  const searchDate = new Date(date);
  const where: any = {
    date: {
      gte: new Date(searchDate.setHours(0, 0, 0, 0)),
      lt: new Date(searchDate.setHours(23, 59, 59, 999)),
    },
  };

  if (doctorId) {
    where.doctorId = doctorId;
  }

  const appointments = await prisma.appointment.findMany({
    where,
    orderBy: { startTime: 'asc' },
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

  res.json({ appointments });
}));

export default router;
