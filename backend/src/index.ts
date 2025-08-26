import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './routes/auth';
import patientRoutes from './routes/patients';
import appointmentRoutes from './routes/appointments';
import treatmentRoutes from './routes/treatments';
import medicalRecordRoutes from './routes/medicalRecords';
import billingRoutes from './routes/billing';
import inventoryRoutes from './routes/inventory';
import userRoutes from './routes/users';
import dashboardRoutes from './routes/dashboard';
import backupRoutes from './routes/backup';

// Import middleware
import { authenticateToken } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { auditLogger } from './middleware/auditLogger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Prisma
export const prisma = new PrismaClient();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: 500 // begin adding 500ms of delay per request above 50
});

// Apply rate limiting to all routes
app.use(limiter);
app.use(speedLimiter);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', authenticateToken, patientRoutes);
app.use('/api/appointments', authenticateToken, appointmentRoutes);
app.use('/api/treatments', authenticateToken, treatmentRoutes);
app.use('/api/medical-records', authenticateToken, medicalRecordRoutes);
app.use('/api/billing', authenticateToken, billingRoutes);
app.use('/api/inventory', authenticateToken, inventoryRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);
app.use('/api/backup', authenticateToken, backupRoutes);

// Audit logging middleware (apply to protected routes)
app.use('/api', auditLogger);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
