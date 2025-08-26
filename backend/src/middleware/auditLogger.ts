import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';

export const auditLogger = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Skip logging for health checks and non-API routes
  if (req.path === '/health' || !req.path.startsWith('/api')) {
    return next();
  }

  const startTime = Date.now();
  const originalSend = res.send;

  // Override res.send to capture response data
  res.send = function (body: any) {
    const duration = Date.now() - startTime;
    
    // Log the API call asynchronously (don't block the response)
    logApiCall(req, res, duration, body).catch(console.error);
    
    // Call the original send method
    return originalSend.call(this, body);
  };

  next();
};

const logApiCall = async (
  req: Request,
  res: Response,
  duration: number,
  responseBody: any
): Promise<void> => {
  try {
    // Only log if user is authenticated
    if (!req.user?.id) {
      return;
    }

    // Determine the action based on HTTP method
    const action = getActionFromMethod(req.method);
    
    // Determine table name from URL path
    const tableName = getTableNameFromPath(req.path);
    
    // Extract record ID if available
    const recordId = req.params.id || req.body.id || null;
    
    // Prepare old and new values for logging
    let oldValues = null;
    let newValues = null;
    
    if (req.method === 'PUT' || req.method === 'PATCH') {
      // For updates, we could fetch old values here if needed
      newValues = req.body;
    } else if (req.method === 'POST') {
      newValues = req.body;
    } else if (req.method === 'DELETE') {
      oldValues = { deleted: true };
    }

    // Create audit log entry
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action,
        tableName,
        recordId,
        oldValues: oldValues ? JSON.stringify(oldValues) : null,
        newValues: newValues ? JSON.stringify(newValues) : null,
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        timestamp: new Date(),
      },
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Audit Log: ${action} on ${tableName} by ${req.user.email} (${duration}ms)`);
    }
  } catch (error) {
    // Don't let audit logging errors affect the main application
    console.error('Audit logging failed:', error);
  }
};

const getActionFromMethod = (method: string): string => {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'READ';
    case 'POST':
      return 'CREATE';
    case 'PUT':
    case 'PATCH':
      return 'UPDATE';
    case 'DELETE':
      return 'DELETE';
    default:
      return 'UNKNOWN';
  }
};

const getTableNameFromPath = (path: string): string => {
  // Extract table name from API path
  const pathParts = path.split('/');
  if (pathParts.length >= 3) {
    // Convert kebab-case to snake_case for table names
    return pathParts[2].replace(/-/g, '_');
  }
  return 'unknown';
};

// Helper function to log specific events
export const logEvent = async (
  userId: string,
  action: string,
  tableName: string,
  recordId?: string,
  details?: any
): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        tableName,
        recordId,
        newValues: details ? JSON.stringify(details) : null,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('Event logging failed:', error);
  }
};
