import { NextResponse } from 'next/server'
import { getDatabase } from '../../../lib/database'
import fs from 'fs-extra'
import path from 'path'
import archiver from 'archiver'

export async function POST() {
  try {
    const db = await getDatabase()
    
    // Create backup directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'database', 'backups')
    await fs.ensureDir(backupDir)
    
    // Generate backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFilename = `zendenta-backup-${timestamp}.zip`
    const backupPath = path.join(backupDir, backupFilename)
    
    // Create a write stream for the backup file
    const output = fs.createWriteStream(backupPath)
    const archive = archiver('zip', { zlib: { level: 9 } })
    
    // Pipe archive data to the file
    archive.pipe(output)
    
    // Add the database file to the archive
    const dbPath = path.join(process.cwd(), 'database', 'dentist.db')
    if (await fs.pathExists(dbPath)) {
      archive.file(dbPath, { name: 'dentist.db' })
    }
    
    // Add database schema and data export
    const tables = ['users', 'patients', 'appointments', 'treatments', 'treatment_types', 'financial_records', 'clinic_settings']
    
    for (const table of tables) {
      try {
        const data = await db.all(`SELECT * FROM ${table}`)
        const jsonData = JSON.stringify(data, null, 2)
        archive.append(jsonData, { name: `${table}.json` })
      } catch (error) {
        console.warn(`Could not backup table ${table}:`, error.message)
      }
    }
    
    // Finalize the archive
    await archive.finalize()
    
    // Wait for the write stream to finish
    await new Promise((resolve, reject) => {
      output.on('close', resolve)
      output.on('error', reject)
    })
    
    // Get backup file info
    const stats = await fs.stat(backupPath)
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2)
    
    return NextResponse.json({
      message: 'Backup created successfully',
      filename: backupFilename,
      size: `${fileSizeInMB} MB`,
      path: backupPath,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Backup error:', error)
    return NextResponse.json(
      { error: 'Failed to create backup', details: error.message },
      { status: 500 }
    )
  }
}
