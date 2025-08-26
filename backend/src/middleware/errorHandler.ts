import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';
  let details: any = null;

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        statusCode = 409;
        message = 'A record with this unique field already exists';
        details = { field: error.meta?.target };
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Invalid foreign key reference';
        break;
      case 'P2014':
        statusCode = 400;
        message = 'The change you are trying to make would violate the required relation';
        break;
      default:
        statusCode = 400;
        message = 'Database operation failed';
        details = { code: error.code };
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided';
    details = { validation: error.message };
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = 'Database operation failed';
    details = { error: error.message };
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    details = { validation: error.message };
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Handle file upload errors
  if (error.name === 'MulterError') {
    statusCode = 400;
    message = 'File upload error';
    details = { field: (error as any).field, code: (error as any).code };
  }

  // Log error for debugging (in production, use proper logging service)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
      user: req.user?.id,
      timestamp: new Date().toISOString(),
    });
  }

  // Send error response
  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.url,
      method: req.method,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  });
};

// Custom error class for operational errors
export class OperationalError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error wrapper for route handlers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
