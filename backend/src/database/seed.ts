import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dentalclinic.com' },
    update: {},
    create: {
      email: 'admin@dentalclinic.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create doctor users
  const doctorPassword = await bcrypt.hash('doctor123', 12);
  const doctor1 = await prisma.user.upsert({
    where: { email: 'dr.smith@dentalclinic.com' },
    update: {},
    create: {
      email: 'dr.smith@dentalclinic.com',
      password: doctorPassword,
      firstName: 'John',
      lastName: 'Smith',
      role: 'DOCTOR',
      specialization: 'General Dentistry',
      phone: '+1-555-0101',
      isActive: true,
    },
  });
  console.log('✅ Doctor created:', doctor1.email);

  const doctor2 = await prisma.user.upsert({
    where: { email: 'dr.johnson@dentalclinic.com' },
    update: {},
    create: {
      email: 'dr.johnson@dentalclinic.com',
      password: doctorPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'DOCTOR',
      specialization: 'Orthodontics',
      phone: '+1-555-0102',
      isActive: true,
    },
  });
  console.log('✅ Doctor created:', doctor2.email);

  // Create staff users
  const staffPassword = await bcrypt.hash('staff123', 12);
  const receptionist = await prisma.user.upsert({
    where: { email: 'reception@dentalclinic.com' },
    update: {},
    create: {
      email: 'reception@dentalclinic.com',
      password: staffPassword,
      firstName: 'Maria',
      lastName: 'Garcia',
      role: 'RECEPTIONIST',
      phone: '+1-555-0103',
      isActive: true,
    },
  });
  console.log('✅ Receptionist created:', receptionist.email);

  const hygienist = await prisma.user.upsert({
    where: { email: 'hygienist@dentalclinic.com' },
    update: {},
    create: {
      email: 'hygienist@dentalclinic.com',
      password: staffPassword,
      firstName: 'Lisa',
      lastName: 'Thompson',
      role: 'STAFF',
      specialization: 'Dental Hygiene',
      phone: '+1-555-0104',
      isActive: true,
    },
  });
  console.log('✅ Hygienist created:', hygienist.email);

  // Create sample patients
  const patients = [
    {
      patientId: 'P20240001',
      firstName: 'Michael',
      lastName: 'Brown',
      dateOfBirth: new Date('1985-03-15'),
      gender: 'MALE',
      email: 'michael.brown@email.com',
      phone: '+1-555-0201',
      address: '123 Oak Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      emergencyContact: 'Jennifer Brown',
      emergencyPhone: '+1-555-0202',
      insuranceProvider: 'Blue Cross Blue Shield',
      insuranceNumber: 'BCBS123456',
      medicalHistory: 'No known allergies. Previous root canal in 2020.',
      allergies: 'None',
      medications: 'None',
    },
    {
      patientId: 'P20240002',
      firstName: 'Emily',
      lastName: 'Davis',
      dateOfBirth: new Date('1992-07-22'),
      gender: 'FEMALE',
      email: 'emily.davis@email.com',
      phone: '+1-555-0203',
      address: '456 Maple Avenue',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702',
      emergencyContact: 'Robert Davis',
      emergencyPhone: '+1-555-0204',
      insuranceProvider: 'Aetna',
      insuranceNumber: 'AET789012',
      medicalHistory: 'Regular dental checkups. No major procedures.',
      allergies: 'Latex',
      medications: 'None',
    },
    {
      patientId: 'P20240003',
      firstName: 'David',
      lastName: 'Wilson',
      dateOfBirth: new Date('1978-11-08'),
      gender: 'MALE',
      email: 'david.wilson@email.com',
      phone: '+1-555-0205',
      address: '789 Pine Road',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62703',
      emergencyContact: 'Patricia Wilson',
      emergencyPhone: '+1-555-0206',
      insuranceProvider: 'Cigna',
      insuranceNumber: 'CIG345678',
      medicalHistory: 'Multiple fillings. Wisdom teeth removed in 2015.',
      allergies: 'None',
      medications: 'Blood pressure medication',
    },
    {
      patientId: 'P20240004',
      firstName: 'Jessica',
      lastName: 'Martinez',
      dateOfBirth: new Date('1990-04-12'),
      gender: 'FEMALE',
      email: 'jessica.martinez@email.com',
      phone: '+1-555-0207',
      address: '321 Elm Court',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
      emergencyContact: 'Carlos Martinez',
      emergencyPhone: '+1-555-0208',
      insuranceProvider: 'UnitedHealth',
      insuranceNumber: 'UHC901234',
      medicalHistory: 'Braces from 2005-2008. Regular cleanings.',
      allergies: 'Penicillin',
      medications: 'None',
    },
    {
      patientId: 'P20240005',
      firstName: 'Robert',
      lastName: 'Taylor',
      dateOfBirth: new Date('1965-09-30'),
      gender: 'MALE',
      email: 'robert.taylor@email.com',
      phone: '+1-555-0209',
      address: '654 Cedar Lane',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62705',
      emergencyContact: 'Susan Taylor',
      emergencyPhone: '+1-555-0210',
      insuranceProvider: 'Humana',
      insuranceNumber: 'HUM567890',
      medicalHistory: 'Partial dentures. Gum disease treatment in 2021.',
      allergies: 'None',
      medications: 'Diabetes medication, Heart medication',
    },
  ];

  for (const patientData of patients) {
    const patient = await prisma.patient.upsert({
      where: { patientId: patientData.patientId },
      update: {},
      create: patientData,
    });
    console.log('✅ Patient created:', patient.patientId);
  }

  // Create sample appointments
  const appointments = [
    {
      patientId: 'P20240001',
      doctorId: doctor1.id,
      date: new Date('2024-12-20'),
      startTime: '09:00',
      endTime: '10:00',
      duration: 60,
      type: 'CONSULTATION',
      status: 'SCHEDULED',
      notes: 'Annual checkup and cleaning',
    },
    {
      patientId: 'P20240002',
      doctorId: doctor2.id,
      date: '2024-12-20',
      startTime: '10:30',
      endTime: '11:30',
      duration: 60,
      type: 'ORTHODONTICS',
      status: 'SCHEDULED',
      notes: 'Braces adjustment',
    },
    {
      patientId: 'P20240003',
      doctorId: doctor1.id,
      date: '2024-12-21',
      startTime: '14:00',
      endTime: '15:00',
      duration: 60,
      type: 'FILLING',
      status: 'SCHEDULED',
      notes: 'Cavity filling on tooth #14',
    },
  ];

  for (const appointmentData of appointments) {
    const appointment = await prisma.appointment.create({
      data: appointmentData,
    });
    console.log('✅ Appointment created:', appointment.id);
  }

  // Create sample treatments
  const treatments = [
    {
      patientId: 'P20240001',
      doctorId: doctor1.id,
      name: 'Annual Checkup and Cleaning',
      description: 'Comprehensive dental examination and professional cleaning',
      category: 'PREVENTIVE',
      status: 'PLANNED',
      plannedDate: new Date('2024-12-20'),
      cost: 150.00,
      insuranceCoverage: 120.00,
      notes: 'Standard annual procedure',
    },
    {
      patientId: 'P20240002',
      doctorId: doctor2.id,
      name: 'Braces Adjustment',
      description: 'Monthly orthodontic adjustment and wire change',
      category: 'ORTHODONTIC',
      status: 'PLANNED',
      plannedDate: new Date('2024-12-20'),
      cost: 75.00,
      insuranceCoverage: 60.00,
      notes: 'Regular adjustment appointment',
    },
    {
      patientId: 'P20240003',
      doctorId: doctor1.id,
      name: 'Cavity Filling',
      description: 'Composite filling for cavity on tooth #14',
      category: 'RESTORATIVE',
      status: 'PLANNED',
      plannedDate: new Date('2024-12-21'),
      cost: 200.00,
      insuranceCoverage: 160.00,
      notes: 'Small cavity, single surface filling',
    },
  ];

  for (const treatmentData of treatments) {
    const treatment = await prisma.treatment.create({
      data: treatmentData,
    });
    console.log('✅ Treatment created:', treatment.id);
  }

  // Create sample medical records
  const medicalRecords = [
    {
      patientId: 'P20240001',
      doctorId: doctor1.id,
      date: new Date('2024-12-15'),
      diagnosis: 'Good oral health',
      symptoms: 'None',
      examination: 'Teeth in good condition, minor tartar buildup',
      treatment: 'Professional cleaning recommended',
      prescription: 'None',
      followUp: new Date('2024-12-20'),
      notes: 'Patient maintains good oral hygiene',
    },
    {
      patientId: 'P20240002',
      doctorId: doctor2.id,
      date: new Date('2024-12-10'),
      diagnosis: 'Orthodontic treatment progress',
      symptoms: 'None',
      examination: 'Braces functioning well, teeth moving as expected',
      treatment: 'Continue current treatment plan',
      prescription: 'None',
      followUp: new Date('2024-12-20'),
      notes: 'Patient compliant with treatment instructions',
    },
  ];

  for (const recordData of medicalRecords) {
    const record = await prisma.medicalRecord.create({
      data: recordData,
    });
    console.log('✅ Medical record created:', record.id);
  }

  // Create sample inventory items
  const inventoryItems = [
    {
      name: 'Dental Floss',
      category: 'Hygiene Supplies',
      description: 'Waxed dental floss, 100 yards per roll',
      quantity: 50,
      minQuantity: 10,
      unit: 'rolls',
      cost: 2.50,
      supplier: 'Dental Supply Co.',
      supplierContact: '+1-800-555-0123',
      lastRestocked: new Date('2024-12-01'),
      location: 'Storage Room A',
    },
    {
      name: 'Toothpaste',
      category: 'Hygiene Supplies',
      description: 'Fluoride toothpaste, mint flavor',
      quantity: 30,
      minQuantity: 5,
      unit: 'tubes',
      cost: 3.75,
      supplier: 'Dental Supply Co.',
      supplierContact: '+1-800-555-0123',
      lastRestocked: new Date('2024-12-01'),
      location: 'Storage Room A',
    },
    {
      name: 'Disposable Gloves',
      category: 'Safety Equipment',
      description: 'Latex-free disposable gloves, size M',
      quantity: 200,
      minQuantity: 50,
      unit: 'pairs',
      cost: 0.25,
      supplier: 'Medical Supply Inc.',
      supplierContact: '+1-800-555-0456',
      lastRestocked: new Date('2024-12-05'),
      location: 'Storage Room B',
    },
    {
      name: 'X-Ray Film',
      category: 'Imaging Supplies',
      description: 'Dental X-ray film, size 2',
      quantity: 100,
      minQuantity: 20,
      unit: 'sheets',
      cost: 1.50,
      supplier: 'Imaging Supplies Ltd.',
      supplierContact: '+1-800-555-0789',
      lastRestocked: new Date('2024-12-10'),
      location: 'Storage Room C',
    },
  ];

  for (const itemData of inventoryItems) {
    const item = await prisma.inventory.create({
      data: itemData,
    });
    console.log('✅ Inventory item created:', item.name);
  }

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Sample Data Summary:');
  console.log('- Admin User: admin@dentalclinic.com (password: admin123)');
  console.log('- Doctor Users: dr.smith@dentalclinic.com, dr.johnson@dentalclinic.com (password: doctor123)');
  console.log('- Staff Users: reception@dentalclinic.com, hygienist@dentalclinic.com (password: staff123)');
  console.log('- Patients: 5 sample patients created');
  console.log('- Appointments: 3 sample appointments created');
  console.log('- Treatments: 3 sample treatments created');
  console.log('- Medical Records: 2 sample records created');
  console.log('- Inventory: 4 sample items created');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
