const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const { getDatabase } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');
const path = require('path');
const fs = require('fs-extra');

// Apply authentication to all export routes
router.use(authenticateToken);

// Export all data to Excel
router.post('/excel/all', async (req, res) => {
  try {
    const db = getDatabase();
    const workbook = new ExcelJS.Workbook();
    
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
    const exportPath = path.join(__dirname, '../../exports', filename);
    
    // Ensure exports directory exists
    await fs.ensureDir(path.dirname(exportPath));
    
    // Write Excel file
    await workbook.xlsx.writeFile(exportPath);
    
    // Send file to client
    res.download(exportPath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({
          success: false,
          error: 'Failed to download export file'
        });
      }
      
      // Clean up file after download
      setTimeout(() => {
        fs.remove(exportPath).catch(console.error);
      }, 5000);
    });
    
  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create Excel export',
      message: error.message
    });
  }
});

// Export specific table to Excel
router.post('/excel/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const db = getDatabase();
    const workbook = new ExcelJS.Workbook();
    
    let worksheet;
    switch (table) {
      case 'patients':
        worksheet = await createPatientsWorksheet(workbook, db);
        break;
      case 'appointments':
        worksheet = await createAppointmentsWorksheet(workbook, db);
        break;
      case 'treatments':
        worksheet = await createTreatmentsWorksheet(workbook, db);
        break;
      case 'financial':
        worksheet = await createFinancialWorksheet(workbook, db);
        break;
      case 'users':
        worksheet = await createUsersWorksheet(workbook, db);
        break;
      case 'treatment-types':
        worksheet = await createTreatmentTypesWorksheet(workbook, db);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid table name'
        });
    }
    
    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `zendenta-${table}-export-${timestamp}.xlsx`;
    const exportPath = path.join(__dirname, '../../exports', filename);
    
    // Ensure exports directory exists
    await fs.ensureDir(path.dirname(exportPath));
    
    // Write Excel file
    await workbook.xlsx.writeFile(exportPath);
    
    // Send file to client
    res.download(exportPath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({
          success: false,
          error: 'Failed to download export file'
        });
      }
      
      // Clean up file after download
      setTimeout(() => {
        fs.remove(exportPath).catch(console.error);
      }, 5000);
    });
    
  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create Excel export',
      message: error.message
    });
  }
});

// Helper functions to create worksheets
async function createPatientsWorksheet(workbook, db) {
  const worksheet = workbook.addWorksheet('Patients');
  
  // Define columns
  worksheet.columns = [
    { header: 'Patient ID', key: 'patient_id', width: 15 },
    { header: 'First Name', key: 'first_name', width: 15 },
    { header: 'Last Name', key: 'last_name', width: 15 },
    { header: 'Date of Birth', key: 'date_of_birth', width: 15 },
    { header: 'Gender', key: 'gender', width: 10 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'Address', key: 'address', width: 40 },
    { header: 'Emergency Contact', key: 'emergency_contact', width: 20 },
    { header: 'Emergency Phone', key: 'emergency_phone', width: 15 },
    { header: 'Medical History', key: 'medical_history', width: 30 },
    { header: 'Allergies', key: 'allergies', width: 20 },
    { header: 'Insurance Info', key: 'insurance_info', width: 25 },
    { header: 'Notes', key: 'notes', width: 30 },
    { header: 'Created At', key: 'created_at', width: 20 }
  ];
  
  // Add data
  const patients = await getPatientsData(db);
  patients.forEach(patient => {
    worksheet.addRow(patient);
  });
  
  // Style header
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6F3FF' }
  };
  
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
    { header: 'Duration (min)', key: 'duration', width: 15 },
    { header: 'Type', key: 'type', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Notes', key: 'notes', width: 30 },
    { header: 'Created At', key: 'created_at', width: 20 }
  ];
  
  const appointments = await getAppointmentsData(db);
  appointments.forEach(appointment => {
    worksheet.addRow(appointment);
  });
  
  // Style header
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6F3FF' }
  };
  
  return worksheet;
}

async function createTreatmentsWorksheet(workbook, db) {
  const worksheet = workbook.addWorksheet('Treatments');
  
  worksheet.columns = [
    { header: 'Treatment ID', key: 'treatment_id', width: 20 },
    { header: 'Patient Name', key: 'patient_name', width: 25 },
    { header: 'Doctor Name', key: 'doctor_name', width: 25 },
    { header: 'Treatment Type', key: 'treatment_type', width: 20 },
    { header: 'Description', key: 'description', width: 30 },
    { header: 'Cost', key: 'cost', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Start Date', key: 'start_date', width: 15 },
    { header: 'End Date', key: 'end_date', width: 15 },
    { header: 'Notes', key: 'notes', width: 30 },
    { header: 'Created At', key: 'created_at', width: 20 }
  ];
  
  const treatments = await getTreatmentsData(db);
  treatments.forEach(treatment => {
    worksheet.addRow(treatment);
  });
  
  // Style header
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6F3FF' }
  };
  
  return worksheet;
}

async function createFinancialWorksheet(workbook, db) {
  const worksheet = workbook.addWorksheet('Financial Records');
  
  worksheet.columns = [
    { header: 'Record ID', key: 'record_id', width: 20 },
    { header: 'Patient Name', key: 'patient_name', width: 25 },
    { header: 'Type', key: 'type', width: 15 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Description', key: 'description', width: 30 },
    { header: 'Payment Method', key: 'payment_method', width: 20 },
    { header: 'Payment Status', key: 'payment_status', width: 20 },
    { header: 'Transaction Date', key: 'transaction_date', width: 20 },
    { header: 'Due Date', key: 'due_date', width: 20 },
    { header: 'Notes', key: 'notes', width: 30 },
    { header: 'Created At', key: 'created_at', width: 20 }
  ];
  
  const financial = await getFinancialData(db);
  financial.forEach(record => {
    worksheet.addRow(record);
  });
  
  // Style header
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6F3FF' }
  };
  
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
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'Is Active', key: 'is_active', width: 15 },
    { header: 'Last Login', key: 'last_login', width: 20 },
    { header: 'Created At', key: 'created_at', width: 20 }
  ];
  
  const users = await getUsersData(db);
  users.forEach(user => {
    worksheet.addRow(user);
  });
  
  // Style header
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6F3FF' }
  };
  
  return worksheet;
}

async function createTreatmentTypesWorksheet(workbook, db) {
  const worksheet = workbook.addWorksheet('Treatment Types');
  
  worksheet.columns = [
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Base Cost', key: 'base_cost', width: 15 },
    { header: 'Duration (min)', key: 'duration', width: 20 },
    { header: 'Is Active', key: 'is_active', width: 15 },
    { header: 'Created At', key: 'created_at', width: 20 }
  ];
  
  const treatmentTypes = await getTreatmentTypesData(db);
  treatmentTypes.forEach(type => {
    worksheet.addRow(type);
  });
  
  // Style header
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6F3FF' }
  };
  
  return worksheet;
}

// Data retrieval functions
async function getPatientsData(db) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM patients ORDER BY created_at DESC', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function getAppointmentsData(db) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        a.*,
        p.first_name || ' ' || p.last_name as patient_name,
        u.full_name as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON a.doctor_id = u.id
      ORDER BY a.appointment_date DESC, a.start_time DESC
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function getTreatmentsData(db) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        t.*,
        p.first_name || ' ' || p.last_name as patient_name,
        u.full_name as doctor_name
      FROM treatments t
      JOIN patients p ON t.patient_id = p.id
      JOIN users u ON t.doctor_id = u.id
      ORDER BY t.created_at DESC
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function getFinancialData(db) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        f.*,
        p.first_name || ' ' || p.last_name as patient_name
      FROM financial_records f
      LEFT JOIN patients p ON f.patient_id = p.id
      ORDER BY f.transaction_date DESC
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function getUsersData(db) {
  return new Promise((resolve, reject) => {
    db.all('SELECT username, email, full_name, role, specialization, phone, is_active, last_login, created_at FROM users ORDER BY created_at DESC', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function getTreatmentTypesData(db) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM treatment_types ORDER BY name', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = router;
