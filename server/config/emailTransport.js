const nodemailer = require("nodemailer");

const SMTP_HOST = (process.env.SMTP_HOST || process.env.EMAIL_HOST)?.trim() || "smtp.gmail.com";
const configuredPortValue = process.env.SMTP_PORT || process.env.EMAIL_PORT;
const configuredPort = configuredPortValue ? Number(configuredPortValue) : null;
const smtpPorts = [...new Set([configuredPort, 587, 465].filter(Boolean))];
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const emailUser = () => (process.env.SMTP_USER || process.env.EMAIL_USER)?.trim();
const emailPass = () => (process.env.SMTP_PASS || process.env.EMAIL_PASS)?.replace(/\s/g, "");
const brevoApiKey = () => process.env.BREVO_API_KEY?.trim();
const getFromAddress = () => process.env.EMAIL_FROM?.trim() || emailUser();
const getFromHeader = () => {
  const from = getFromAddress();
  if (!from) return "";
  return from.includes("<") ? from : `"UrbanEase" <${from}>`;
};
const getEmailProvider = () => {
  if (EMAIL_PROVIDER) return EMAIL_PROVIDER;
  if (brevoApiKey()) return "brevo";
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
  brevoConfigured: Boolean(brevoApiKey()),
  from: getFromAddress(),
  fromHeader: getFromHeader(),
});

const normalizeRecipients = (recipients) => {
  if (Array.isArray(recipients)) return recipients;
  return recipients ? [recipients] : [];
};

const parseEmailAddress = (value) => {
  const text = value?.trim();
  if (!text) return null;

  const match = text.match(/^(?:"?([^"<]*)"?)?\s*<([^<>]+)>$/);
  if (match) {
    return {
      name: match[1]?.trim() || undefined,
      email: match[2].trim(),
    };
  }

  return { email: text };
};

const toBrevoRecipients = (recipients) => (
  normalizeRecipients(recipients)
    .map(parseEmailAddress)
    .filter(Boolean)
);

const sendMailWithBrevo = async (mailOptions, label) => {
  if (!brevoApiKey()) {
    throw new Error("Brevo email service is not configured. BREVO_API_KEY is required.");
  }
  if (!getFromAddress()) {
    throw new Error("Brevo email service is not configured. EMAIL_FROM is required.");
  }
  if (typeof fetch !== "function") {
    throw new Error("Brevo email service requires Node.js 18 or newer for fetch support.");
  }

  const sender = parseEmailAddress(mailOptions.from || getFromHeader());
  const to = toBrevoRecipients(mailOptions.to);

  if (!sender?.email) {
    throw new Error("Brevo email service is not configured. EMAIL_FROM must be a valid sender email.");
  }
  if (!to.length) {
    throw new Error(`${label} could not be sent because no recipient email was provided.`);
  }

  const payload = {
    sender,
    to,
    subject: mailOptions.subject,
    htmlContent: mailOptions.html,
    textContent: mailOptions.text,
  };

  if (mailOptions.replyTo) payload.replyTo = parseEmailAddress(mailOptions.replyTo);
  if (mailOptions.cc) payload.cc = toBrevoRecipients(mailOptions.cc);
  if (mailOptions.bcc) payload.bcc = toBrevoRecipients(mailOptions.bcc);

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": brevoApiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || data?.error?.message || `${label} could not be sent via Brevo`;
    throw new Error(message);
  }

  console.log(`${label} accepted via Brevo API`, data.messageId || "");
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
  if (getEmailProvider() === "brevo") {
    return sendMailWithBrevo(mailOptions, label);
  }

  return sendMailWithSmtp(mailOptions, label);
};

module.exports = {
  getEmailConfigStatus,
  getFromAddress,
  getFromHeader,
  sendMailWithFallback,
};
