import { NextResponse } from 'next/server'
import { getDatabase } from '../../../lib/database'

export async function GET() {
  try {
    const db = await getDatabase()
    
    const treatmentTypes = await db.all(`
      SELECT id, name, description, base_cost, created_at
      FROM treatment_types 
      ORDER BY name ASC
    `)
    
    return NextResponse.json({ treatmentTypes })
  } catch (error) {
    console.error('Error fetching treatment types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch treatment types' },
      { status: 500 }
    )
  }
}
