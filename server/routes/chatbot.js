const express = require("express");

const router = express.Router();

const CHATBOT_BACKEND_URL = (process.env.CHATBOT_URL || "https://urbanease-chatbot.onrender.com").replace(/\/+$/, "");
const CHATBOT_TIMEOUT_MS = Number(process.env.CHATBOT_TIMEOUT_MS || 8000);

const CHATBOT_ENDPOINTS = [
  `${CHATBOT_BACKEND_URL}/api/chat`,
  `${CHATBOT_BACKEND_URL}/chat`,
  `${CHATBOT_BACKEND_URL}/ask`,
  `${CHATBOT_BACKEND_URL}/api/ask`,
  `${CHATBOT_BACKEND_URL}/predict`,
  `${CHATBOT_BACKEND_URL}/api/predict`,
];

const KB = {
  keywords: {
    about: ["urbanease", "urban ease", "what is urbanease", "about urbanease", "tell me about", "explain urbanease"],
    howItWorks: ["how it works", "how does it work", "process", "steps", "how to use"],
    services: ["services", "service", "what do you offer", "cleaning", "plumbing", "electrician", "painting", "pest control", "carpentry", "ac", "repair"],
    pricing: ["price", "pricing", "cost", "how much", "charges", "fee", "rate", "affordable"],
    booking: ["book", "booking", "schedule", "appointment", "how to book", "reserve"],
    provider: ["provider", "professional", "worker", "technician", "verified", "background"],
    payment: ["payment", "pay", "upi", "card", "cash", "wallet", "gpay"],
    refund: ["refund", "cancel", "cancellation", "money back", "policy"],
    founder: ["founder", "who made", "who created", "owner", "team", "who started"],
    technology: ["technology", "tech", "tech stack", "built with", "framework"],
    advantages: ["advantage", "benefits", "why urbanease", "why choose", "unique", "best"],
  },
  answers: {
    about: "UrbanEase is an on-demand home services platform that connects homeowners with trusted, verified local professionals. You can book, track, and manage home services in one place.",
    howItWorks: "UrbanEase works in four simple steps: choose a service, pick a date and time, let a verified professional arrive at your door, then pay online or by cash.",
    services: "UrbanEase supports services such as cleaning, plumbing, electrical work, painting, pest control, carpentry, gardening, handyman tasks, AC service, and more.",
    pricing: "UrbanEase focuses on transparent pricing with no hidden charges. You can review the expected service price before confirming a booking.",
    booking: "To book a service, browse the service category, choose a provider or slot, enter your address, and confirm the booking.",
    provider: "UrbanEase is built around verified service professionals so customers can find reliable help for home-service needs.",
    payment: "UrbanEase supports convenient payment options such as cards, UPI, net banking, wallets, and cash depending on the booking flow.",
    refund: "For cancellations or refund-related questions, check the booking details or contact UrbanEase support so the team can review the specific appointment.",
    founder: "UrbanEase was created by a student team to make finding reliable home-service professionals simpler and more organized.",
    technology: "UrbanEase is built with React, Node.js, Express, MongoDB, and supporting cloud services, with a chatbot experience for quick help.",
    advantages: "UrbanEase helps customers find verified professionals, compare services, book conveniently, avoid hidden surprises, and manage home-service needs in one place.",
    default: "I can help with UrbanEase services, pricing, booking, payments, refunds, providers, and platform details. Try asking about any of those topics.",
  },
};

const getKBAnswer = (query) => {
  const normalizedQuery = query.toLowerCase().trim();
  let bestCategory = "default";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(KB.keywords)) {
    for (const keyword of keywords) {
      if (normalizedQuery.includes(keyword) && keyword.length > bestScore) {
        bestCategory = category;
        bestScore = keyword.length;
      }
    }
  }

  return KB.answers[bestCategory] || KB.answers.default;
};

const extractChatbotReply = (data) => {
  if (typeof data === "string") return data;
  if (!data || typeof data !== "object") return "";

  const reply =
    data.reply ||
    data.response ||
    data.answer ||
    data.message ||
    data.text ||
    data.output ||
    data.result;

  if (typeof reply === "string") return reply;
  if (typeof data.data === "string") return data.data;
  if (data.data && typeof data.data === "object") return extractChatbotReply(data.data);

  return "";
};

router.post("/", async (req, res) => {
  const message = String(req.body?.message || req.body?.question || req.body?.query || "").trim();

  if (!message) {
    return res.status(400).json({ success: false, message: "Message is required" });
  }

  const payload = {
    message,
    question: message,
    query: message,
    prompt: message,
    input: message,
  };

  for (const endpoint of CHATBOT_ENDPOINTS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CHATBOT_TIMEOUT_MS);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) continue;

      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("text/html")) continue;

      const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();
      const reply = extractChatbotReply(data);

      if (reply) {
        return res.json({ success: true, reply });
      }
    } catch (error) {
      console.error(`Chatbot request failed for ${endpoint}:`, error.message);
    } finally {
      clearTimeout(timeout);
    }
  }

  return res.json({
    success: true,
    source: "fallback",
    reply: getKBAnswer(message),
  });
});

module.exports = router;
