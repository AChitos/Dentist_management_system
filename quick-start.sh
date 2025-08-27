#!/bin/bash

echo "🚀 Zendenta Next.js - Quick Start"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create database directory
echo "🗄️  Setting up database..."
mkdir -p database/backups database/exports

# Initialize database
echo "🔧 Initializing database..."
curl -X POST http://localhost:3000/api/init-db

# Start development server
echo "🚀 Starting development server..."
echo "📍 Frontend: http://localhost:3000"
echo "📍 API: http://localhost:3000/api"
echo "📍 Health Check: http://localhost:3000/api/health"
echo ""
echo "🔑 Default Login:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "🛑 Press Ctrl+C to stop the server"
echo ""

npm run dev
