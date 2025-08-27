import { NextResponse } from 'next/server'
import { getDatabase } from '../../../lib/database'

export async function GET() {
  try {
    const db = await getDatabase()
    
    const patients = await db.all(`
      SELECT 
        id, first_name, last_name, email, phone, 
        date_of_birth, address, medical_history, created_at
      FROM patients 
      ORDER BY created_at DESC
    `)
    
    return NextResponse.json({ patients })
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { first_name, last_name, email, phone, date_of_birth, address, medical_history } = body
    
    if (!first_name || !last_name) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      )
    }
    
    const db = await getDatabase()
    
    const result = await db.run(`
      INSERT INTO patients (first_name, last_name, email, phone, date_of_birth, address, medical_history)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [first_name, last_name, email, phone, date_of_birth, address, medical_history])
    
    const newPatient = await db.get(`
      SELECT * FROM patients WHERE id = ?
    `, [result.lastID])
    
    return NextResponse.json({ 
      message: 'Patient created successfully',
      patient: newPatient 
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating patient:', error)
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    )
  }
}
