const nodemailer = require('nodemailer');

// Create transporter (Gmail only)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
  });
};

// Send quiz assignment email
const sendQuizAssignmentEmail = async (userEmail, userName, quizTitle, assignedBy, frontendUrl) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@quizgen.com',
      to: userEmail,
      subject: `Quiz Assignment: ${quizTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #007bff; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">QuizGen</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              You have been assigned a new quiz by <strong>${assignedBy}</strong>.
            </p>
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
              <h3 style="color: #007bff; margin: 0 0 10px 0;">Quiz Details</h3>
              <p style="color: #333; margin: 0; font-size: 18px; font-weight: bold;">${quizTitle}</p>
            </div>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Please log in to your QuizGen account to take this quiz. The quiz will be available in your dashboard.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${frontendUrl}/dashboard" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
            <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                If you have any questions, please contact your quiz administrator.
              </p>
              <p style="color: #999; font-size: 14px; margin: 10px 0 0 0;">
                This is an automated message from QuizGen. Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Quiz assignment email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending quiz assignment email:', error);
    return { success: false, error: error.message };
  }
};

// Send quiz completion email
const sendQuizCompletionEmail = async (userEmail, userName, quizTitle, score, totalQuestions, assignedBy) => {
  try {
    const transporter = createTransporter();
    const percentage = Math.round((score / totalQuestions) * 100);

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@quizgen.com',
      to: userEmail,
      subject: `Quiz Completed: ${quizTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">QuizGen</h1>
          </div>
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Congratulations ${userName}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              You have successfully completed the quiz assigned by <strong>${assignedBy}</strong>.
            </p>
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="color: #28a745; margin: 0 0 15px 0;">Quiz Results</h3>
              <p style="color: #333; margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">${quizTitle}</p>
              <p style="color: #666; margin: 0; font-size: 16px;">Score: ${score}/${totalQuestions} (${percentage}%)</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" 
                 style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                View Results
              </a>
            </div>
            <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                Keep up the great work! You can view your detailed results in your dashboard.
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Quiz completion email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending quiz completion email:', error);
    return { success: false, error: error.message };
  }
};

// Send quiz assignment summary to admin
const sendAssignmentNotificationToAdmin = async (adminEmail, adminName, quizTitle, assignedUsers) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@quizgen.com',
      to: adminEmail,
      subject: `Quiz Assignment Summary: ${quizTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #007bff; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">QuizGen</h1>
          </div>
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Quiz Assignment Summary</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Hello ${adminName}, your quiz has been successfully assigned to ${assignedUsers.length} user(s).
            </p>
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
              <h3 style="color: #007bff; margin: 0 0 15px 0;">Assignment Details</h3>
              <p style="color: #333; margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">${quizTitle}</p>
              <p style="color: #666; margin: 0; font-size: 16px;">Users assigned: ${assignedUsers.length}</p>
            </div>
            <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="color: #1976d2; margin: 0 0 10px 0;">Assigned Users:</h4>
              <ul style="color: #666; margin: 0; padding-left: 20px;">
                                 ${assignedUsers.map(user => `<li>${user.email}</li>`).join('')}
              </ul>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                View Dashboard
              </a>
            </div>
            <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                You will be notified when users complete the quiz.
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Assignment notification email sent to admin:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending assignment notification to admin:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendQuizAssignmentEmail,
  sendQuizCompletionEmail,
  sendAssignmentNotificationToAdmin
};
