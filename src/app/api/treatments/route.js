import { NextResponse } from 'next/server'
import { getDatabase } from '../../../lib/database'

export async function GET() {
  try {
    const db = await getDatabase()
    
    const treatments = await db.all(`
      SELECT 
        t.id, t.treatment_date, t.cost, t.notes, t.status, t.created_at,
        p.first_name as patient_first_name, p.last_name as patient_last_name,
        tt.name as treatment_type_name,
        u.username as doctor_name
      FROM treatments t
      LEFT JOIN patients p ON t.patient_id = p.id
      LEFT JOIN treatment_types tt ON t.treatment_type_id = tt.id
      LEFT JOIN users u ON t.doctor_id = u.id
      ORDER BY t.treatment_date DESC
    `)
    
    return NextResponse.json({ treatments })
  } catch (error) {
    console.error('Error fetching treatments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch treatments' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { patient_id, treatment_type_id, doctor_id, treatment_date, cost, notes, status } = body
    
    if (!patient_id || !treatment_type_id || !treatment_date) {
      return NextResponse.json(
        { error: 'Patient ID, treatment type ID, and treatment date are required' },
        { status: 400 }
      )
    }
    
    const db = await getDatabase()
    
    const result = await db.run(`
      INSERT INTO treatments (patient_id, treatment_type_id, doctor_id, treatment_date, cost, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [patient_id, treatment_type_id, doctor_id, treatment_date, cost, notes, status || 'completed'])
    
    const newTreatment = await db.get(`
      SELECT 
        t.id, t.treatment_date, t.cost, t.notes, t.status, t.created_at,
        p.first_name as patient_first_name, p.last_name as patient_last_name,
        tt.name as treatment_type_name,
        u.username as doctor_name
      FROM treatments t
      LEFT JOIN patients p ON t.patient_id = p.id
      LEFT JOIN treatment_types tt ON t.treatment_type_id = tt.id
      LEFT JOIN users u ON t.doctor_id = u.id
      WHERE t.id = ?
    `, [result.lastID])
    
    return NextResponse.json({ 
      message: 'Treatment created successfully',
      treatment: newTreatment 
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating treatment:', error)
    return NextResponse.json(
      { error: 'Failed to create treatment' },
      { status: 500 }
    )
  }
}
