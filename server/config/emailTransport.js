const nodemailer = require("nodemailer");

const SMTP_HOST = process.env.EMAIL_HOST?.trim() || "smtp.gmail.com";
const configuredPort = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : null;
const smtpPorts = [...new Set([configuredPort, 587, 465].filter(Boolean))];
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
const RESEND_API_URL = "https://api.resend.com/emails";

const emailUser = () => process.env.EMAIL_USER?.trim();
const emailPass = () => process.env.EMAIL_PASS?.replace(/\s/g, "");
const resendApiKey = () => process.env.RESEND_API_KEY?.trim();
const getFromAddress = () => process.env.EMAIL_FROM?.trim() || emailUser();
const getFromHeader = () => {
  const from = getFromAddress();
  if (!from) return "";
  return from.includes("<") ? from : `"UrbanEase" <${from}>`;
};
const getEmailProvider = () => {
  if (EMAIL_PROVIDER) return EMAIL_PROVIDER;
  if (resendApiKey()) return "resend";
  return "smtp";
};

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
  provider: getEmailProvider(),
  host: SMTP_HOST,
  ports: smtpPorts,
  userConfigured: Boolean(emailUser()),
  passConfigured: Boolean(emailPass()),
  resendConfigured: Boolean(resendApiKey()),
  from: getFromAddress(),
  fromHeader: getFromHeader(),
});

const normalizeRecipients = (recipients) => {
  if (Array.isArray(recipients)) return recipients;
  return recipients ? [recipients] : [];
};

const sendMailWithResend = async (mailOptions, label) => {
  if (!resendApiKey()) {
    throw new Error("Resend email service is not configured. RESEND_API_KEY is required.");
  }
  if (!getFromAddress()) {
    throw new Error("Resend email service is not configured. EMAIL_FROM is required.");
  }
  if (typeof fetch !== "function") {
    throw new Error("Resend email service requires Node.js 18 or newer for fetch support.");
  }

  const payload = {
    from: mailOptions.from || getFromHeader(),
    to: normalizeRecipients(mailOptions.to),
    subject: mailOptions.subject,
    html: mailOptions.html,
    text: mailOptions.text,
  };

  if (mailOptions.replyTo) payload.reply_to = mailOptions.replyTo;
  if (mailOptions.cc) payload.cc = normalizeRecipients(mailOptions.cc);
  if (mailOptions.bcc) payload.bcc = normalizeRecipients(mailOptions.bcc);

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || data?.error?.message || `${label} could not be sent via Resend`;
    throw new Error(message);
  }

  console.log(`${label} accepted via Resend API`, data.id || "");
  return data;
};

const sendMailWithSmtp = async (mailOptions, label) => {
  if (!emailUser() || !emailPass()) {
    throw new Error("Email service is not configured. EMAIL_USER and EMAIL_PASS are required.");
  }

  let lastError = null;

  for (const port of smtpPorts) {
    try {
      const transporter = createTransporter(port);
      const info = await transporter.sendMail({
        ...mailOptions,
        from: mailOptions.from || getFromHeader(),
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

const sendMailWithFallback = async (mailOptions, label = "Email") => {
  if (getEmailProvider() === "resend") {
    return sendMailWithResend(mailOptions, label);
  }

  return sendMailWithSmtp(mailOptions, label);
};

module.exports = {
  getEmailConfigStatus,
  getFromAddress,
  getFromHeader,
  sendMailWithFallback,
};
