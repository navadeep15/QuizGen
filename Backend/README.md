# QuizGen Backend API

A Node.js/Express backend API for the QuizGen application with MongoDB database.

## 🚀 Features

- **Authentication System**: JWT-based authentication with bcrypt password hashing
- **Quiz Management**: Create, read, update, delete quizzes with questions and options
- **User Management**: User profiles, statistics, and quiz history
- **Leaderboard System**: Track user performance and rankings
- **MVC Architecture**: Clean separation of concerns
- **RESTful API**: Standard REST endpoints
- **Error Handling**: Comprehensive error handling and validation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **CORS**: Cross-Origin Resource Sharing support

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd Backend
npm install
```

### 2. Environment Setup

```bash
# Copy environment variables template
cp config.env.example .env

# Edit .env with your configuration
```

### 3. Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/quizgen

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Quiz Management
- `GET /api/quiz/public` - Get public quizzes
- `POST /api/quiz` - Create new quiz (protected)
- `GET /api/quiz/:quizId` - Get quiz for taking
- `POST /api/quiz/:quizId/submit` - Submit quiz attempt (protected)
- `PUT /api/quiz/:quizId` - Update quiz (protected)
- `DELETE /api/quiz/:quizId` - Delete quiz (protected)

### User Statistics
- `GET /api/user/stats` - Get user statistics (protected)
- `GET /api/user/history` - Get quiz history (protected)
- `GET /api/user/leaderboard` - Get leaderboard (protected)
- `GET /api/user/created-quizzes` - Get user's created quizzes (protected)

### Health Check
- `GET /health` - Health check endpoint
- `GET /` - API status

## 🚀 Deployment on Render

### 1. Prepare for Deployment

1. **MongoDB Atlas Setup**:
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get your connection string
   - Replace `<username>`, `<password>`, and `<cluster>` with your values

2. **Environment Variables for Render**:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quizgen?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```

### 2. Deploy on Render

1. **Connect Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**:
   - **Name**: `quizgen-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `Backend` (if backend is in a subdirectory)

3. **Environment Variables**:
   - Add all environment variables from step 1
   - Render will automatically set `PORT` and `NODE_ENV`

4. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically deploy your application

### 3. Post-Deployment

1. **Test Health Endpoint**:
   ```
   GET https://your-backend-url.onrender.com/health
   ```

2. **Update Frontend**:
   - Update your frontend API base URL to point to the Render URL
   - Update CORS settings if needed

## 📁 Project Structure

```
Backend/
├── controllers/          # Business logic
│   ├── authController.js
│   ├── quizController.js
│   └── userController.js
├── middleware/           # Custom middleware
│   └── auth.js
├── models/              # Database models
│   ├── User.js
│   └── Quiz.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── quizRoutes.js
│   └── userRoutes.js
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
├── config.env.example   # Environment variables template
└── README.md           # This file
```

## 🔧 Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build script (no-op for Node.js)

### Database Models

#### User Model
- Authentication fields (email, password)
- Profile information (firstName, lastName)
- Quiz tracking (quizzesCreated, quizzesTaken)
- Role-based access control

#### Quiz Model
- Quiz metadata (title, description, category)
- Questions with multiple-choice options
- Attempt tracking and statistics
- Public/private visibility

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation and sanitization
- Error handling without exposing sensitive information

## 📝 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License. 