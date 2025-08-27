const express = require('express');
const router = express.Router();
const { backupDatabase, getBackupFiles, restoreDatabase } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');
const path = require('path');
const fs = require('fs-extra');

// Apply authentication to all backup routes
router.use(authenticateToken);

// Create backup
router.post('/create', async (req, res) => {
  try {
    const backupPath = await backupDatabase();
    const filename = path.basename(backupPath);
    
    res.json({
      success: true,
      message: 'Database backup created successfully',
      backup: {
        filename,
        path: backupPath,
        size: (await fs.stat(backupPath)).size,
        created: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Backup creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create backup',
      message: error.message
    });
  }
});

// Get all backup files
router.get('/list', async (req, res) => {
  try {
    const backups = await getBackupFiles();
    
    res.json({
      success: true,
      backups: backups.map(backup => ({
        filename: backup.filename,
        size: backup.size,
        created: backup.created,
        modified: backup.modified
      }))
    });
  } catch (error) {
    console.error('Backup list error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve backup list',
      message: error.message
    });
  }
});

// Download backup file
router.get('/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const backupPath = path.join(__dirname, '../../database/backups', filename);
    
    if (!await fs.pathExists(backupPath)) {
      return res.status(404).json({
        success: false,
        error: 'Backup file not found'
      });
    }
    
    res.download(backupPath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({
          success: false,
          error: 'Failed to download backup file'
        });
      }
    });
  } catch (error) {
    console.error('Backup download error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download backup',
      message: error.message
    });
  }
});

// Restore from backup
router.post('/restore/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const backupPath = path.join(__dirname, '../../database/backups', filename);
    
    if (!await fs.pathExists(backupPath)) {
      return res.status(404).json({
        success: false,
        error: 'Backup file not found'
      });
    }
    
    await restoreDatabase(backupPath);
    
    res.json({
      success: true,
      message: 'Database restored successfully from backup',
      backup: filename
    });
  } catch (error) {
    console.error('Backup restore error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to restore from backup',
      message: error.message
    });
  }
});

// Delete backup file
router.delete('/delete/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const backupPath = path.join(__dirname, '../../database/backups', filename);
    
    if (!await fs.pathExists(backupPath)) {
      return res.status(404).json({
        success: false,
        error: 'Backup file not found'
      });
    }
    
    await fs.remove(backupPath);
    
    res.json({
      success: true,
      message: 'Backup file deleted successfully',
      deleted: filename
    });
  } catch (error) {
    console.error('Backup deletion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete backup file',
      message: error.message
    });
  }
});

// Get backup statistics
router.get('/stats', async (req, res) => {
  try {
    const backups = await getBackupFiles();
    const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0);
    
    res.json({
      success: true,
      stats: {
        totalBackups: backups.length,
        totalSize: totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
        oldestBackup: backups.length > 0 ? backups[backups.length - 1].created : null,
        newestBackup: backups.length > 0 ? backups[0].created : null
      }
    });
  } catch (error) {
    console.error('Backup stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve backup statistics',
      message: error.message
    });
  }
});

module.exports = router;
