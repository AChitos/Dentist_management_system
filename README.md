# Zendenta - Dental Clinic Management System

## Project Overview
A modern, secure dental clinic management system built with Apple's design principles in mind. The system features a clean, intuitive interface following Apple's "Liquid Glass" design language with translucent elements, rounded corners, and a harmonious color palette.

## Design Principles
- **Apple Human Interface Guidelines (HIG)**: Clean typography, intuitive controls, and visual hierarchy
- **Liquid Glass Design**: Translucent backgrounds, subtle shadows, and depth
- **Color Scheme**: White and light blue palette with sufficient contrast
- **Typography**: San Francisco font family for consistency
- **Visual Elements**: Rounded corners, subtle gradients, and clean layouts

## Features

### Core Functionality
- **Dashboard Overview**: Real-time statistics and key metrics
- **Patient Management**: Complete patient records and history
- **Appointment Scheduling**: Calendar integration and appointment tracking
- **Treatment Tracking**: Treatment history and statistics
- **Revenue Management**: Financial tracking and reporting
- **User Management**: Role-based access control

### Security Features
- **Secure Database**: Encrypted data storage with SQLite
- **User Authentication**: JWT-based secure login system
- **Data Backup**: One-click backup functionality
- **Access Control**: Role-based permissions (Admin, Doctor, Staff)

### Export & Backup
- **Excel Export**: Complete data export to Excel format with multiple worksheets
- **One-Click Backup**: Automated backup system with timestamp
- **Data Recovery**: Backup restoration capabilities
- **Scripts**: Standalone backup and export scripts

## Technical Architecture

### Frontend
- **Framework**: React 18 with modern hooks
- **Styling**: Tailwind CSS with custom Apple-inspired design system
- **State Management**: React Context API for authentication
- **Charts**: Chart.js for data visualization
- **Icons**: Lucide React for consistent iconography
- **Routing**: React Router v6 for navigation

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: SQLite with encryption and WAL mode
- **Authentication**: JWT tokens with bcrypt password hashing
- **Security**: Helmet, CORS, rate limiting, and input validation
- **File Handling**: Multer for file uploads
- **Excel**: ExcelJS for comprehensive data export

### Database Schema
- **Users**: Staff accounts, roles, and permissions
- **Patients**: Personal information, medical history, treatment records
- **Appointments**: Scheduling, status, and notes
- **Treatments**: Procedures, costs, and outcomes
- **Financial**: Revenue tracking and billing
- **Treatment Types**: Standard procedures and pricing

## Project Structure
```
Dentist_management_system/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── dashboard/    # Dashboard components
│   │   │   └── layout/       # Layout components
│   │   ├── contexts/         # React contexts
│   │   └── App.js           # Main application
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies
│   └── tailwind.config.js    # Tailwind configuration
├── backend/                  # Node.js backend server
│   ├── database/             # Database setup and schema
│   ├── middleware/           # Authentication middleware
│   ├── routes/               # API route handlers
│   ├── package.json          # Backend dependencies
│   └── server.js             # Main server file
├── database/                 # Database files and backups
├── scripts/                  # Utility scripts
│   ├── backup.js            # Database backup script
│   └── export-excel.js      # Excel export script
├── docs/                     # Documentation and guides
└── README.md                 # This file
```

## Development Status
- [x] Project structure setup
- [x] README documentation
- [x] Backend server setup with Express
- [x] Database initialization and schema
- [x] Authentication system (JWT + bcrypt)
- [x] Security middleware (Helmet, CORS, rate limiting)
- [x] Backup system (one-click database backup)
- [x] Excel export functionality
- [x] Dashboard API endpoints
- [x] Frontend React application
- [x] Apple-inspired UI design system
- [x] Tailwind CSS configuration
- [x] Authentication context and components
- [x] Dashboard components with charts
- [x] Responsive layout and navigation
- [x] Utility scripts for backup and export
- [x] **SYSTEM FULLY OPERATIONAL** 🎉
- [x] Patient management CRUD operations
- [x] Appointment management system
- [x] Treatment management system
- [x] Payment management system
- [x] Settings and configuration
- [x] Help and support system
- [x] Advanced search and filtering
- [x] Deployment configuration and guides
- [ ] Calendar integration
- [ ] Testing and deployment

## Getting Started

### Current System Status
🎉 **SYSTEM FULLY OPERATIONAL** - All pages and buttons are now fully functional!

- **Backend API**: http://localhost:5001 ✅
- **Frontend App**: http://localhost:3000 ✅
- **Health Check**: http://localhost:5001/api/health ✅
- **Database**: SQLite with encryption ✅
- **Authentication**: JWT-based system ✅
- **Patient Management**: Full CRUD operations ✅
- **Appointment Management**: Complete scheduling system ✅
- **Treatment Management**: Full treatment tracking ✅
- **Payment Management**: Financial tracking system ✅
- **Settings**: Comprehensive configuration ✅
- **Help & Support**: Documentation and support ✅

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Dentist_management_system
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cd ../backend
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   # Server will start on http://localhost:5001
   ```

6. **Start the frontend application**
   ```bash
   cd frontend
   npm start
   # App will open on http://localhost:3000
   ```

### Default Login Credentials
- **Username**: admin
- **Password**: admin123

### Quick Start (Local Development)
```bash
# Clone the repository
git clone <your-repo-url>
cd Dentist_management_system

# Run the quick start script
chmod +x quick-start.sh
./quick-start.sh
```

### Deployment
For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Vercel and other platforms.

## Usage

### Dashboard
- View real-time statistics and metrics
- Monitor appointments and patient data
- Access quick actions for backup and export

### Backup System
- **One-click backup**: Click the database icon in the header
- **Manual backup**: Run `npm run backup` in the backend directory
- **Script backup**: Execute `node scripts/backup.js`

### Excel Export
- **Export all data**: Click the download icon in the header

### Patient Management
- **Add patients**: Complete patient registration with medical history
- **Search & filter**: Find patients by name, email, or phone
- **Edit & update**: Modify patient information and records
- **View details**: Comprehensive patient profile display

### Appointment Management
- **Schedule appointments**: Book patient appointments with doctors
- **Time management**: Set duration and manage scheduling conflicts
- **Status tracking**: Monitor appointment status (scheduled, confirmed, completed)
- **Patient linking**: Connect appointments to patient records

### Treatment Management
- **Track procedures**: Record dental treatments and procedures
- **Cost management**: Monitor treatment costs and pricing
- **Status updates**: Track treatment progress and completion
- **Patient association**: Link treatments to specific patients

### Payment Management
- **Income tracking**: Record patient payments and revenue
- **Expense management**: Track clinic expenses and costs
- **Financial reports**: View income, expenses, and net profit
- **Payment status**: Monitor payment completion and pending amounts

### Settings & Configuration
- **Clinic information**: Manage clinic details and contact information
- **User preferences**: Customize theme, language, and notifications
- **System settings**: Configure backup frequency and data retention
- **Security options**: Manage encryption and access controls

### Help & Support
- **Getting started guide**: Step-by-step system introduction
- **FAQ section**: Common questions and answers
- **Support contact**: Multiple ways to get help
- **Documentation**: User manual and video tutorials
- **Manual export**: Run `npm run export-excel` in the backend directory
- **Script export**: Execute `node scripts/export-excel.js`

### API Endpoints
- **Health Check**: `GET /api/health`
- **Authentication**: `POST /api/auth/login`
- **Dashboard**: `GET /api/dashboard/overview`
- **Backup**: `POST /api/backup/create`
- **Export**: `POST /api/export/excel/all`

## Security Features

### Authentication & Authorization
- JWT-based authentication with 24-hour expiration
- Role-based access control (Admin, Doctor, Staff)
- Secure password hashing with bcrypt
- Protected API endpoints

### Data Protection
- Database encryption for sensitive data
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration for security

### Backup & Recovery
- Automated timestamped backups
- Secure backup storage
- One-click restore functionality
- Export capabilities for data portability

## Design System

### Color Palette
- **Primary**: Blue tones (#0ea5e9) for main actions
- **Secondary**: Gray tones (#64748b) for text and borders
- **Success**: Green tones (#22c55e) for positive actions
- **Warning**: Yellow tones (#f59e0b) for alerts
- **Accent**: Red tones (#ef4444) for errors

### Typography
- **Font Family**: San Francisco (system fonts fallback)
- **Hierarchy**: Clear size and weight variations
- **Readability**: High contrast and proper spacing

### Components
- **Glass Morphism**: Translucent backgrounds with backdrop blur
- **Rounded Corners**: Consistent border radius (12px, 16px, 24px)
- **Shadows**: Subtle depth with soft, medium, and large variants
- **Animations**: Smooth transitions and hover effects

## Contributing
1. Follow Apple's Human Interface Guidelines
2. Maintain the established design system
3. Use TypeScript for new components
4. Follow the existing code structure
5. Test thoroughly before submitting

## Development Guidelines

### Code Style
- Use functional components with hooks
- Implement proper error handling
- Follow React best practices
- Maintain consistent naming conventions

### Security
- Always validate user input
- Implement proper authentication checks
- Use environment variables for secrets
- Follow OWASP security guidelines

### Performance
- Implement lazy loading where appropriate
- Optimize database queries
- Use React.memo for expensive components
- Implement proper caching strategies

## Troubleshooting

### Common Issues
1. **Database connection errors**: Check if SQLite is properly initialized
2. **Authentication failures**: Verify JWT secret in environment variables
3. **CORS errors**: Ensure frontend URL is correctly configured
4. **Build errors**: Clear node_modules and reinstall dependencies

### Debug Mode
- Backend: Set `NODE_ENV=development` in .env
- Frontend: Use React Developer Tools and browser console

## License
This project is proprietary software for dental clinic management.

## Support
For technical support or questions, please refer to the documentation or contact the development team.

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Status**: Development in Progress
