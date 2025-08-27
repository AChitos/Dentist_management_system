import { NextResponse } from 'next/server'
import { getDatabase } from '../../../lib/database'
import ExcelJS from 'exceljs'
import path from 'path'
import fs from 'fs-extra'

export async function POST() {
  try {
    const db = await getDatabase()
    
    // Create exports directory if it doesn't exist
    const exportDir = path.join(process.cwd(), 'database', 'exports')
    await fs.ensureDir(exportDir)
    
    // Generate export filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const exportFilename = `zendenta-export-${timestamp}.xlsx`
    const exportPath = path.join(exportDir, exportFilename)
    
    // Create a new workbook
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Zendenta Dental Clinic'
    workbook.lastModifiedBy = 'Zendenta System'
    workbook.created = new Date()
    workbook.modified = new Date()
    
    // Add metadata
    workbook.properties.title = 'Zendenta Dental Clinic - Complete Data Export'
    workbook.properties.subject = 'Dental Clinic Management Data'
    workbook.properties.author = 'Zendenta System'
    
    // Define tables to export
    const tables = [
      { name: 'Patients', query: 'SELECT * FROM patients ORDER BY created_at DESC' },
      { name: 'Appointments', query: 'SELECT a.*, p.first_name, p.last_name, u.username as doctor_name FROM appointments a JOIN patients p ON a.patient_id = p.id LEFT JOIN users u ON a.doctor_id = u.id ORDER BY a.appointment_date DESC' },
      { name: 'Treatments', query: 'SELECT t.*, p.first_name, p.last_name, tt.name as treatment_type, u.username as doctor_name FROM treatments t JOIN patients p ON t.patient_id = p.id JOIN treatment_types tt ON t.treatment_type_id = tt.id LEFT JOIN users u ON t.doctor_id = u.id ORDER BY t.treatment_date DESC' },
      { name: 'Treatment Types', query: 'SELECT * FROM treatment_types ORDER BY name' },
      { name: 'Financial Records', query: 'SELECT fr.*, p.first_name, p.last_name FROM financial_records fr LEFT JOIN patients p ON fr.patient_id = p.id ORDER BY fr.created_at DESC' },
      { name: 'Users', query: 'SELECT id, username, email, role, created_at FROM users ORDER BY created_at' },
      { name: 'Clinic Settings', query: 'SELECT * FROM clinic_settings' }
    ]
    
    // Export each table to a separate worksheet
    for (const table of tables) {
      try {
        const data = await db.all(table.query)
        
        if (data.length > 0) {
          const worksheet = workbook.addWorksheet(table.name)
          
          // Add headers
          const headers = Object.keys(data[0])
          worksheet.addRow(headers)
          
          // Style headers
          const headerRow = worksheet.getRow(1)
          headerRow.font = { bold: true, color: { argb: 'FFFFFF' } }
          headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '007AFF' } }
          
          // Add data rows
          data.forEach(row => {
            const values = headers.map(header => row[header])
            worksheet.addRow(values)
          })
          
          // Auto-fit columns
          worksheet.columns.forEach(column => {
            column.width = Math.max(
              column.header.length,
              ...data.map(row => String(row[column.key] || '').length)
            ) + 2
          })
          
          // Add borders
          worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              }
            })
          })
        }
      } catch (error) {
        console.warn(`Could not export table ${table.name}:`, error.message)
      }
    }
    
    // Save the workbook
    await workbook.xlsx.writeFile(exportPath)
    
    // Get file info
    const stats = await fs.stat(exportPath)
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2)
    
    return NextResponse.json({
      message: 'Excel export created successfully',
      filename: exportFilename,
      size: `${fileSizeInMB} MB`,
      path: exportPath,
      timestamp: new Date().toISOString(),
      tables: tables.length
    })
    
  } catch (error) {
    console.error('Excel export error:', error)
    return NextResponse.json(
      { error: 'Failed to create Excel export', details: error.message },
      { status: 500 }
    )
  }
}
