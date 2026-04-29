const nodemailer = require("nodemailer");

const smtpPort = Number(process.env.EMAIL_PORT || 465);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: smtpPort,
  secure: smtpPort === 465,
  family: 4,
  pool: true,
  maxConnections: 2,
  maxMessages: 100,
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 10000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    servername: process.env.EMAIL_HOST || "smtp.gmail.com",
  },
});

const getFromAddress = () => process.env.EMAIL_FROM || process.env.EMAIL_USER;

const sendOtpEmail = async (toEmail, otp, role = "User") => {
  await transporter.sendMail({
    from: `"UrbanEase" <${getFromAddress()}>`,
    to: toEmail,
    subject: "UrbanEase – Your OTP Verification Code",
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#4F46E5;">UrbanEase</h2>
        <p>Hello <strong>${role}</strong>,</p>
        <p>Use the OTP below to verify your email address:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:12px;color:#4F46E5;margin:24px 0;">${otp}</div>
        <p>This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <hr/>
        <small style="color:#9ca3af;">UrbanEase – Home Services Platform</small>
      </div>
    `,
  });
};

module.exports = { sendOtpEmail };
