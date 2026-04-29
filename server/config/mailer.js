const nodemailer = require("nodemailer");

const SMTP_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
const configuredPort = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : null;
const smtpPorts = [...new Set([configuredPort, 587, 465].filter(Boolean))];

const getFromAddress = () => process.env.EMAIL_FROM || process.env.EMAIL_USER;

const createTransporter = (port) => nodemailer.createTransport({
  host: SMTP_HOST,
  port,
  secure: port === 465,
  requireTLS: port === 587,
  family: 4,
  connectionTimeout: 8000,
  greetingTimeout: 8000,
  socketTimeout: 12000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    servername: SMTP_HOST,
  },
});

const buildOtpMail = (toEmail, otp, role) => ({
  from: `"UrbanEase" <${getFromAddress()}>`,
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
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email service is not configured. EMAIL_USER and EMAIL_PASS are required.");
  }

  let lastError = null;
  const mail = buildOtpMail(toEmail, otp, role);

  for (const port of smtpPorts) {
    try {
      const transporter = createTransporter(port);
      await transporter.sendMail(mail);
      return;
    } catch (error) {
      lastError = error;
      console.error(`OTP email send failed on ${SMTP_HOST}:${port}:`, error.message);
    }
  }

  throw new Error(lastError?.message || "Could not send OTP email");
};

module.exports = { sendOtpEmail };
