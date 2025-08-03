const { SESClient, VerifyEmailIdentityCommand, GetSendQuotaCommand } = require('@aws-sdk/client-ses');

// AWS SES Client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function setupAWSSES() {
  console.log('🚀 AWS SES Setup Helper\n');

  // Check if AWS credentials are configured
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.log('❌ AWS credentials not found in environment variables');
    console.log('Please set the following environment variables:');
    console.log('- AWS_ACCESS_KEY_ID');
    console.log('- AWS_SECRET_ACCESS_KEY');
    console.log('- AWS_REGION (optional, defaults to us-east-1)');
    return;
  }

  try {
    // Get sending quota
    const quotaCommand = new GetSendQuotaCommand({});
    const quota = await sesClient.send(quotaCommand);
    
    console.log('✅ AWS SES Connection Successful!');
    console.log('\n📊 Current Sending Quota:');
    console.log(`- Max 24 Hour Send: ${quota.Max24HourSend}`);
    console.log(`- Max Send Rate: ${quota.MaxSendRate} emails/second`);
    console.log(`- Sent Last 24 Hours: ${quota.SentLast24Hours}`);
    
    if (quota.SentLast24Hours === 0) {
      console.log('\n🎉 You\'re in sandbox mode (new account)');
      console.log('You can only send emails to verified email addresses');
      console.log('To send to any email address, request production access');
    }

  } catch (error) {
    console.log('❌ AWS SES Connection Failed');
    console.log('Error:', error.message);
    console.log('\nPlease check your AWS credentials and permissions');
  }
}

async function verifyEmail(email) {
  if (!email) {
    console.log('❌ Please provide an email address to verify');
    console.log('Usage: node setup-aws-ses.js verify your-email@example.com');
    return;
  }

  try {
    const command = new VerifyEmailIdentityCommand({ EmailAddress: email });
    await sesClient.send(command);
    
    console.log(`✅ Verification email sent to ${email}`);
    console.log('Please check your email and click the verification link');
    console.log('After verification, you can use this email as a sender');
    
  } catch (error) {
    console.log('❌ Failed to send verification email');
    console.log('Error:', error.message);
  }
}

// Main execution
const command = process.argv[2];
const email = process.argv[3];

if (command === 'verify') {
  verifyEmail(email);
} else {
  setupAWSSES();
}

module.exports = { setupAWSSES, verifyEmail }; 