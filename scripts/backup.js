#!/usr/bin/env node

/**
 * Zendenta Database Backup Script
 * 
 * This script provides one-click database backup functionality.
 * It can be run independently or through the API endpoints.
 */

const { backupDatabase, getBackupFiles, getDatabaseStats } = require('../backend/database/init');
const path = require('path');
const fs = require('fs-extra');

async function main() {
  try {
    console.log('🔄 Starting Zendenta database backup...\n');
    
    // Get current database stats
    console.log('📊 Current database statistics:');
    const stats = await getDatabaseStats();
    console.log(`   - Total Patients: ${stats.totalPatients}`);
    console.log(`   - Total Appointments: ${stats.totalAppointments}`);
    console.log(`   - Total Treatments: ${stats.totalTreatments}`);
    console.log(`   - Total Users: ${stats.totalUsers}\n`);
    
    // Create backup
    console.log('💾 Creating database backup...');
    const backupPath = await backupDatabase();
    const filename = path.basename(backupPath);
    const fileSize = (await fs.stat(backupPath)).size;
    
    console.log(`✅ Backup created successfully!`);
    console.log(`   - Filename: ${filename}`);
    console.log(`   - Size: ${(fileSize / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`   - Path: ${backupPath}\n`);
    
    // List all backups
    console.log('📋 Available backups:');
    const backups = await getBackupFiles();
    backups.forEach((backup, index) => {
      const sizeMB = (backup.size / (1024 * 1024)).toFixed(2);
      const date = new Date(backup.created).toLocaleString();
      console.log(`   ${index + 1}. ${backup.filename} (${sizeMB} MB) - ${date}`);
    });
    
    console.log('\n🎉 Backup process completed successfully!');
    
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
