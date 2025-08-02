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
- **Database**: MongoDB (Atlas or local) with Mongoose  
- **Authentication**: JWT  
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

# Edit the `.env` file with your local or Atlas MongoDB URI and other config
```

### 3. Sample .env file

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=your-mongodb-uri-here

# JWT Configuration
JWT_SECRET=your-secret-key

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

> ⚠️ **Never commit your real `.env` file to version control. Use `.gitignore` to exclude it.**

### 4. Start Development Server

```bash
npm run dev
```

Visit: `http://localhost:5000`

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` – Register new user  
- `POST /api/auth/login` – User login  
- `GET /api/auth/profile` – Get user profile (protected)  
- `PUT /api/auth/profile` – Update profile (protected)  
- `PUT /api/auth/change-password` – Change password (protected)  

### Quiz Management
- `GET /api/quiz/public` – Get public quizzes  
- `POST /api/quiz` – Create new quiz (protected)  
- `GET /api/quiz/:quizId` – Get quiz for taking  
- `POST /api/quiz/:quizId/submit` – Submit quiz attempt (protected)  
- `PUT /api/quiz/:quizId` – Update quiz (protected)  
- `DELETE /api/quiz/:quizId` – Delete quiz (protected)  

### User Statistics
- `GET /api/user/stats` – Get user statistics (protected)  
- `GET /api/user/history` – Get quiz history (protected)  
- `GET /api/user/leaderboard` – Get leaderboard (protected)  
- `GET /api/user/created-quizzes` – Get user’s created quizzes (protected)  

### Health Check
- `GET /health` – Health check endpoint  
- `GET /` – API status  
