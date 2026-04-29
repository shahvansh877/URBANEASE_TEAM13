const Brevo = require("@getbrevo/brevo");

const getEmailProvider = () => process.env.EMAIL_PROVIDER?.trim().toLowerCase() || "brevo_api";
const getBrevoApiKey = () => process.env.BREVO_API_KEY?.trim();
const getFromName = () => process.env.EMAIL_FROM_NAME?.trim() || "UrbanEase";
const getFromEmail = () => process.env.EMAIL_FROM_EMAIL?.trim() || process.env.EMAIL_FROM?.trim();

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

const normalizeRecipients = (recipients) => {
  if (Array.isArray(recipients)) return recipients;
  return recipients ? [recipients] : [];
};

const toBrevoRecipients = (recipients) => (
  normalizeRecipients(recipients)
    .map((recipient) => (typeof recipient === "string" ? parseEmailAddress(recipient) : recipient))
    .filter((recipient) => recipient?.email)
);

const getFromAddress = () => getFromEmail();

const getFromHeader = () => {
  const email = getFromEmail();
  if (!email) return "";
  return `"${getFromName()}" <${email}>`;
};

const createBrevoClient = () => {
  const apiKey = getBrevoApiKey();
  if (!apiKey) {
    throw new Error("Brevo email service is not configured. BREVO_API_KEY is required.");
  }

  const client = new Brevo.TransactionalEmailsApi();

  if (typeof client.setApiKey === "function" && Brevo.TransactionalEmailsApiApiKeys?.apiKey) {
    client.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);
  } else if (client.authentications?.apiKey) {
    client.authentications.apiKey.apiKey = apiKey;
  } else {
    throw new Error("Brevo SDK authentication could not be configured.");
  }

  return client;
};

const getEmailConfigStatus = () => ({
  provider: getEmailProvider(),
  brevoConfigured: Boolean(getBrevoApiKey()),
  fromName: getFromName(),
  fromEmail: getFromEmail(),
});

const sendEmail = async (mailOptions, label = "Email") => {
  if (getEmailProvider() !== "brevo_api") {
    throw new Error("Email provider must be set to EMAIL_PROVIDER=brevo_api for Brevo API delivery.");
  }

  const fromEmail = getFromEmail();
  if (!fromEmail) {
    throw new Error("Brevo email service is not configured. EMAIL_FROM_EMAIL is required.");
  }

  const to = toBrevoRecipients(mailOptions.to);
  if (!to.length) {
    throw new Error(`${label} could not be sent because no recipient email was provided.`);
  }

  const message = new Brevo.SendSmtpEmail();
  message.sender = {
    name: getFromName(),
    email: fromEmail,
  };
  message.to = to;
  message.subject = mailOptions.subject;
  message.htmlContent = mailOptions.html;
  message.textContent = mailOptions.text;

  if (mailOptions.replyTo) {
    message.replyTo = parseEmailAddress(mailOptions.replyTo);
  }
  if (mailOptions.cc) {
    message.cc = toBrevoRecipients(mailOptions.cc);
  }
  if (mailOptions.bcc) {
    message.bcc = toBrevoRecipients(mailOptions.bcc);
  }

  const client = createBrevoClient();

  try {
    const response = await client.sendTransacEmail(message);
    const body = response?.body || response;
    console.log(`${label} accepted via Brevo API`, body?.messageId || "");
    return body;
  } catch (error) {
    const brevoMessage = error?.body?.message || error?.response?.body?.message || error.message;
    console.error(`${label} failed via Brevo API:`, brevoMessage);
    throw new Error(brevoMessage || `${label} could not be sent via Brevo API`);
  }
};

module.exports = {
  getEmailConfigStatus,
  getFromAddress,
  getFromHeader,
  sendEmail,
  sendMailWithFallback: sendEmail,
};
