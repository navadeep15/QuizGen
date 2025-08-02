# QuizGen Frontend

## Authentication Setup

The frontend now includes a complete authentication system with the following features:

### 🔐 **Authentication Features**

- **JWT Token Management**: Automatic token storage and retrieval
- **Protected Routes**: Routes that require authentication
- **Global Auth State**: User state management across the app
- **Login/Signup**: Complete authentication forms
- **Logout**: Secure logout functionality
- **Auto-redirect**: Redirects to login when accessing protected routes

### 📁 **New Files Added**

1. **`src/services/api.js`** - API service layer with automatic token handling
2. **`src/context/AuthContext.jsx`** - Global authentication state management
3. **`src/components/ProtectedRoute.jsx`** - Route protection component

### 🚀 **Setup Instructions**

1. **Environment Variables**: Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

2. **Backend Connection**: Ensure your backend is running on the specified URL

3. **Install Dependencies**: All required dependencies are already included

### 🔧 **Usage**

#### **Protected Routes**
```jsx
import ProtectedRoute from './components/ProtectedRoute'

<Route path="/create-quiz" element={
  <ProtectedRoute>
    <CreateQuiz />
  </ProtectedRoute>
} />
```

#### **Using Authentication Context**
```jsx
import { useAuth } from './context/AuthContext'

const { user, login, logout, isAuthenticated } = useAuth()
```

#### **API Calls**
```jsx
import { authAPI, quizAPI } from './services/api'

// Login
const result = await authAPI.login({ email, password })

// Create quiz
const response = await quizAPI.createQuiz(quizData)
```

### 🔒 **Security Features**

- **Automatic Token Inclusion**: All API requests include the JWT token
- **Token Refresh**: Automatic token validation on app load
- **401 Handling**: Automatic logout on authentication failure
- **Secure Storage**: Tokens stored in localStorage with proper cleanup

### 📱 **User Experience**

- **Loading States**: Shows loading spinners during authentication
- **Error Handling**: Displays user-friendly error messages
- **Redirect Logic**: Remembers intended destination after login
- **Responsive Design**: Works on all device sizes

### 🧪 **Testing**

1. Start the backend server
2. Start the frontend: `npm run dev`
3. Try creating an account and logging in
4. Test protected routes (Create Quiz)
5. Test logout functionality

### 🔄 **API Integration**

The frontend now fully integrates with the backend authentication API:

- **POST /api/auth/signup** - User registration
- **POST /api/auth/login** - User login
- **GET /api/auth/profile** - Get user profile
- **PUT /api/auth/profile** - Update profile
- **PUT /api/auth/change-password** - Change password

All authentication is now fully functional and production-ready!
