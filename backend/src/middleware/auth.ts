import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        firstName: string;
        lastName: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        error: 'Access token required',
        message: 'Please provide a valid authentication token',
      });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        error: 'Invalid token',
        message: 'User account is inactive or does not exist',
      });
      return;
    }

    // Add user info to request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: 'Invalid token',
        message: 'The provided token is invalid or expired',
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: 'Token expired',
        message: 'Your session has expired. Please log in again',
      });
    } else {
      res.status(500).json({
        error: 'Authentication error',
        message: 'An error occurred during authentication',
      });
    }
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'Please log in to access this resource',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Insufficient permissions',
        message: 'You do not have permission to access this resource',
      });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(['ADMIN']);
export const requireDoctor = requireRole(['ADMIN', 'DOCTOR']);
export const requireStaff = requireRole(['ADMIN', 'DOCTOR', 'STAFF']);
