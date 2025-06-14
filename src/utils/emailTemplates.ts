export const createWelcomeEmailTemplate = (userName: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Thrive Perinatal</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .footer { padding: 20px; text-align: center; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Thrive Perinatal</h1>
    </div>
    <div class="content">
      <h2>Hello ${userName}!</h2>
      <p>Welcome to Thrive Perinatal. We're excited to have you on board.</p>
      <p>You can now access your dashboard and start managing your client relationships effectively.</p>
    </div>
    <div class="footer">
      <p>© 2024 Thrive Perinatal. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const createAssessmentNotificationTemplate = (
  clientName: string,
  assessmentTitle: string,
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Assessment Available</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #10b981; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .footer { padding: 20px; text-align: center; color: #666; }
    .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Assessment Available</h1>
    </div>
    <div class="content">
      <h2>Hello ${clientName}!</h2>
      <p>A new assessment &quot;${assessmentTitle}&quot; has been assigned to you.</p>
      <p>Please log in to your account to complete the assessment.</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="#" class="button">Complete Assessment</a>
      </p>
    </div>
    <div class="footer">
      <p>© 2024 Thrive Perinatal. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const createPasswordResetTemplate = (resetLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Password Reset Request</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .footer { padding: 20px; text-align: center; color: #666; }
    .button { display: inline-block; padding: 12px 24px; background: #ef4444; color: white; text-decoration: none; border-radius: 5px; }
    .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <h2>Reset Your Password</h2>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </p>
      <div class="warning">
        <strong>Security Notice:</strong> This link will expire in 24 hours. If you didn't request this reset, please ignore this email.
      </div>
    </div>
    <div class="footer">
      <p>© 2024 Thrive Perinatal. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const createFormEmailTemplate = (
  type: "assessment" | "feedback",
  formLink: string,
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${type === "assessment" ? "Please complete your assessment" : "We'd love your feedback"}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .footer { padding: 20px; text-align: center; color: #666; }
    .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${type === "assessment" ? "Assessment Request" : "Feedback Request"}</h1>
    </div>
    <div class="content">
      <h2>Hello,</h2>
      <p>Please complete the following ${type} form:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${formLink}" class="button">Start ${type} form</a>
      </p>
      <p>Thank you,<br/>Thrive Perinatal Team</p>
    </div>
    <div class="footer">
      <p>© 2024 Thrive Perinatal. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
