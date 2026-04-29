const { getFromHeader, sendMailWithFallback } = require("./emailTransport");

const buildOtpMail = (toEmail, otp, role) => ({
  from: getFromHeader(),
  to: toEmail,
  subject: "UrbanEase - Your OTP Verification Code",
  html: `
    <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
      <h2 style="color:#4F46E5;">UrbanEase</h2>
      <p>Hello <strong>${role}</strong>,</p>
      <p>Use the OTP below to verify your email address:</p>
      <div style="font-size:36px;font-weight:bold;letter-spacing:12px;color:#4F46E5;margin:24px 0;">${otp}</div>
      <p>This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
      <hr/>
      <small style="color:#9ca3af;">UrbanEase - Home Services Platform</small>
    </div>
  `,
});

const sendOtpEmail = async (toEmail, otp, role = "User") => {
  await sendMailWithFallback(buildOtpMail(toEmail, otp, role), `OTP email for ${toEmail}`);
};

module.exports = { sendOtpEmail };
