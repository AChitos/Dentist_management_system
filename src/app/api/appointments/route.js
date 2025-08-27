import { NextResponse } from 'next/server'
import { getDatabase } from '../../../lib/database'

export async function GET() {
  try {
    const db = await getDatabase()
    
    const appointments = await db.all(`
      SELECT 
        a.id, a.appointment_date, a.status, a.notes, a.created_at,
        p.first_name as patient_first_name, p.last_name as patient_last_name,
        u.username as doctor_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.doctor_id = u.id
      ORDER BY a.appointment_date DESC
    `)
    
    return NextResponse.json({ appointments })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { patient_id, doctor_id, appointment_date, status, notes } = body
    
    if (!patient_id || !appointment_date) {
      return NextResponse.json(
        { error: 'Patient ID and appointment date are required' },
        { status: 400 }
      )
    }
    
    const db = await getDatabase()
    
    const result = await db.run(`
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, notes)
      VALUES (?, ?, ?, ?, ?)
    `, [patient_id, doctor_id, appointment_date, status || 'scheduled', notes])
    
    const newAppointment = await db.get(`
      SELECT 
        a.id, a.appointment_date, a.status, a.notes, a.created_at,
        p.first_name as patient_first_name, p.last_name as patient_last_name,
        u.username as doctor_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.doctor_id = u.id
      WHERE a.id = ?
    `, [result.lastID])
    
    return NextResponse.json({ 
      message: 'Appointment created successfully',
      appointment: newAppointment 
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}
