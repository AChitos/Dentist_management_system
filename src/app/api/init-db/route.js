import { NextResponse } from 'next/server'
import { getDatabase } from '../../../lib/database'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    const db = await getDatabase()

    // Begin transaction
    await db.exec('BEGIN TRANSACTION')

    try {
      // Create users table
      await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          email TEXT,
          role TEXT DEFAULT 'staff',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Create patients table
      await db.exec(`
        CREATE TABLE IF NOT EXISTS patients (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          date_of_birth DATE,
          address TEXT,
          medical_history TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Create appointments table
      await db.exec(`
        CREATE TABLE IF NOT EXISTS appointments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_id INTEGER,
          doctor_id INTEGER,
          appointment_date DATETIME NOT NULL,
          status TEXT DEFAULT 'scheduled',
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (patient_id) REFERENCES patients (id),
          FOREIGN KEY (doctor_id) REFERENCES users (id)
        )
      `)

      // Create treatments table
      await db.exec(`
        CREATE TABLE IF NOT EXISTS treatments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_id INTEGER,
          treatment_type_id INTEGER,
          doctor_id INTEGER,
          treatment_date DATE NOT NULL,
          cost DECIMAL(10,2),
          notes TEXT,
          status TEXT DEFAULT 'completed',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (patient_id) REFERENCES patients (id),
          FOREIGN KEY (treatment_type_id) REFERENCES treatment_types (id),
          FOREIGN KEY (doctor_id) REFERENCES users (id)
        )
      `)

      // Create treatment_types table
      await db.exec(`
        CREATE TABLE IF NOT EXISTS treatment_types (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          base_cost DECIMAL(10,2),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Create financial_records table
      await db.exec(`
        CREATE TABLE IF NOT EXISTS financial_records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_id INTEGER,
          treatment_id INTEGER,
          amount DECIMAL(10,2) NOT NULL,
          type TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          payment_date DATE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (patient_id) REFERENCES patients (id),
          FOREIGN KEY (treatment_id) REFERENCES treatments (id)
        )
      `)

      // Create clinic_settings table
      await db.exec(`
        CREATE TABLE IF NOT EXISTS clinic_settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          clinic_name TEXT DEFAULT 'Zendenta Dental Clinic',
          address TEXT,
          phone TEXT,
          email TEXT,
          working_hours TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Insert default admin user
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await db.run(`
        INSERT OR IGNORE INTO users (username, password, email, role)
        VALUES (?, ?, ?, ?)
      `, ['admin', hashedPassword, 'admin@zendenta.com', 'admin'])

      // Insert default treatment types
      const treatmentTypes = [
        ['Dental Cleaning', 'Regular dental cleaning and checkup', 150.00],
        ['Cavity Filling', 'Tooth cavity filling', 200.00],
        ['Root Canal', 'Root canal treatment', 800.00],
        ['Tooth Extraction', 'Simple tooth extraction', 300.00],
        ['Dental Crown', 'Porcelain dental crown', 1200.00]
      ]

      for (const [name, description, cost] of treatmentTypes) {
        await db.run(`
          INSERT OR IGNORE INTO treatment_types (name, description, base_cost)
          VALUES (?, ?, ?)
        `, [name, description, cost])
      }

      // Insert default clinic settings
      await db.run(`
        INSERT OR IGNORE INTO clinic_settings (clinic_name, address, phone, email, working_hours)
        VALUES (?, ?, ?, ?, ?)
      `, [
        'Zendenta Dental Clinic',
        '123 Dental Street, City, State 12345',
        '+1 (555) 123-4567',
        'info@zendenta.com',
        'Monday-Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 2:00 PM'
      ])

      // Commit transaction
      await db.exec('COMMIT')

      return NextResponse.json({
        message: 'Database initialized successfully',
        tables: ['users', 'patients', 'appointments', 'treatments', 'treatment_types', 'financial_records', 'clinic_settings']
      })

    } catch (error) {
      // Rollback on error
      await db.exec('ROLLBACK')
      throw error
    }

  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize database', details: error.message },
      { status: 500 }
    )
  }
}
