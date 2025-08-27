import { NextResponse } from 'next/server'
import { getDatabase } from '../../../../lib/database'

export async function GET() {
  try {
    const db = await getDatabase()

    // Get total patients
    const patientsResult = await db.get('SELECT COUNT(*) as count FROM patients')
    const totalPatients = patientsResult.count

    // Get total appointments today
    const today = new Date().toISOString().split('T')[0]
    const appointmentsResult = await db.get(
      'SELECT COUNT(*) as count FROM appointments WHERE DATE(appointment_date) = ?',
      [today]
    )
    const todayAppointments = appointmentsResult.count

    // Get total treatments this month
    const currentMonth = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0')
    const treatmentsResult = await db.get(
      'SELECT COUNT(*) as count FROM treatments WHERE strftime("%Y-%m", treatment_date) = ?',
      [currentMonth]
    )
    const monthlyTreatments = treatmentsResult.count

    // Get total revenue this month
    const revenueResult = await db.get(
      'SELECT COALESCE(SUM(amount), 0) as total FROM financial_records WHERE strftime("%Y-%m", payment_date) = ? AND type = "income"',
      [currentMonth]
    )
    const monthlyRevenue = revenueResult.total

    // Get recent appointments
    const recentAppointments = await db.all(`
      SELECT a.*, p.first_name, p.last_name, u.username as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.doctor_id = u.id
      ORDER BY a.appointment_date DESC
      LIMIT 5
    `)

    // Get top treatments
    const topTreatments = await db.all(`
      SELECT tt.name, COUNT(t.id) as count, AVG(t.cost) as avg_cost
      FROM treatment_types tt
      LEFT JOIN treatments t ON tt.id = t.treatment_type_id
      GROUP BY tt.id
      ORDER BY count DESC
      LIMIT 5
    `)

    return NextResponse.json({
      stats: {
        totalPatients,
        todayAppointments,
        monthlyTreatments,
        monthlyRevenue: parseFloat(monthlyRevenue)
      },
      recentAppointments,
      topTreatments
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
