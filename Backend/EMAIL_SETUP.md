# Email Setup Guide for QuizGen

## Overview
QuizGen now supports email notifications for quiz assignments and completions using **AWS SES** for production and **Gmail** for development. AWS SES is cost-effective, reliable, and has excellent deliverability.

## Email Configuration

### 1. Environment Variables
Add these variables to your `.env` file:

```env
# Frontend URL
FRONTEND_URL=https://quiz-gen-rho.vercel.app

# Development (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Production (AWS SES) - Add these for production
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
```

## AWS SES Setup (Recommended for Production)

### Step 1: Create AWS Account
1. Go to [AWS Console](https://aws.amazon.com/)
2. Create a free account (12 months free tier)
3. Navigate to SES (Simple Email Service)

### Step 2: Verify Email Addresses
1. In AWS SES Console, go to "Verified identities"
2. Click "Create identity"
3. Choose "Email address"
4. Enter your email (e.g., `noreply@yourdomain.com`)
5. Check your email and click the verification link

### Step 3: Create IAM User
1. Go to IAM Console
2. Create a new user with programmatic access
3. Attach the `AmazonSESFullAccess` policy
4. Save the Access Key ID and Secret Access Key

### Step 4: Move Out of Sandbox (Optional)
- **Sandbox Mode**: Can only send to verified email addresses
- **Production Mode**: Can send to any email address
- To move out of sandbox, submit a request in SES Console

### Step 5: Update Environment Variables
```env
# Production Configuration
NODE_ENV=production
AWS_ACCESS_KEY_ID=AKIA...your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
FRONTEND_URL=https://quiz-gen-rho.vercel.app
```

## Gmail Setup (Development)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled

### Step 2: Generate App Password
1. Go to Google Account settings
2. Navigate to Security → 2-Step Verification → App passwords
3. Generate a new app password for "Mail"
4. Use this password in your `EMAIL_PASSWORD` environment variable

### Step 3: Development Environment Variables
```env
# Development Configuration
NODE_ENV=development
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
FRONTEND_URL=http://localhost:5173
```

## Email Templates

The system includes three types of emails:

### 1. Quiz Assignment Email
- Sent to users when a quiz is assigned to them
- Includes quiz details and dashboard link
- Professional HTML template

### 2. Quiz Completion Email
- Sent to users when they complete an assigned quiz
- Includes score and results
- Sent to both user and admin

### 3. Assignment Summary Email
- Sent to admin when quiz assignment is completed
- Lists all assigned users
- Provides dashboard link

## Testing Email Functionality

### 1. Test Assignment
1. Create a quiz
2. Assign it to a user by email
3. Check if assignment email is sent
4. Check if admin summary email is sent

### 2. Test Completion
1. Have user complete the assigned quiz
2. Check if completion emails are sent to both user and admin

### 3. Check Email Logs
Monitor console logs for email sending status:
```
Quiz assignment email sent: <message-id>
Assignment notification email sent to admin: <message-id>
Quiz completion email sent: <message-id>
```

## AWS SES Benefits

### Cost-Effective
- **Free Tier**: 62,000 emails/month when sent from EC2
- **Pay-as-you-go**: $0.10 per 1,000 emails after free tier
- **No monthly fees**

### High Deliverability
- **99%+ delivery rate** to inbox
- **Built-in reputation management**
- **Automatic bounce and complaint handling**

### Easy Setup
- **Simple API integration**
- **Automatic scaling**
- **Built-in monitoring**

## Troubleshooting

### Common Issues

#### 1. AWS SES Errors
- **"Email address not verified"**: Add recipient email to verified identities
- **"Sending quota exceeded"**: Request production access
- **"Invalid credentials"**: Check AWS access keys

#### 2. Gmail Errors (Development)
- **"Invalid login"**: Check if 2FA is enabled
- **"Authentication failed"**: Use app-specific password
- **"Less secure app access"**: Enable 2FA and use app password

#### 3. General Email Issues
- **Emails not sending**: Check environment variables
- **Emails going to spam**: Use verified sender addresses
- **Rate limiting**: Implement delays between sends

### Debug Mode
Enable debug logging by adding to your `.env`:
```env
EMAIL_DEBUG=true
```

## Security Considerations

1. **Never commit AWS credentials to version control**
2. **Use IAM roles with minimal permissions**
3. **Enable AWS CloudTrail for audit logs**
4. **Use verified sender addresses**
5. **Implement rate limiting for email sending**

## Production Best Practices

1. **Use AWS SES for production** (cost-effective and reliable)
2. **Verify your domain** for better deliverability
3. **Set up bounce and complaint handling**
4. **Monitor sending statistics**
5. **Use SES Configuration Sets** for tracking

## Example Environment Configuration

```env
# Development (Gmail)
NODE_ENV=development
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173

# Production (AWS SES)
NODE_ENV=production
AWS_ACCESS_KEY_ID=AKIA...your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
FRONTEND_URL=https://quiz-gen-rho.vercel.app
```

## Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify your AWS credentials and permissions
3. Test with a simple email first
4. Check AWS SES documentation and troubleshooting guides 