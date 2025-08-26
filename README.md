# Dental Clinic Management System

A comprehensive, modern web application designed to assist dental clinics with all aspects of their operations. Built with Apple's "Liquid Glass" design principles for an intuitive and beautiful user experience.

## 🚀 Features

### Core Functionality
- **Patient Management**: Complete patient profiles with medical history, demographics, and treatment plans
- **Appointment Scheduling**: Intuitive calendar interface with automated reminders and conflict detection
- **Treatment Planning**: Visual treatment plans with customizable options and progress tracking
- **Electronic Health Records (EHR)**: Comprehensive medical records accessible from any device
- **Billing & Invoicing**: Automated billing, payment tracking, and insurance claims management
- **Inventory Management**: Track dental supplies with low-stock notifications and transaction history
- **User Management**: Role-based access control for clinic staff (Admin, Doctor, Staff, Receptionist)
- **Database Backup**: One-click database backup and Excel export capabilities
- **Audit Logging**: Complete audit trail for all system activities

### Technical Features
- **Secure Authentication**: JWT-based authentication with role-based access control
- **Real-time Data**: Live updates and notifications
- **Responsive Design**: Mobile-first approach with Apple-inspired design
- **Data Export**: Excel and CSV export functionality
- **API Security**: Rate limiting, input validation, and SQL injection protection
- **Performance**: Optimized database queries and caching strategies

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** (Apple "Liquid Glass" design implementation)
- **React Router** for navigation
- **React Query** for data management
- **React Hook Form** for form handling
- **Framer Motion** for animations
- **Chart.js** for data visualization
- **Lucide React** for icons
- **Date-fns** for date manipulation

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** database
- **Prisma ORM** for database operations
- **JWT** authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Multer** for file uploads
- **ExcelJS** for Excel export
- **Morgan** for logging

### Development & Deployment
- **Vite** for frontend tooling
- **ESLint** & **Prettier** for code quality
- **Docker** & **Docker Compose** for containerization
- **Nginx** for reverse proxy and static file serving
- **Git** with **Husky** for pre-commit hooks

## 📁 Project Structure

```
Dentist_management_system/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Authentication & validation
│   │   ├── database/       # Database seeding
│   │   └── utils/          # Utility functions
│   ├── prisma/             # Database schema & migrations
│   └── Dockerfile          # Backend container
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── contexts/       # React contexts
│   │   └── styles/         # CSS and styling
│   ├── public/             # Static assets
│   └── Dockerfile          # Frontend container
├── nginx/                   # Nginx configuration
├── docker-compose.yml       # Multi-service orchestration
├── setup.sh                 # Automated setup script
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- **Docker** and **Docker Compose** installed
- **Node.js** 18+ (for local development)
- **Git** for version control

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Dentist_management_system
   ```

2. **Run the automated setup**
   ```bash
   chmod +x setup.sh
   ./setup.sh start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

### Option 2: Manual Setup

1. **Clone and navigate to the project**
   ```bash
   git clone <repository-url>
   cd Dentist_management_system
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Set up the database**
   ```bash
   # Install PostgreSQL locally or use Docker
   docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
   ```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/dental_clinic"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="24h"

# Server Configuration
PORT=3001
NODE_ENV="development"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Security Configuration
CORS_ORIGIN="http://localhost:3000"
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Backup Configuration
BACKUP_PATH="./backups"
BACKUP_RETENTION_DAYS=30
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME="Dental Clinic Management System"
```

## 🗄️ Database Schema

The system uses a comprehensive database schema with the following main entities:

- **Users**: Clinic staff with role-based access control
- **Patients**: Complete patient profiles and medical information
- **Appointments**: Scheduling with conflict detection
- **Treatments**: Treatment plans and progress tracking
- **Medical Records**: Patient medical history and notes
- **Billing**: Invoicing and payment tracking
- **Inventory**: Supply management with low-stock alerts
- **Audit Logs**: Complete system activity tracking

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Admin, Doctor, Staff, Receptionist roles
- **Input Validation**: Comprehensive validation and sanitization
- **Rate Limiting**: API protection against abuse
- **Audit Logging**: Complete activity tracking
- **Data Encryption**: Sensitive data protection
- **CORS Protection**: Cross-origin request security

## 🎨 Design Principles

Following Apple's "Liquid Glass" design language:
- **Fluid Interfaces**: Smooth transitions and animations
- **Glass Morphism**: Translucent, layered elements
- **Typography**: San Francisco font family
- **Color Palette**: Subtle, professional colors
- **Spacing**: Generous whitespace for readability
- **Icons**: Clean, minimal iconography

## 📊 Dashboard & Analytics

- **Real-time Statistics**: Patient counts, appointment status, revenue tracking
- **Interactive Charts**: Appointment trends, treatment distribution, revenue analysis
- **Activity Monitoring**: Recent system activities and user actions
- **Quick Actions**: One-click access to common functions

## 🔄 Database Operations

### Backup & Export
- **SQL Backup**: Automated database backups with compression
- **Excel Export**: Comprehensive data export with formatting
- **Scheduled Backups**: Automated backup scheduling
- **Restore Functionality**: Database restoration from backups

### Data Management
- **Bulk Operations**: Mass updates and imports
- **Data Validation**: Comprehensive data integrity checks
- **Soft Deletes**: Safe data removal with recovery options

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests (when implemented)
npm run test:e2e
```

## 🚀 Deployment

### Production Deployment
1. **Environment Setup**: Configure production environment variables
2. **Database Migration**: Run production database migrations
3. **Build Applications**: Build frontend and backend for production
4. **Container Deployment**: Deploy using Docker Compose
5. **SSL Configuration**: Set up HTTPS with Let's Encrypt

### Docker Deployment
```bash
# Production build
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale backend=3
```

## 📈 Monitoring & Maintenance

- **Health Checks**: Automated service health monitoring
- **Log Management**: Centralized logging with rotation
- **Performance Monitoring**: Response time and resource usage tracking
- **Backup Verification**: Automated backup integrity checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Notes

### Current Status
- ✅ **Backend API**: Complete with all major routes implemented
- ✅ **Database Schema**: Comprehensive schema with all required models
- ✅ **Authentication**: JWT-based auth with role-based access control
- ✅ **Frontend Pages**: Basic page structure with routing
- ✅ **Patient Management**: Full CRUD operations with search and filtering
- ✅ **Database Backup**: Automated backup and export functionality
- 🔄 **Frontend Components**: Core components implemented, forms in progress
- 🔄 **Advanced Features**: Calendar, forms, and detailed CRUD operations

### Next Steps
1. **Complete Frontend Forms**: Patient creation, editing, and appointment scheduling
2. **Advanced Components**: Calendar interface, data tables, and form validation
3. **Real-time Features**: Live updates and notifications
4. **Testing Suite**: Comprehensive testing implementation
5. **Documentation**: API documentation and user guides

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide

## 🔄 Version History

- **v1.0.0** (Current): Core system with basic functionality
- **v1.1.0** (Planned): Advanced features and enhanced UI
- **v1.2.0** (Planned): Mobile app and additional integrations

---

**Last Updated**: December 2024  
**Maintained by**: Development Team
