# Digital E-Panchayat Deployment Guide

This guide provides step-by-step instructions for deploying the Digital E-Panchayat web application to Render (backend) and Vercel (frontend).

## Backend Deployment (Render)

### Prerequisites
1. GitHub repository with the backend code
2. MongoDB Atlas database connection string
3. Render account

### Setup Instructions

1. Push the backend code to GitHub if not already done
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure the following settings:

### Configuration

- **Root Directory**: `/backend`
- **Runtime**: Node.js
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Auto-Deploy**: Yes (recommended)

### Environment Variables

Add the following environment variables in the Render dashboard:

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_for_authentication
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
PORT=3002
```

### CORS Configuration

The backend is configured to allow requests from:
- Local development URLs (localhost)
- The Vercel frontend domain (set via `FRONTEND_URL` environment variable)

## Frontend Deployment (Vercel)

### Prerequisites
1. GitHub repository with the frontend code
2. Vercel account

### Setup Instructions

1. Push the frontend code to GitHub if not already done
2. Create a new Project on Vercel
3. Connect your GitHub repository
4. Configure the following settings:

### Configuration

- **Root Directory**: `/frontend`
- **Framework Preset**: Next.js
- **Build Command**: Automatically detected as `next build`
- **Output Directory**: `.next`
- **Auto-Deploy**: Yes (recommended)

### Environment Variables

Add the following environment variable in the Vercel dashboard:

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com/api
```

Replace `your-backend.onrender.com` with your actual Render backend URL.

## Final Checks

After deployment, verify the following:

1. ✅ Frontend routes load correctly (/services, /dashboard, /login)
2. ✅ Backend endpoints respond correctly (certificates, grievances, schemes, etc.)
3. ✅ API integration between frontend and backend works
4. ✅ PDF/JPG generation and download functionality
5. ✅ Mobile responsiveness
6. ✅ User authentication and authorization

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `FRONTEND_URL` is correctly set in Render environment variables
2. **API Connection Issues**: Verify `NEXT_PUBLIC_API_BASE_URL` is correctly set in Vercel
3. **Database Connection**: Check `MONGO_URI` format and credentials
4. **Authentication Issues**: Verify `JWT_SECRET` is consistent between development and production

### Useful Commands for Testing

Backend (in `/backend` directory):
```bash
# Test build locally
npm run build

# Test start locally
npm run start
```

Frontend (in `/frontend` directory):
```bash
# Test build locally
npm run build

# Test start locally
npm run start
```

## Production URLs

- **Backend API**: https://your-backend.onrender.com/api/
- **Frontend App**: https://your-frontend.vercel.app/

## Security Considerations

1. Use HTTPS for all production connections
2. Keep environment variables secure and never commit them to version control
3. Regularly rotate JWT secrets and database credentials
4. Monitor Render and Vercel logs for suspicious activity