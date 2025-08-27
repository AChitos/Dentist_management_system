#!/usr/bin/env node

/**
 * Zendenta Excel Export Script
 * 
 * This script provides Excel export functionality for all database data.
 * It can be run independently or through the API endpoints.
 */

const ExcelJS = require('exceljs');
const { getDatabase } = require('../backend/database/init');
const path = require('path');
const fs = require('fs-extra');

async function createExcelExport() {
  try {
    console.log('🔄 Starting Zendenta Excel export...\n');
    
    const db = getDatabase();
    const workbook = new ExcelJS.Workbook();
    
    // Set workbook properties
    workbook.creator = 'Zendenta System';
    workbook.lastModifiedBy = 'Zendenta System';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    console.log('📊 Creating worksheets...');
    
    // Create worksheets for each table
    await createPatientsWorksheet(workbook, db);
    await createAppointmentsWorksheet(workbook, db);
    await createTreatmentsWorksheet(workbook, db);
    await createFinancialWorksheet(workbook, db);
    await createUsersWorksheet(workbook, db);
    await createTreatmentTypesWorksheet(workbook, db);
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `zendenta-export-${timestamp}.xlsx`;
    const exportPath = path.join(__dirname, '../exports', filename);
    
    // Ensure exports directory exists
    await fs.ensureDir(path.dirname(exportPath));
    
    console.log('💾 Writing Excel file...');
    
    // Write Excel file
    await workbook.xlsx.writeFile(exportPath);
    
    const fileSize = (await fs.stat(exportPath)).size;
    
    console.log(`✅ Excel export completed successfully!`);
    console.log(`   - Filename: ${filename}`);
    console.log(`   - Size: ${(fileSize / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`   - Path: ${exportPath}\n`);
    
    console.log('📋 Export summary:');
    console.log(`   - Patients: ${workbook.getWorksheet('Patients').rowCount - 1} records`);
    console.log(`   - Appointments: ${workbook.getWorksheet('Appointments').rowCount - 1} records`);
    console.log(`   - Treatments: ${workbook.getWorksheet('Treatments').rowCount - 1} records`);
    console.log(`   - Financial Records: ${workbook.getWorksheet('Financial Records').rowCount - 1} records`);
    console.log(`   - Users: ${workbook.getWorksheet('Users').rowCount - 1} records`);
    console.log(`   - Treatment Types: ${workbook.getWorksheet('Treatment Types').rowCount - 1} records`);
    
    console.log('\n🎉 Excel export process completed successfully!');
    
  } catch (error) {
    console.error('❌ Excel export failed:', error.message);
    process.exit(1);
  }
}

// Helper functions to create worksheets
async function createPatientsWorksheet(workbook, db) {
  const worksheet = workbook.addWorksheet('Patients');
  
  worksheet.columns = [
    { header: 'Patient ID', key: 'patient_id', width: 15 },
    { header: 'First Name', key: 'first_name', width: 15 },
    { header: 'Last Name', key: 'last_name', width: 15 },
    { header: 'Date of Birth', key: 'date_of_birth', width: 15 },
    { header: 'Gender', key: 'gender', width: 10 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'Address', key: 'address', width: 40 },
    { header: 'Created At', key: 'created_at', width: 20 }
  ];
  
  const patients = await getPatientsData(db);
  patients.forEach(patient => {
    worksheet.addRow(patient);
  });
  
  // Style header
  styleWorksheetHeader(worksheet);
  
  return worksheet;
}

async function createAppointmentsWorksheet(workbook, db) {
  const worksheet = workbook.addWorksheet('Appointments');
  
  worksheet.columns = [
    { header: 'Appointment ID', key: 'appointment_id', width: 20 },
    { header: 'Patient Name', key: 'patient_name', width: 25 },
    { header: 'Doctor Name', key: 'doctor_name', width: 25 },
    { header: 'Date', key: 'appointment_date', width: 15 },
    { header: 'Start Time', key: 'start_time', width: 15 },
    { header: 'End Time', key: 'end_time', width: 15 },
    { header: 'Type', key: 'type', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Created At', key: 'created_at', width: 20 }
  ];
  
  const appointments = await getAppointmentsData(db);
  appointments.forEach(appointment => {
    worksheet.addRow(appointment);
  });
  
  styleWorksheetHeader(worksheet);
  return worksheet;
}

async function createTreatmentsWorksheet(workbook, db) {
  const worksheet = workbook.addWorksheet('Treatments');
  
  worksheet.columns = [
    { header: 'Treatment ID', key: 'treatment_id', width: 20 },
    { header: 'Patient Name', key: 'patient_name', width: 25 },
    { header: 'Doctor Name', key: 'doctor_name', width: 25 },
    { header: 'Treatment Type', key: 'treatment_type', width: 20 },
    { header: 'Cost', key: 'cost', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Created At', key: 'created_at', width: 20 }
  ];
  
  const treatments = await getTreatmentsData(db);
  treatments.forEach(treatment => {
    worksheet.addRow(treatment);
  });
  
  styleWorksheetHeader(worksheet);
  return worksheet;
}

async function createFinancialWorksheet(workbook, db) {
  const worksheet = workbook.addWorksheet('Financial Records');
  
  worksheet.columns = [
    { header: 'Record ID', key: 'record_id', width: 20 },
    { header: 'Patient Name', key: 'patient_name', width: 25 },
    { header: 'Type', key: 'type', width: 15 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Description', key: 'description', width: 30 },
    { header: 'Transaction Date', key: 'transaction_date', width: 20 },
    { header: 'Created At', key: 'created_at', width: 20 }
  ];
  
  const financial = await getFinancialData(db);
  financial.forEach(record => {
    worksheet.addRow(record);
  });
  
  styleWorksheetHeader(worksheet);
  return worksheet;
}

async function createUsersWorksheet(workbook, db) {
  const worksheet = workbook.addWorksheet('Users');
  
  worksheet.columns = [
    { header: 'Username', key: 'username', width: 20 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Full Name', key: 'full_name', width: 25 },
    { header: 'Role', key: 'role', width: 15 },
    { header: 'Specialization', key: 'specialization', width: 25 },
    { header: 'Created At', key: 'created_at', width: 20 }
  ];
  
  const users = await getUsersData(db);
  users.forEach(user => {
    worksheet.addRow(user);
  });
  
  styleWorksheetHeader(worksheet);
  return worksheet;
}

async function createTreatmentTypesWorksheet(workbook, db) {
  const worksheet = workbook.addWorksheet('Treatment Types');
  
  worksheet.columns = [
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Base Cost', key: 'base_cost', width: 15 },
    { header: 'Duration (min)', key: 'duration', width: 20 }
  ];
  
  const treatmentTypes = await getTreatmentTypesData(db);
  treatmentTypes.forEach(type => {
    worksheet.addRow(type);
  });
  
  styleWorksheetHeader(worksheet);
  return worksheet;
}

function styleWorksheetHeader(worksheet) {
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0EA5E9' }
  };
  headerRow.alignment = { horizontal: 'center' };
}

// Data retrieval functions
async function getPatientsData(db) {
  return new Promise((resolve, reject) => {
    db.all('SELECT patient_id, first_name, last_name, date_of_birth, gender, phone, email, address, created_at FROM patients ORDER BY created_at DESC', (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

async function getAppointmentsData(db) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        a.appointment_id,
        p.first_name || ' ' || p.last_name as patient_name,
        u.full_name as doctor_name,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.type,
        a.status,
        a.created_at
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON a.doctor_id = u.id
      ORDER BY a.appointment_date DESC
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

async function getTreatmentsData(db) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        t.treatment_id,
        p.first_name || ' ' || p.last_name as patient_name,
        u.full_name as doctor_name,
        t.treatment_type,
        t.cost,
        t.status,
        t.created_at
      FROM treatments t
      JOIN patients p ON t.patient_id = p.id
      JOIN users u ON t.doctor_id = u.id
      ORDER BY t.created_at DESC
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

async function getFinancialData(db) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        f.record_id,
        p.first_name || ' ' || p.last_name as patient_name,
        f.type,
        f.amount,
        f.description,
        f.transaction_date,
        f.created_at
      FROM financial_records f
      LEFT JOIN patients p ON f.patient_id = p.id
      ORDER BY f.transaction_date DESC
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

async function getUsersData(db) {
  return new Promise((resolve, reject) => {
    db.all('SELECT username, email, full_name, role, specialization, created_at FROM users ORDER BY created_at DESC', (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

async function getTreatmentTypesData(db) {
  return new Promise((resolve, reject) => {
    db.all('SELECT name, description, base_cost, duration FROM treatment_types ORDER BY name', (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

// Run if called directly
if (require.main === module) {
  createExcelExport();
}

module.exports = { createExcelExport };
