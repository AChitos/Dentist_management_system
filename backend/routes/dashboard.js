const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication to all dashboard routes
router.use(authenticateToken);

// Get dashboard overview data
router.get('/overview', async (req, res) => {
  try {
    const db = getDatabase();
    
    // Get current date info
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    // Get appointment statistics for the year
    const appointmentStats = await getAppointmentStats(db, currentYear);
    
    // Get today's appointments
    const todayAppointments = await getTodayAppointments(db);
    
    // Get approval requests
    const approvalRequests = await getApprovalRequests(db);
    
    // Get upcoming appointments
    const upcomingAppointments = await getUpcomingAppointments(db);
    
    // Get clinic information
    const clinicInfo = await getClinicInfo(db);
    
    // Get top treatments
    const topTreatments = await getTopTreatments(db);
    
    // Get patient statistics
    const patientStats = await getPatientStats(db, currentMonth, currentYear);
    
    // Get revenue statistics
    const revenueStats = await getRevenueStats(db, currentMonth, currentYear);
    
    res.json({
      success: true,
      data: {
        appointmentStats,
        todayAppointments,
        approvalRequests,
        upcomingAppointments,
        clinicInfo,
        topTreatments,
        patientStats,
        revenueStats
      }
    });
    
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data',
      message: error.message
    });
  }
});

// Get appointment statistics by month
async function getAppointmentStats(db, year) {
  return new Promise((resolve, reject) => {
    const stats = [];
    
    // Get appointments for each month
    for (let month = 1; month <= 12; month++) {
      const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'short' });
      
      db.get(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
        FROM appointments 
        WHERE strftime('%Y', appointment_date) = ? AND strftime('%m', appointment_date) = ?
      `, [year.toString(), month.toString().padStart(2, '0')], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        stats.push({
          month: monthName,
          appointments: row.total || 0,
          canceled: row.cancelled || 0
        });
        
        if (stats.length === 12) {
          resolve(stats);
        }
      });
    }
  });
}

// Get today's appointments
async function getTodayAppointments(db) {
  return new Promise((resolve, reject) => {
    const today = new Date().toISOString().split('T')[0];
    
    db.all(`
      SELECT 
        a.*,
        p.first_name || ' ' || p.last_name as patient_name,
        u.full_name as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON a.doctor_id = u.id
      WHERE a.appointment_date = ?
      ORDER BY a.start_time ASC
    `, [today], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

// Get approval requests (appointments pending confirmation)
async function getApprovalRequests(db) {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT COUNT(*) as count
      FROM appointments 
      WHERE status = 'scheduled'
    `, (err, row) => {
      if (err) reject(err);
      else resolve(row ? row.count : 0);
    });
  });
}

// Get upcoming appointments
async function getUpcomingAppointments(db) {
  return new Promise((resolve, reject) => {
    const today = new Date().toISOString().split('T')[0];
    
    db.get(`
      SELECT COUNT(*) as count
      FROM appointments 
      WHERE appointment_date > ? AND status IN ('scheduled', 'confirmed')
    `, [today], (err, row) => {
      if (err) reject(err);
      else resolve(row ? row.count : 0);
    });
  });
}

// Get clinic information
async function getClinicInfo(db) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT setting_key, setting_value 
      FROM clinic_settings 
      WHERE setting_key IN ('clinic_name', 'clinic_address', 'clinic_phone_1', 'clinic_phone_2')
    `, (err, rows) => {
      if (err) reject(err);
      else {
        const clinicInfo = {};
        rows.forEach(row => {
          clinicInfo[row.setting_key] = row.setting_value;
        });
        resolve(clinicInfo);
      }
    });
  });
}

// Get top treatments
async function getTopTreatments(db) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        treatment_type,
        COUNT(*) as count
      FROM treatments 
      WHERE status = 'completed'
      GROUP BY treatment_type 
      ORDER BY count DESC 
      LIMIT 5
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

// Get patient statistics
async function getPatientStats(db, month, year) {
  return new Promise((resolve, reject) => {
    // Get new patients this month
    db.get(`
      SELECT COUNT(*) as count
      FROM patients 
      WHERE strftime('%Y', created_at) = ? AND strftime('%m', created_at) = ?
    `, [year.toString(), month.toString().padStart(2, '0')], (err, monthRow) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Get total patients
      db.get('SELECT COUNT(*) as count FROM patients', (err, totalRow) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve({
          newThisMonth: monthRow ? monthRow.count : 0,
          total: totalRow ? totalRow.count : 0
        });
      });
    });
  });
}

// Get revenue statistics
async function getRevenueStats(db, month, year) {
  return new Promise((resolve, reject) => {
    // Get revenue this month
    db.get(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM financial_records 
      WHERE type = 'income' 
        AND strftime('%Y', transaction_date) = ? 
        AND strftime('%m', transaction_date) = ?
    `, [year.toString(), month.toString().padStart(2, '0')], (err, monthRow) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Get revenue previous month
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      
      db.get(`
        SELECT COALESCE(SUM(amount), 0) as total
        FROM financial_records 
        WHERE type = 'income' 
          AND strftime('%Y', transaction_date) = ? 
          AND strftime('%m', transaction_date) = ?
      `, [prevYear.toString(), prevMonth.toString().padStart(2, '0')], (err, prevMonthRow) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve({
          thisMonth: monthRow ? monthRow.total : 0,
          previousMonth: prevMonthRow ? prevMonthRow.total : 0
        });
      });
    });
  });
}

// Get dashboard data for specific date range
router.get('/stats/:period', async (req, res) => {
  try {
    const { period } = req.params;
    const { startDate, endDate } = req.query;
    
    const db = getDatabase();
    let stats;
    
    switch (period) {
      case 'monthly':
        stats = await getMonthlyStats(db, startDate, endDate);
        break;
      case 'weekly':
        stats = await getWeeklyStats(db, startDate, endDate);
        break;
      case 'daily':
        stats = await getDailyStats(db, startDate, endDate);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid period. Use monthly, weekly, or daily'
        });
    }
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

// Helper functions for different time periods
async function getMonthlyStats(db, startDate, endDate) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        strftime('%Y-%m', appointment_date) as month,
        COUNT(*) as total_appointments,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM appointments 
      WHERE appointment_date BETWEEN ? AND ?
      GROUP BY strftime('%Y-%m', appointment_date)
      ORDER BY month
    `, [startDate || '2020-01-01', endDate || '2030-12-31'], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

async function getWeeklyStats(db, startDate, endDate) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        strftime('%Y-W%W', appointment_date) as week,
        COUNT(*) as total_appointments,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM appointments 
      WHERE appointment_date BETWEEN ? AND ?
      GROUP BY strftime('%Y-W%W', appointment_date)
      ORDER BY week
    `, [startDate || '2020-01-01', endDate || '2030-12-31'], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

async function getDailyStats(db, startDate, endDate) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        appointment_date as date,
        COUNT(*) as total_appointments,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM appointments 
      WHERE appointment_date BETWEEN ? AND ?
      GROUP BY appointment_date
      ORDER BY appointment_date
    `, [startDate || '2020-01-01', endDate || '2030-12-31'], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

module.exports = router;
