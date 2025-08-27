import { NextResponse } from 'next/server'
import { getDatabase } from '../../../../lib/database'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const db = await getDatabase()
    
    const patient = await db.get(`
      SELECT * FROM patients WHERE id = ?
    `, [id])
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ patient })
  } catch (error) {
    console.error('Error fetching patient:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { first_name, last_name, email, phone, date_of_birth, address, medical_history } = body
    
    const db = await getDatabase()
    
    const result = await db.run(`
      UPDATE patients 
      SET first_name = ?, last_name = ?, email = ?, phone = ?, 
          date_of_birth = ?, address = ?, medical_history = ?
      WHERE id = ?
    `, [first_name, last_name, email, phone, date_of_birth, address, medical_history, id])
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }
    
    const updatedPatient = await db.get(`
      SELECT * FROM patients WHERE id = ?
    `, [id])
    
    return NextResponse.json({
      message: 'Patient updated successfully',
      patient: updatedPatient
    })
    
  } catch (error) {
    console.error('Error updating patient:', error)
    return NextResponse.json(
      { error: 'Failed to update patient' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const db = await getDatabase()
    
    const result = await db.run(`
      DELETE FROM patients WHERE id = ?
    `, [id])
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      message: 'Patient deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting patient:', error)
    return NextResponse.json(
      { error: 'Failed to delete patient' },
      { status: 500 }
    )
  }
}
