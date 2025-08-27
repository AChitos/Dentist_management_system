const { getDatabase } = require('./init');

// Database schema creation
async function createTables() {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Start transaction
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) {
          console.error('Error starting transaction:', err);
          reject(err);
          return;
        }

        // Users table
        db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'staff',
            specialization TEXT,
            phone TEXT,
            avatar_url TEXT,
            is_active BOOLEAN DEFAULT 1,
            last_login DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            console.error('Error creating users table:', err);
            db.run('ROLLBACK');
            reject(err);
            return;
          }

          // Patients table
          db.run(`
            CREATE TABLE IF NOT EXISTS patients (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              patient_id TEXT UNIQUE NOT NULL,
              first_name TEXT NOT NULL,
              last_name TEXT NOT NULL,
              date_of_birth DATE,
              gender TEXT CHECK(gender IN ('male', 'female', 'other')),
              phone TEXT,
              email TEXT,
              address TEXT,
              emergency_contact TEXT,
              emergency_phone TEXT,
              medical_history TEXT,
              allergies TEXT,
              insurance_info TEXT,
              notes TEXT,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `, (err) => {
            if (err) {
              console.error('Error creating patients table:', err);
              db.run('ROLLBACK');
              reject(err);
              return;
            }

            // Appointments table
            db.run(`
              CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                appointment_id TEXT UNIQUE NOT NULL,
                patient_id INTEGER NOT NULL,
                doctor_id INTEGER NOT NULL,
                appointment_date DATE NOT NULL,
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                duration INTEGER NOT NULL,
                type TEXT NOT NULL,
                status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show')),
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES users (id) ON DELETE CASCADE
              )
            `, (err) => {
              if (err) {
                console.error('Error creating appointments table:', err);
                db.run('ROLLBACK');
                reject(err);
                return;
              }

              // Treatments table
              db.run(`
                CREATE TABLE IF NOT EXISTS treatments (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  treatment_id TEXT UNIQUE NOT NULL,
                  patient_id INTEGER NOT NULL,
                  doctor_id INTEGER NOT NULL,
                  appointment_id INTEGER,
                  treatment_type TEXT NOT NULL,
                  description TEXT,
                  cost DECIMAL(10,2) NOT NULL,
                  status TEXT DEFAULT 'planned' CHECK(status IN ('planned', 'in-progress', 'completed', 'cancelled')),
                  start_date DATE,
                  end_date DATE,
                  notes TEXT,
                  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE CASCADE,
                  FOREIGN KEY (doctor_id) REFERENCES users (id) ON DELETE CASCADE,
                  FOREIGN KEY (appointment_id) REFERENCES appointments (id) ON DELETE SET NULL
                )
              `, (err) => {
                if (err) {
                  console.error('Error creating treatments table:', err);
                  db.run('ROLLBACK');
                  reject(err);
                  return;
                }

                // Financial records table
                db.run(`
                  CREATE TABLE IF NOT EXISTS financial_records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    record_id TEXT UNIQUE NOT NULL,
                    patient_id INTEGER,
                    treatment_id INTEGER,
                    appointment_id INTEGER,
                    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
                    category TEXT NOT NULL,
                    amount DECIMAL(10,2) NOT NULL,
                    description TEXT,
                    payment_method TEXT,
                    payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'partial', 'cancelled')),
                    transaction_date DATE NOT NULL,
                    due_date DATE,
                    notes TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE SET NULL,
                    FOREIGN KEY (treatment_id) REFERENCES treatments (id) ON DELETE SET NULL,
                    FOREIGN KEY (appointment_id) REFERENCES appointments (id) ON DELETE SET NULL
                  )
                `, (err) => {
                  if (err) {
                    console.error('Error creating financial_records table:', err);
                    db.run('ROLLBACK');
                    reject(err);
                    return;
                  }

                  // Treatment types table
                  db.run(`
                    CREATE TABLE IF NOT EXISTS treatment_types (
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      name TEXT UNIQUE NOT NULL,
                      description TEXT,
                      base_cost DECIMAL(10,2) NOT NULL,
                      duration INTEGER NOT NULL,
                      is_active BOOLEAN DEFAULT 1,
                      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                  `, (err) => {
                    if (err) {
                      console.error('Error creating treatment_types table:', err);
                      db.run('ROLLBACK');
                      reject(err);
                      return;
                    }

                    // Clinic settings table
                    db.run(`
                      CREATE TABLE IF NOT EXISTS clinic_settings (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        setting_key TEXT UNIQUE NOT NULL,
                        setting_value TEXT,
                        description TEXT,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                      )
                    `, (err) => {
                      if (err) {
                        console.error('Error creating clinic_settings table:', err);
                        db.run('ROLLBACK');
                        reject(err);
                        return;
                      }

                      // Create indexes for better performance
                      db.run('CREATE INDEX IF NOT EXISTS idx_patients_patient_id ON patients(patient_id)', (err) => {
                        if (err) {
                          console.error('Error creating patients index:', err);
                          db.run('ROLLBACK');
                          reject(err);
                          return;
                        }

                        db.run('CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date)', (err) => {
                          if (err) {
                            console.error('Error creating appointments date index:', err);
                            db.run('ROLLBACK');
                            reject(err);
                            return;
                          }

                          db.run('CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id)', (err) => {
                            if (err) {
                              console.error('Error creating appointments patient index:', err);
                              db.run('ROLLBACK');
                              reject(err);
                              return;
                            }

                            db.run('CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id)', (err) => {
                              if (err) {
                                console.error('Error creating appointments doctor index:', err);
                                db.run('ROLLBACK');
                                reject(err);
                                return;
                              }

                              db.run('CREATE INDEX IF NOT EXISTS idx_treatments_patient ON treatments(patient_id)', (err) => {
                                if (err) {
                                  console.error('Error creating treatments patient index:', err);
                                  db.run('ROLLBACK');
                                  reject(err);
                                  return;
                                }

                                db.run('CREATE INDEX IF NOT EXISTS idx_financial_patient ON financial_records(patient_id)', (err) => {
                                  if (err) {
                                    console.error('Error creating financial patient index:', err);
                                    db.run('ROLLBACK');
                                    reject(err);
                                    return;
                                  }

                                  db.run('CREATE INDEX IF NOT EXISTS idx_financial_date ON financial_records(transaction_date)', (err) => {
                                    if (err) {
                                      console.error('Error creating financial date index:', err);
                                      db.run('ROLLBACK');
                                      reject(err);
                                      return;
                                    }

                                    // Insert default data
                                    insertDefaultData(db, () => {
                                      // Commit transaction
                                      db.run('COMMIT', (err) => {
                                        if (err) {
                                          console.error('Error committing transaction:', err);
                                          reject(err);
                                        } else {
                                          console.log('✅ Database tables created successfully');
                                          resolve();
                                        }
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

// Insert default data
function insertDefaultData(db, callback) {
  let completedOperations = 0;
  const totalOperations = 1 + 6 + 7; // 1 user + 6 treatment types + 7 clinic settings
  
  function checkCompletion() {
    completedOperations++;
    if (completedOperations === totalOperations) {
      callback();
    }
  }

  // Insert default admin user
  const bcrypt = require('bcryptjs');
  const adminPassword = bcrypt.hashSync('admin123', 10);
  
  db.run(`
    INSERT OR IGNORE INTO users (username, email, password_hash, full_name, role, specialization)
    VALUES ('admin', 'admin@zendenta.com', ?, 'Dr. Adam H.', 'admin', 'General Dentistry')
  `, [adminPassword], checkCompletion);

  // Insert default treatment types
  const treatmentTypes = [
    ['Consultation', 'Initial patient consultation and examination', 50.00, 60],
    ['Scaling', 'Professional dental cleaning and scaling', 80.00, 90],
    ['Root Canal', 'Endodontic treatment', 300.00, 120],
    ['Bleaching', 'Teeth whitening treatment', 150.00, 60],
    ['Wisdom Teeth Removal', 'Surgical extraction of wisdom teeth', 400.00, 180],
    ['Open Access', 'Emergency dental care', 100.00, 60]
  ];

  treatmentTypes.forEach(([name, description, cost, duration]) => {
    db.run(`
      INSERT OR IGNORE INTO treatment_types (name, description, base_cost, duration)
      VALUES (?, ?, ?, ?)
    `, [name, description, cost, duration], checkCompletion);
  });

  // Insert default clinic settings
  const clinicSettings = [
    ['clinic_name', 'Zendenta', 'Name of the dental clinic'],
    ['clinic_tagline', 'Cabut gigi tanpa sakit', 'Clinic tagline in Indonesian'],
    ['clinic_address', '7898 Marsh Ln Undefined Richardson, Wisconsin 35697 United States', 'Clinic address'],
    ['clinic_phone_1', '(205) 555-0100', 'Primary clinic phone number'],
    ['clinic_phone_2', '(262) 555-0131', 'Secondary clinic phone number'],
    ['working_hours', '09:00-17:00', 'Clinic working hours'],
    ['appointment_duration', '60', 'Default appointment duration in minutes']
  ];

  clinicSettings.forEach(([key, value, description]) => {
    db.run(`
      INSERT OR IGNORE INTO clinic_settings (setting_key, setting_value, description)
      VALUES (?, ?, ?)
    `, [key, value, description], checkCompletion);
  });
}

// Get database statistics
async function getDatabaseStats() {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    const stats = {};
    
    db.get('SELECT COUNT(*) as count FROM patients', (err, row) => {
      if (err) reject(err);
      stats.totalPatients = row.count;
      
      db.get('SELECT COUNT(*) as count FROM appointments', (err, row) => {
        if (err) reject(err);
        stats.totalAppointments = row.count;
        
        db.get('SELECT COUNT(*) as count FROM treatments', (err, row) => {
          if (err) reject(err);
          stats.totalTreatments = row.count;
          
          db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
            if (err) reject(err);
            stats.totalUsers = row.count;
            
            resolve(stats);
          });
        });
      });
    });
  });
}

module.exports = {
  createTables,
  getDatabaseStats
};
