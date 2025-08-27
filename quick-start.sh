#!/bin/bash

# Zendenta Quick Start Script
# This script will help you get the dental clinic management system running quickly

echo "🚀 Welcome to Zendenta - Dental Clinic Management System"
echo "========================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    echo "   Please upgrade Node.js to continue."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
echo "✅ Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✅ Frontend dependencies installed"
echo ""

# Create environment file
echo "⚙️  Setting up environment configuration..."
cd ../backend
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Environment file created (.env)"
    echo "   Please review and edit .env if needed"
else
    echo "✅ Environment file already exists"
fi
echo ""

# Create necessary directories
echo "📁 Creating necessary directories..."
cd ..
mkdir -p database/backups
mkdir -p exports
echo "✅ Directories created"
echo ""

# Start backend server
echo "🚀 Starting backend server..."
cd backend
echo "   Backend will start on http://localhost:5001"
echo "   Press Ctrl+C to stop the server"
echo ""
npm run dev &

# Wait a moment for server to start
sleep 3

# Start frontend
echo "🌐 Starting frontend application..."
cd ../frontend
echo "   Frontend will open on http://localhost:3000"
echo "   Press Ctrl+C to stop the application"
echo ""
npm start

echo ""
echo "🎉 Zendenta is now running!"
echo ""
echo "📱 Access the application at: http://localhost:3000"
echo "🔑 Default login credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "🛑 To stop the system, press Ctrl+C in both terminal windows"
