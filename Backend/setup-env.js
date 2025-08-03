const fs = require('fs');
const path = require('path');

console.log('🔧 QuizGen Environment Setup');
console.log('============================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env file already exists');
} else {
  console.log('📝 Creating .env file...');
  
  const envContent = `# QuizGen Environment Configuration

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/quizgen

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Development - Gmail)
# For development, you can use Gmail with app passwords
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Email Configuration (Production - AWS SES)
# Uncomment and configure these for production
# AWS_ACCESS_KEY_ID=your-aws-access-key
# AWS_SECRET_ACCESS_KEY=your-aws-secret-key
# AWS_REGION=us-east-1

# Environment
NODE_ENV=development

# Server Port
PORT=5000
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully');
}

console.log('\n📧 Email Setup Instructions:');
console.log('===========================');
console.log('1. For Development (Gmail):');
console.log('   - Set EMAIL_USER to your Gmail address');
console.log('   - Set EMAIL_PASSWORD to your Gmail app password');
console.log('   - Enable 2FA and generate app password in Google Account settings');
console.log('');
console.log('2. For Production (AWS SES):');
console.log('   - Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY');
console.log('   - Set AWS_REGION (default: us-east-1)');
console.log('   - Set NODE_ENV=production');
console.log('');
console.log('3. Optional: Set FRONTEND_URL to your frontend URL');
console.log('');
console.log('📖 For detailed setup instructions, see EMAIL_SETUP.md');
console.log('');
console.log('🚀 You can now start the server with: npm start'); 