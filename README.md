# QuizGen - Quiz Management System

A comprehensive quiz creation and assignment platform built with React.js, Node.js, Express.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd QuizGen
   ```

2. **Setup Backend**
   ```bash
   cd Backend
   npm install
   npm run setup
   ```
   This will create a `.env` file with default configuration.

3. **Setup Frontend**
   ```bash
   cd ../Frontend
   npm install
   ```

### Running the Application

#### Option 1: Separate Terminals (Recommended)
```bash
# Terminal 1 - Backend
cd QuizGen/Backend
npm start

# Terminal 2 - Frontend  
cd QuizGen/Frontend
npm run dev
```

#### Option 2: PowerShell (Windows) - Use Separate Windows
```powershell
# Backend (Window 1)
cd "C:\Users\chowd\Downloads\dev op\QuizGen\Backend"
npm start

# Frontend (Window 2)
cd "C:\Users\chowd\Downloads\dev op\QuizGen\Frontend"
npm run dev
```

#### Option 3: Command Prompt (Windows)
```cmd
# Backend
cd "C:\Users\chowd\Downloads\dev op\QuizGen\Backend"
npm start

# Frontend (in new command prompt window)
cd "C:\Users\chowd\Downloads\dev op\QuizGen\Frontend"
npm run dev
```

## 🔧 Configuration

### Environment Variables

The backend will create a `.env` file automatically. You can customize it:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/quizgen

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Email Configuration (Development)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Email Configuration (Production)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Environment
NODE_ENV=development
PORT=5000
```

### Email Setup

#### Development (Gmail)
1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password for "Mail"
3. Set `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`

#### Production (AWS SES)
1. Create AWS account and verify email addresses
2. Create IAM user with SES permissions
3. Set AWS credentials in `.env`
4. Set `NODE_ENV=production`

## 🎯 Features

### Quiz Management
- ✅ Create and edit quizzes
- ✅ Multiple choice questions
- ✅ Time limits and difficulty levels
- ✅ Public and private quizzes

### Quiz Assignment System
- ✅ Assign quizzes to specific users
- ✅ Email notifications for assignments
- ✅ Track assignment status (pending/completed/expired)
- ✅ View assignment results

### User Management
- ✅ User registration and authentication
- ✅ Dashboard with quiz statistics
- ✅ Quiz history and results
- ✅ Profile management

### Email Notifications
- ✅ Quiz assignment emails
- ✅ Quiz completion notifications
- ✅ Admin notifications

## 🐛 Recent Fixes

### Fixed Issues:
1. **Quiz Assignment Navigation**: Fixed the issue where "Take Quiz" was going to random quizzes instead of assigned ones
   - Added new endpoint `/quiz/assigned/:quizId` for proper validation
   - Updated frontend to use `getAssignedQuiz()` instead of `getQuiz()`
   - Added assignment validation and expiration checks

2. **Quiz Submission Errors**: Fixed issues with quiz submission for assigned quizzes
   - Updated backend to properly check assignment status
   - Added better error handling and debugging
   - Fixed access control for assigned quizzes

3. **Navigation After Quiz Creation**: Fixed navigation after creating quizzes
   - Now goes to dashboard instead of random quiz page

4. **Nodemailer Configuration**: Improved email service error handling
   - Added graceful handling of missing environment variables
   - Better error messages and logging
   - Mock email service when not configured

5. **PowerShell Compatibility**: Fixed command execution issues
   - Provided alternative commands for different shells
   - Added proper path handling for Windows

## 📁 Project Structure

```
QuizGen/
├── Backend/
│   ├── controllers/     # API controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Authentication middleware
│   ├── services/       # Email service
│   └── server.js       # Main server file
├── Frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── services/   # API services
│   │   └── context/    # React context
│   └── package.json
└── README.md
```

## 🔍 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Quizzes
- `GET /api/quiz/public` - Get public quizzes
- `POST /api/quiz` - Create quiz
- `GET /api/quiz/assigned` - Get assigned quizzes
- `GET /api/quiz/assigned/:quizId` - Get specific assigned quiz
- `POST /api/quiz/:quizId/submit` - Submit quiz answers

### Users
- `GET /api/user/stats` - Get user statistics
- `GET /api/user/history` - Get quiz history

## 🚨 Troubleshooting

### Common Issues:

1. **"&&" not recognized in PowerShell**
   - Use separate terminals or use `;` instead of `&&`
   - Or use Command Prompt instead of PowerShell

2. **Quiz submission errors**
   - Check browser console for detailed error messages
   - Ensure user is properly assigned to the quiz
   - Verify backend is running on port 5000

3. **Email errors**
   - Check `.env` file configuration
   - Ensure email credentials are correct
   - For Gmail, use app passwords, not regular passwords

4. **Database connection issues**
   - Verify MongoDB is running
   - Check `MONGODB_URI` in `.env`
   - For Atlas, ensure IP is whitelisted

5. **Port already in use**
   - Change `PORT` in `.env`
   - Or kill existing processes on port 5000/5173

### Testing the Quiz Assignment Flow:

1. **Create a quiz** as an admin user
2. **Assign the quiz** to another user via email
3. **Login as the assigned user**
4. **Go to "Assigned Quizzes"** - should see the quiz
5. **Click "Start Quiz"** - should load the correct quiz
6. **Complete the quiz** - should submit successfully
7. **View results** - should show in Dashboard and Results page

### Getting Help:
- Check the console for error messages
- Verify all environment variables are set
- Ensure all dependencies are installed
- Check network connectivity for external services

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Verify your configuration matches the examples
4. Ensure all prerequisites are installed

## 🎉 Success!

Once everything is running:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- Health Check: http://localhost:5000/health

The application should now work correctly with:
- ✅ Proper quiz assignment navigation
- ✅ Successful quiz submission and results
- ✅ Email notifications (when configured)
- ✅ All core functionalities working 
