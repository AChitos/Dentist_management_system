import { Router } from 'express';
import { query, validationResult } from 'express-validator';
import { DatabaseBackup } from '../utils/backup';
import { asyncHandler } from '../middleware/errorHandler';
import { requireAdmin } from '../middleware/auth';

const router = Router();
const backupUtil = new DatabaseBackup();

// Validation middleware
const validateBackupOptions = [
  query('format').optional().isIn(['sql', 'excel']).withMessage('Format must be sql or excel'),
  query('includeData').optional().isBoolean().withMessage('includeData must be boolean'),
  query('includeSchema').optional().isBoolean().withMessage('includeSchema must be boolean'),
];

// @route   POST /api/backup
// @desc    Create database backup
// @access  Private (Admin only)
router.post('/', validateBackupOptions, requireAdmin, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  const { format = 'sql', includeData = true, includeSchema = true } = req.query;

  try {
    const backupPath = await backupUtil.createBackup({
      format: format as 'sql' | 'excel',
      includeData: includeData === 'true',
      includeSchema: includeSchema === 'true',
    });

    res.json({
      message: 'Backup created successfully',
      backupPath,
      format,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Backup failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}));

// @route   GET /api/backup
// @desc    List available backups
// @access  Private (Admin only)
router.get('/', requireAdmin, asyncHandler(async (req, res) => {
  try {
    const backups = backupUtil.listBackups();
    
    res.json({
      backups: backups.map(backup => ({
        name: backup.name,
        size: backup.size,
        sizeMB: (backup.size / 1024 / 1024).toFixed(2),
        date: backup.date,
        type: backup.type,
      })),
      totalBackups: backups.length,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to list backups',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}));

// @route   POST /api/backup/:filename/restore
// @desc    Restore database from backup
// @access  Private (Admin only)
router.post('/:filename/restore', requireAdmin, asyncHandler(async (req, res) => {
  const { filename } = req.params;
  
  try {
    // Construct full backup path
    const backupPath = `${process.env.BACKUP_PATH || './backups'}/${filename}`;
    
    await backupUtil.restoreBackup(backupPath);
    
    res.json({
      message: 'Database restored successfully',
      backupFile: filename,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Restore failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}));

// @route   DELETE /api/backup/:filename
// @desc    Delete a backup file
// @access  Private (Admin only)
router.delete('/:filename', requireAdmin, asyncHandler(async (req, res) => {
  const { filename } = req.params;
  const fs = require('fs');
  const path = require('path');
  
  try {
    const backupPath = path.join(process.env.BACKUP_PATH || './backups', filename);
    
    if (!fs.existsSync(backupPath)) {
      return res.status(404).json({
        error: 'Backup not found',
        message: 'The specified backup file does not exist',
      });
    }
    
    fs.unlinkSync(backupPath);
    
    res.json({
      message: 'Backup deleted successfully',
      deletedFile: filename,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Delete failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}));

// @route   GET /api/backup/export/excel
// @desc    Export database to Excel
// @access  Private (Admin only)
router.get('/export/excel', requireAdmin, asyncHandler(async (req, res) => {
  try {
    const excelPath = await backupUtil.createBackup({ format: 'excel' });
    
    res.json({
      message: 'Excel export completed successfully',
      filePath: excelPath,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Excel export failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}));

// @route   GET /api/backup/export/sql
// @desc    Export database to SQL
// @access  Private (Admin only)
router.get('/export/sql', requireAdmin, asyncHandler(async (req, res) => {
  try {
    const sqlPath = await backupUtil.createBackup({ format: 'sql' });
    
    res.json({
      message: 'SQL export completed successfully',
      filePath: sqlPath,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'SQL export failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}));

// @route   GET /api/backup/status
// @desc    Get backup system status
// @access  Private (Admin only)
router.get('/status', requireAdmin, asyncHandler(async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const backupPath = process.env.BACKUP_PATH || './backups';
    const exists = fs.existsSync(backupPath);
    
    let stats = null;
    if (exists) {
      stats = fs.statSync(backupPath);
    }
    
    const backups = backupUtil.listBackups();
    const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0);
    
    res.json({
      status: 'operational',
      backupDirectory: backupPath,
      directoryExists: exists,
      directoryCreated: exists ? stats?.birthtime : null,
      totalBackups: backups.length,
      totalSizeBytes: totalSize,
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
      retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30'),
      lastBackup: backups.length > 0 ? backups[0].date : null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get backup status',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}));

export default router;
