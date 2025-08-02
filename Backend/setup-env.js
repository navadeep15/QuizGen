#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 QuizGen MongoDB Atlas Setup\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('⚠️  .env file already exists!');
  rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      createEnvFile();
    } else {
      console.log('Setup cancelled.');
      rl.close();
    }
  });
} else {
  createEnvFile();
}

function createEnvFile() {
  console.log('\n📝 Please provide the following information:\n');
  
  rl.question('MongoDB Atlas Connection String: ', (mongoUri) => {
    rl.question('JWT Secret (leave empty for random): ', (jwtSecret) => {
      rl.question('Frontend URL (default: http://localhost:5173): ', (frontendUrl) => {
        rl.question('Port (default: 5000): ', (port) => {
          
          // Generate random JWT secret if not provided
          if (!jwtSecret) {
            jwtSecret = require('crypto').randomBytes(64).toString('hex');
            console.log(`\n🔑 Generated JWT Secret: ${jwtSecret}`);
          }
          
          // Set defaults
          frontendUrl = frontendUrl || 'http://localhost:5173';
          port = port || '5000';
          
          // Create .env content
          const envContent = `# Server Configuration
PORT=${port}
NODE_ENV=development

# Database Configuration
MONGODB_URI=${mongoUri}

# JWT Configuration
JWT_SECRET=${jwtSecret}

# CORS Configuration
FRONTEND_URL=${frontendUrl}

# Render specific variables (will be set automatically by Render)
# PORT (set by Render)
# NODE_ENV=production (set by Render)
`;
          
          // Write .env file
          fs.writeFileSync(envPath, envContent);
          
          console.log('\n✅ .env file created successfully!');
          console.log('\n📋 Next steps:');
          console.log('1. Install dependencies: npm install');
          console.log('2. Start the server: npm run dev');
          console.log('3. Test the connection: http://localhost:' + port + '/health');
          
          rl.close();
        });
      });
    });
  });
}

rl.on('close', () => {
  process.exit(0);
}); 