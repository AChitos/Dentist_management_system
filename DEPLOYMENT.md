# Deployment Guide

## Overview
This guide covers deploying the Dentist Management System to production environments.

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- Git repository connected to Vercel
- Backend deployed and accessible

### Steps

1. **Prepare Environment Variables**
   ```bash
   # In Vercel dashboard, add these environment variables:
   REACT_APP_API_URL=https://your-backend-domain.com/api
   REACT_APP_WS_URL=wss://your-backend-domain.com
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Navigate to frontend directory
   cd frontend
   
   # Deploy
   vercel
   ```

3. **Automatic Deployments**
   - Connect your GitHub repository to Vercel
   - Every push to main branch triggers automatic deployment
   - Preview deployments for pull requests

## Backend Deployment Options

### Option 1: Railway (Recommended)
- **Pros**: Easy deployment, automatic HTTPS, good free tier
- **Cons**: Limited resources on free tier

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 2: Render
- **Pros**: Generous free tier, easy deployment
- **Cons**: Sleeps after 15 minutes of inactivity

```bash
# Connect GitHub repository
# Render will auto-deploy on push
```

### Option 3: DigitalOcean App Platform
- **Pros**: Reliable, scalable, good performance
- **Cons**: Paid service

### Option 4: Heroku
- **Pros**: Mature platform, good documentation
- **Cons**: No free tier anymore

## Environment Configuration

### Backend Environment Variables
```env
NODE_ENV=production
PORT=5001
JWT_SECRET=your-super-secret-jwt-key
DB_PATH=./database/dentist.db
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_WS_URL=wss://your-backend-domain.com
```

## Database Considerations

### SQLite in Production
- **Warning**: SQLite is not recommended for production
- **Issues**: File-based, no concurrent access, backup complexity

### Recommended Alternatives
1. **PostgreSQL** (Railway, Render, DigitalOcean)
2. **MySQL** (PlanetScale, DigitalOcean)
3. **MongoDB Atlas** (if switching to NoSQL)

### Migration Steps
1. Update database connection in `backend/database/connection.js`
2. Modify schema for your chosen database
3. Update backup/restore functions
4. Test thoroughly before switching

## Security Considerations

### Production Security
- Use strong JWT secrets
- Enable HTTPS everywhere
- Configure CORS properly
- Set up rate limiting
- Use environment variables for secrets
- Regular security updates

### CORS Configuration
```javascript
// In backend/server.js
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://your-frontend-domain.vercel.app',
  credentials: true
}));
```

## Monitoring and Maintenance

### Health Checks
- Backend: `/api/health`
- Frontend: Built-in Vercel monitoring

### Logs
- Backend: Use logging service (Winston, Bunyan)
- Frontend: Vercel function logs

### Backups
- Database: Automated backups (if using cloud database)
- Files: Cloud storage (AWS S3, Google Cloud Storage)

## Troubleshooting

### Common Issues
1. **CORS errors**: Check CORS_ORIGIN configuration
2. **API timeouts**: Increase timeout values
3. **Database connection**: Verify connection strings
4. **Environment variables**: Ensure all are set in Vercel

### Debug Commands
```bash
# Check backend health
curl https://your-backend-domain.com/api/health

# Check frontend build
cd frontend && npm run build

# Test API locally
curl http://localhost:5001/api/health
```

## Cost Estimation

### Free Tier Options
- **Vercel**: Free (frontend)
- **Railway**: $5/month (backend)
- **Render**: Free (backend, with limitations)

### Production Tier
- **Vercel**: $20/month (Pro plan)
- **Railway**: $20/month (Pro plan)
- **DigitalOcean**: $12/month (Basic plan)

## Next Steps
1. Deploy backend to chosen platform
2. Deploy frontend to Vercel
3. Configure environment variables
4. Test all functionality
5. Set up monitoring and alerts
6. Configure custom domain (optional)
