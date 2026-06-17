export function generateForgotPasswordEmailTemplate(resetPasswordUrl) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333333; background-color: #ffffff; line-height: 1.5;">
    <div style="max-width: 500px; margin: 0 auto;">
        
        <h2 style="font-size: 20px; margin-bottom: 24px; color: #111111;">Password Reset</h2>
        
        <p>Hello,</p>
        
        <p>We received a request to reset your password. Click the link below to choose a new one:</p>
        
        <p style="margin: 24px 0;">
            <a href="${resetPasswordUrl}" style="display: inline-block; padding: 12px 24px; color: #ffffff; background-color: #000000; text-decoration: none; border-radius: 4px; font-weight: 500;">
                Reset Password
            </a>
        </p>
        
        <p style="color: #666666; font-size: 14px;">
            If you didn't request this, you can safely ignore this email. This link will expire shortly.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 32px 0;">
        
        <p style="color: #999999; font-size: 12px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetPasswordUrl}" style="color: #0066cc;">${resetPasswordUrl}</a>
        </p>
        
    </div>
</body>
</html>
    `;
}


