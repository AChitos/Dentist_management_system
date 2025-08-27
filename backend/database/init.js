const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs-extra');
const crypto = require('crypto');

// Database configuration
const DB_PATH = path.join(__dirname, '../../database/zendenta.db');
const BACKUP_DIR = path.join(__dirname, '../../database/backups');

// Ensure database and backup directories exist
fs.ensureDirSync(path.dirname(DB_PATH));
fs.ensureDirSync(BACKUP_DIR);

// Encryption key (in production, this should be stored securely)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'zendenta-secure-key-2024';

// Database instance
let db = null;

// Initialize database connection
async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    try {
      // Create database connection
      db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
          reject(err);
          return;
        }
        
        console.log('✅ Connected to SQLite database');
        
        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON', (err) => {
          if (err) {
            console.warn('Warning: Could not enable foreign keys:', err.message);
          }
        });
        
        // Enable WAL mode for better performance
        db.run('PRAGMA journal_mode = WAL', (err) => {
          if (err) {
            console.warn('Warning: Could not enable WAL mode:', err.message);
          }
        });
        
        resolve(db);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Get database instance
function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

// Close database connection
function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
          reject(err);
          return;
        }
        console.log('✅ Database connection closed');
        db = null;
        resolve();
      });
    } else {
      resolve();
    }
  });
}

// Encryption utilities
function encryptData(data) {
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptData(encryptedData) {
  try {
    const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
}

// Backup database
async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `zendenta-backup-${timestamp}.db`);
  
  try {
    await fs.copy(DB_PATH, backupPath);
    console.log(`✅ Database backed up to: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error('Error backing up database:', error);
    throw error;
  }
}

// Restore database from backup
async function restoreDatabase(backupPath) {
  try {
    if (!fs.existsSync(backupPath)) {
      throw new Error('Backup file not found');
    }
    
    // Close current connection
    await closeDatabase();
    
    // Restore from backup
    await fs.copy(backupPath, DB_PATH);
    
    // Reinitialize connection
    await initializeDatabase();
    
    console.log(`✅ Database restored from: ${backupPath}`);
    return true;
  } catch (error) {
    console.error('Error restoring database:', error);
    throw error;
  }
}

// Get backup files list
async function getBackupFiles() {
  try {
    const files = await fs.readdir(BACKUP_DIR);
    const backups = [];
    
    for (const file of files) {
      if (file.endsWith('.db')) {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = await fs.stat(filePath);
        backups.push({
          filename: file,
          path: filePath,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        });
      }
    }
    
    return backups.sort((a, b) => b.modified - a.modified);
  } catch (error) {
    console.error('Error getting backup files:', error);
    return [];
  }
}

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase,
  encryptData,
  decryptData,
  backupDatabase,
  restoreDatabase,
  getBackupFiles,
  DB_PATH,
  BACKUP_DIR
};
