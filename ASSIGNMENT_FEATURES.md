# Quiz Assignment Features

This document describes the new quiz assignment functionality that allows users to assign quizzes to other users and track their completion.

## Features

### 1. Assign Quizzes to Users
- **Location**: `/assign-quiz`
- **Functionality**: 
  - Select from your created quizzes
  - Enter email addresses of users to assign to
  - Send email notifications to assigned users
  - Track assignment status

### 2. View Assigned Quizzes
- **Location**: `/assigned-quizzes`
- **Functionality**:
  - View all quizzes assigned to you
  - See assignment status (pending, completed, expired)
  - View scores for completed quizzes
  - Start taking pending quizzes

### 3. Take Assigned Quizzes
- **Location**: `/take-quiz/:quizId`
- **Functionality**:
  - Interactive quiz interface
  - Timer support
  - Progress tracking
  - Immediate results display
  - Navigation between questions

### 4. Enhanced Results Page
- **Location**: `/results`
- **Functionality**:
  - Tabbed interface for all quizzes vs assigned quizzes
  - Performance statistics
  - Detailed result breakdown
  - Assignment information for assigned quizzes

## User Flow

### For Quiz Creators (Admins):
1. Create a quiz using the Create Quiz feature
2. Go to Assign Quiz page
3. Select the quiz and enter user email addresses
4. Users receive email notifications
5. Track completion and results

### For Assigned Users:
1. Receive email notification about assigned quiz
2. Log in to the system
3. Navigate to "Assigned Quizzes" from dashboard
4. Click "Start Quiz" on pending assignments
5. Complete the quiz with timer and progress tracking
6. View immediate results and detailed breakdown
7. Check comprehensive results in the Results page

## Technical Implementation

### Frontend Components:
- `AssignedQuizzes.jsx` - Display assigned quizzes with status
- `TakeAssignedQuiz.jsx` - Interactive quiz taking interface
- Updated `Results.jsx` - Enhanced results with assignment data
- Updated `Dashboard.jsx` - Added navigation to assigned quizzes

### Backend Endpoints:
- `GET /api/quiz/assigned` - Get user's assigned quizzes
- `GET /api/quiz/assignments/results` - Get assignment results
- Updated `POST /api/quiz/:quizId/assign` - Enhanced assignment with email notifications
- Updated `POST /api/quiz/:quizId/submit` - Enhanced submission with assignment tracking

### Database Models:
- `QuizAssignment` - Tracks quiz assignments with status, scores, and timestamps
- Enhanced `User` model - Tracks quiz history and assignments
- Enhanced `Quiz` model - Supports assignment functionality

## Email Notifications

The system sends email notifications for:
- Quiz assignment notifications to users
- Assignment summary to quiz creators
- Quiz completion notifications to both user and admin

## Status Tracking

Quiz assignments have three statuses:
- **Pending**: Quiz assigned but not yet taken
- **Completed**: Quiz taken and scored
- **Expired**: Quiz past due date (if time limit set)

## Security Features

- Authentication required for all assignment features
- Users can only access their own assigned quizzes
- Quiz creators can only assign their own quizzes
- Assignment status prevents duplicate submissions

## Future Enhancements

- Quiz expiration dates
- Bulk assignment features
- Advanced analytics and reporting
- Assignment templates
- Integration with external learning management systems 