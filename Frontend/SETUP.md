# Authentication Setup Guide

## Quick Setup

1. **Create Environment File**
   Create a `.env` file in the Frontend directory with:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

2. **Start Backend**
   ```bash
   cd Backend
   npm install
   npm run dev
   ```

3. **Start Frontend**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

## What's New

✅ **Complete Authentication System**
- JWT token management
- Protected routes
- Global auth state
- Login/Signup forms
- Logout functionality

✅ **API Integration**
- Automatic token inclusion
- Error handling
- Loading states
- Redirect logic

✅ **Security Features**
- Token validation
- Auto-logout on 401
- Secure storage
- Route protection

## Testing the Authentication

1. **Create Account**: Go to `/signup` and create a new account
2. **Login**: Go to `/login` and sign in
3. **Protected Route**: Try accessing `/create-quiz` (should redirect to login if not authenticated)
4. **Logout**: Use the logout button in the header

## Files Added/Modified

### New Files:
- `src/services/api.js` - API service layer
- `src/context/AuthContext.jsx` - Authentication context
- `src/components/ProtectedRoute.jsx` - Route protection

### Modified Files:
- `src/App.jsx` - Added AuthProvider and protected routes
- `src/components/Login.jsx` - Real API integration
- `src/components/SignUp.jsx` - Real API integration
- `src/components/Home.jsx` - Added user state and logout
- `src/components/CreateQuiz.jsx` - API integration

## Environment Variables

The frontend needs these environment variables:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, change to your deployed backend URL.

## Troubleshooting

1. **CORS Issues**: Ensure backend CORS is configured for frontend URL
2. **API Connection**: Check that backend is running on correct port
3. **Token Issues**: Clear localStorage if authentication gets stuck
4. **Environment**: Make sure `.env` file is in the Frontend directory

The authentication system is now fully functional! 🎉 