const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendOtpEmail = async (toEmail, otp, type = 'registration') => {
  const subject = type === 'registration'
    ? 'Axsem Softwares - Email Verification OTP'
    : 'Axsem Softwares - Password Reset OTP';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 28px;">Axsem Softwares</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Partner Portal</p>
      </div>
      <div style="background: #fff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <h2 style="color: #1e1e2f; margin-top: 0;">${type === 'registration' ? 'Verify Your Email' : 'Reset Your Password'}</h2>
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
          ${type === 'registration'
            ? 'Thank you for registering with Axsem Softwares. Please use the following OTP to verify your email address:'
            : 'You requested a password reset. Please use the following OTP to proceed:'}
        </p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #6366f1;">${otp}</span>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          <strong>This OTP is valid for 10 minutes.</strong> Do not share this code with anyone.
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
          If you didn't request this OTP, please ignore this email or contact support.
        </p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Axsem Softwares" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject,
      html: htmlContent,
    });

    console.log(`OTP email sent to ${toEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Failed to send OTP email to ${toEmail}:`, error.message);
    throw error;
  }
};

module.exports = { sendOtpEmail };
