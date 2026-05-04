const express = require("express");

const router = express.Router();

const CHATBOT_BACKEND_URL = (process.env.CHATBOT_URL || "https://urbanease-chatbot.onrender.com").replace(/\/+$/, "");

const CHATBOT_ENDPOINTS = [
  `${CHATBOT_BACKEND_URL}/chat`,
  `${CHATBOT_BACKEND_URL}/api/chat`,
  `${CHATBOT_BACKEND_URL}/ask`,
  `${CHATBOT_BACKEND_URL}/api/ask`,
  `${CHATBOT_BACKEND_URL}/predict`,
  `${CHATBOT_BACKEND_URL}/api/predict`,
];

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
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    }
  }

  return res.status(502).json({
    success: false,
    message: "Could not reach the deployed chatbot service",
  });
});

module.exports = router;
