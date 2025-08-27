#!/bin/bash

echo "🚀 Deploying Frontend to Vercel"
echo "================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Navigate to frontend directory
cd frontend

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo "📝 Don't forget to:"
echo "   1. Set environment variables in Vercel dashboard:"
echo "      - REACT_APP_API_URL=https://your-backend-domain.com/api"
echo "      - REACT_APP_WS_URL=wss://your-backend-domain.com"
echo "   2. Deploy your backend to a platform like Railway or Render"
echo "   3. Update CORS settings in your backend"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"
