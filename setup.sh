#!/bin/bash

# Dental Clinic Management System Setup Script
# This script will set up and run the entire system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check system requirements
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check if Docker is installed
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        print_status "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        print_status "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    # Check if Docker daemon is running
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "System requirements check passed!"
}

# Function to create environment files
create_env_files() {
    print_status "Creating environment files..."
    
    # Backend environment file
    if [ ! -f "backend/.env" ]; then
        cat > backend/.env << EOF
# Database Configuration
DATABASE_URL="postgresql://dental_user:dental_password@localhost:5432/dental_clinic"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here-change-in-production"
JWT_EXPIRES_IN="24h"

# Server Configuration
PORT=3001
NODE_ENV="development"

# Email Configuration (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH="./uploads"

# Security Configuration
CORS_ORIGIN="http://localhost:3000"
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Backup Configuration
BACKUP_PATH="./backups"
BACKUP_RETENTION_DAYS=30
EOF
        print_success "Created backend/.env file"
    else
        print_warning "backend/.env already exists, skipping..."
    fi
    
    # Frontend environment file
    if [ ! -f "frontend/.env" ]; then
        cat > frontend/.env << EOF
VITE_API_URL="http://localhost:3001/api"
VITE_APP_NAME="Dental Clinic Management"
EOF
        print_success "Created frontend/.env file"
    else
        print_warning "frontend/.env already exists, skipping..."
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install backend dependencies
    if [ -d "backend" ]; then
        print_status "Installing backend dependencies..."
        cd backend
        npm install
        cd ..
        print_success "Backend dependencies installed!"
    fi
    
    # Install frontend dependencies
    if [ -d "frontend" ]; then
        print_status "Installing frontend dependencies..."
        cd frontend
        npm install
        cd ..
        print_success "Frontend dependencies installed!"
    fi
}

# Function to build and start with Docker
start_with_docker() {
    print_status "Starting system with Docker..."
    
    # Build and start all services
    docker-compose up --build -d
    
    print_success "Docker services started!"
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Check service health
    check_service_health
}

# Function to start without Docker
start_without_docker() {
    print_status "Starting system without Docker..."
    
    # Start backend
    if [ -d "backend" ]; then
        print_status "Starting backend server..."
        cd backend
        npm run dev &
        BACKEND_PID=$!
        cd ..
        print_success "Backend started with PID: $BACKEND_PID"
    fi
    
    # Start frontend
    if [ -d "frontend" ]; then
        print_status "Starting frontend server..."
        cd frontend
        npm run dev &
        FRONTEND_PID=$!
        cd ..
        print_success "Frontend started with PID: $FRONTEND_PID"
    fi
    
    # Save PIDs for cleanup
    echo $BACKEND_PID > .backend.pid
    echo $FRONTEND_PID > .frontend.pid
    
    print_success "System started without Docker!"
    print_status "Backend PID: $BACKEND_PID"
    print_status "Frontend PID: $FRONTEND_PID"
}

# Function to check service health
check_service_health() {
    print_status "Checking service health..."
    
    # Check backend health
    if curl -f http://localhost:3001/health >/dev/null 2>&1; then
        print_success "Backend is healthy!"
    else
        print_warning "Backend health check failed"
    fi
    
    # Check frontend health
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        print_success "Frontend is healthy!"
    else
        print_warning "Frontend health check failed"
    fi
}

# Function to initialize database
initialize_database() {
    print_status "Initializing database..."
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 10
    
    # Run database migrations
    if [ -d "backend" ]; then
        cd backend
        print_status "Running database migrations..."
        npm run db:generate
        npm run db:migrate
        
        print_status "Seeding database with sample data..."
        npm run db:seed
        cd ..
        print_success "Database initialized successfully!"
    fi
}

# Function to show system status
show_status() {
    print_status "System Status:"
    echo "=================="
    
    # Docker services status
    if command_exists docker-compose; then
        echo "Docker Services:"
        docker-compose ps
        echo ""
    fi
    
    # Service URLs
    echo "Service URLs:"
    echo "- Frontend: http://localhost:3000"
    echo "- Backend API: http://localhost:3001"
    echo "- Database: localhost:5432"
    echo ""
    
    # Demo credentials
    echo "Demo Credentials:"
    echo "- Admin: admin@dentalclinic.com / admin123"
    echo "- Doctor: dr.smith@dentalclinic.com / doctor123"
    echo "- Staff: reception@dentalclinic.com / staff123"
    echo ""
}

# Function to stop system
stop_system() {
    print_status "Stopping system..."
    
    # Stop Docker services
    if command_exists docker-compose; then
        docker-compose down
        print_success "Docker services stopped!"
    fi
    
    # Stop local processes
    if [ -f ".backend.pid" ]; then
        BACKEND_PID=$(cat .backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID
            print_success "Backend stopped!"
        fi
        rm .backend.pid
    fi
    
    if [ -f ".frontend.pid" ]; then
        FRONTEND_PID=$(cat .frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill $FRONTEND_PID
            print_success "Frontend stopped!"
        fi
        rm .frontend.pid
    fi
    
    print_success "System stopped!"
}

# Function to show help
show_help() {
    echo "Dental Clinic Management System Setup Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  start       Start the system (default)"
    echo "  start-docker Start the system with Docker"
    echo "  start-local  Start the system without Docker"
    echo "  stop        Stop the system"
    echo "  status      Show system status"
    echo "  setup       Initial setup (install dependencies, create env files)"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0              # Start system (default)"
    echo "  $0 start-docker # Start with Docker"
    echo "  $0 stop         # Stop system"
    echo "  $0 status       # Show status"
}

# Main script logic
main() {
    case "${1:-start}" in
        "start")
            check_requirements
            create_env_files
            install_dependencies
            start_with_docker
            initialize_database
            show_status
            ;;
        "start-docker")
            check_requirements
            create_env_files
            start_with_docker
            initialize_database
            show_status
            ;;
        "start-local")
            create_env_files
            install_dependencies
            start_without_docker
            show_status
            ;;
        "stop")
            stop_system
            ;;
        "status")
            show_status
            ;;
        "setup")
            check_requirements
            create_env_files
            install_dependencies
            print_success "Setup completed! Run '$0 start' to start the system."
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
}

# Trap to cleanup on script exit
trap cleanup EXIT

# Cleanup function
cleanup() {
    # Remove temporary files
    rm -f .backend.pid .frontend.pid
}

# Run main function with all arguments
main "$@"
