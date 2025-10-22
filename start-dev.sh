#!/bin/bash

# Script to start both backend and frontend in development mode

echo "🚀 Starting Clinic Management System Development Environment"
echo "=================================================="

# Check if Docker is running (for PostgreSQL)
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    echo "   You can start Docker Desktop or use: sudo systemctl start docker"
    exit 1
fi

# Start PostgreSQL with Docker if not already running
if ! docker ps | grep -q postgres-clinic; then
    echo "📦 Starting PostgreSQL database..."
    docker run --name postgres-clinic -e POSTGRES_PASSWORD=password -e POSTGRES_DB=clinic_db -p 5432:5432 -d postgres:13

    if [ $? -eq 0 ]; then
        echo "✅ PostgreSQL started successfully"
    else
        echo "❌ Failed to start PostgreSQL"
        exit 1
    fi
else
    echo "✅ PostgreSQL is already running"
fi

# Backend setup
echo ""
echo "🔧 Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

echo "🔄 Generating Prisma client..."
npm run prisma:generate

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file for backend..."
    cat > .env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=clinic_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Application Configuration
NODE_ENV=development
PORT=3000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001
EOF
    echo "✅ Created .env file for backend"
fi

echo "🚀 Starting backend server..."
npm run start:dev &
BACKEND_PID=$!

cd ..
echo "✅ Backend started (PID: $BACKEND_PID)"

# Frontend setup
echo ""
echo "🔧 Setting up Frontend..."
cd website

if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Create .env.local file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file for frontend..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1" > .env.local
    echo "✅ Created .env.local file for frontend"
fi

echo "🚀 Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

cd ..
echo "✅ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "🎉 Development environment is ready!"
echo "📱 Frontend: http://localhost:3001"
echo "🔌 Backend API: http://localhost:3000"
echo "📚 API Documentation: http://localhost:3000/api/docs"
echo ""
echo "📋 Next steps:"
echo "1. Open http://localhost:3001 in your browser"
echo "2. Try registering a new account"
echo "3. Try logging in"
echo "4. Visit /dashboard to test protected routes"
echo ""
echo "🛑 To stop both servers, press Ctrl+C"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
