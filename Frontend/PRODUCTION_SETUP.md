# Production Setup Guide

## Environment Variables for Production

### Frontend Environment Variables

Create a `.env.production` file in the Frontend directory:

```env
# Your actual backend URL
VITE_API_URL=https://quizgen-4okk.onrender.com/api
```

### Backend Environment Variables

Create a `.env` file in the Backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGODB_URI=your-mongodb-atlas-uri

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# CORS Configuration
FRONTEND_URL=https://quiz-gen-rho.vercel.app
```

## Common Production Issues & Solutions

### 1. CORS Errors
**Problem**: `Access to fetch at 'https://backend.com/api/auth/login' from origin 'https://frontend.com' has been blocked by CORS policy`

**Solution**: 
- Add your frontend URL to the backend CORS configuration
- Update `FRONTEND_URL` environment variable in backend
- Ensure backend is deployed and accessible

### 2. API URL Not Found
**Problem**: `Failed to fetch` or `404 Not Found`

**Solution**:
- Check that `VITE_API_URL` is set correctly in frontend
- Verify backend is deployed and running
- Test backend health endpoint: `https://your-backend.com/health`

### 3. Authentication Issues
**Problem**: Login/signup not working in production

**Solution**:
- Check JWT_SECRET is set in backend
- Verify database connection
- Check browser console for API errors

## Deployment Checklist

### Frontend (Vercel/Netlify/Render)
- [ ] Set `VITE_API_URL` environment variable
- [ ] Build and deploy
- [ ] Test API connection

### Backend (Render/Railway/Heroku)
- [ ] Set all environment variables
- [ ] Deploy and verify health endpoint
- [ ] Test CORS with frontend URL
- [ ] Verify database connection

## Testing Production

1. **Health Check**: Visit `https://your-backend.com/health`
2. **API Test**: Try `https://your-backend.com/api/auth/login` (should return 400 for missing data)
3. **Frontend**: Test signup/login flow
4. **Console**: Check browser console for any errors

## Debug Commands

### Check Environment Variables
```bash
# Frontend
echo $VITE_API_URL

# Backend
echo $NODE_ENV
echo $FRONTEND_URL
```

### Test API Connection
```bash
curl -X GET https://your-backend.com/health
curl -X POST https://your-backend.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
``` 