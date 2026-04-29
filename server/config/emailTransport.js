const nodemailer = require("nodemailer");

const SMTP_HOST = process.env.EMAIL_HOST?.trim() || "smtp.gmail.com";
const configuredPort = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : null;
const smtpPorts = [...new Set([configuredPort, 587, 465].filter(Boolean))];

const emailUser = () => process.env.EMAIL_USER?.trim();
const emailPass = () => process.env.EMAIL_PASS?.replace(/\s/g, "");
const getFromAddress = () => process.env.EMAIL_FROM?.trim() || emailUser();

const createTransporter = (port) => nodemailer.createTransport({
  host: SMTP_HOST,
  port,
  secure: port === 465,
  requireTLS: port === 587,
  family: 4,
  connectionTimeout: 12000,
  greetingTimeout: 12000,
  socketTimeout: 20000,
  auth: {
    user: emailUser(),
    pass: emailPass(),
  },
  tls: {
    servername: SMTP_HOST,
  },
});

const getEmailConfigStatus = () => ({
  host: SMTP_HOST,
  ports: smtpPorts,
  userConfigured: Boolean(emailUser()),
  passConfigured: Boolean(emailPass()),
  from: getFromAddress(),
});

const sendMailWithFallback = async (mailOptions, label = "Email") => {
  if (!emailUser() || !emailPass()) {
    throw new Error("Email service is not configured. EMAIL_USER and EMAIL_PASS are required.");
  }

  let lastError = null;

  for (const port of smtpPorts) {
    try {
      const transporter = createTransporter(port);
      const info = await transporter.sendMail({
        ...mailOptions,
        from: mailOptions.from || `"UrbanEase" <${getFromAddress()}>`,
      });

      console.log(`${label} accepted via ${SMTP_HOST}:${port}`, info.messageId || "");
      return info;
    } catch (error) {
      lastError = error;
      console.error(`${label} failed via ${SMTP_HOST}:${port}:`, error.message);
    }
  }

  throw new Error(lastError?.message || `${label} could not be sent`);
};

module.exports = {
  getEmailConfigStatus,
  getFromAddress,
  sendMailWithFallback,
};
