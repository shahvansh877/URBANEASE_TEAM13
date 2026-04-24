const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ServiceProvider = require("../models/ServiceProvider");
const Admin = require("../models/Admin");

const clients = new Map();

const findAccountByRole = async (id, role) => {
  if (role === "user") return User.findById(id).select("-password");
  if (role === "serviceProvider") return ServiceProvider.findById(id).select("-password");
  if (role === "admin") return Admin.findById(id).select("-password");
  return null;
};

const writeEvent = (client, event) => {
  client.res.write(`data: ${JSON.stringify(event)}\n\n`);
};

const addClient = (user, role, res) => {
  const id = `${role}:${String(user._id)}`;
  if (!clients.has(id)) clients.set(id, new Set());

  const client = { id, role, userId: String(user._id), res };
  clients.get(id).add(client);

  writeEvent(client, {
    type: "connected",
    role,
    userId: String(user._id),
    at: new Date().toISOString(),
  });

  return () => {
    const group = clients.get(id);
    if (!group) return;
    group.delete(client);
    if (group.size === 0) clients.delete(id);
  };
};

const emitTo = (role, userId, event) => {
  const group = clients.get(`${role}:${String(userId)}`);
  if (!group) return;
  group.forEach((client) => writeEvent(client, event));
};

const emitToAdmins = (event) => {
  clients.forEach((group, key) => {
    if (!key.startsWith("admin:")) return;
    group.forEach((client) => writeEvent(client, event));
  });
};

const emitBookingEvent = (booking, type, extra = {}) => {
  if (!booking) return;

  const userId = booking.user?._id || booking.user;
  const providerId = booking.provider?._id || booking.provider;
  const event = {
    type,
    bookingId: String(booking._id),
    userId: userId ? String(userId) : "",
    providerId: providerId ? String(providerId) : "",
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    at: new Date().toISOString(),
    ...extra,
  };

  if (userId) emitTo("user", userId, event);
  if (providerId) emitTo("serviceProvider", providerId, event);
  emitToAdmins(event);
};

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const token = req.query.token;
    if (!token || typeof token !== "string") {
      return res.status(401).json({ success: false, message: "Realtime token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const account = await findAccountByRole(decoded.id, decoded.role);

    if (!account || !account.isActive) {
      return res.status(401).json({ success: false, message: "Realtime access denied" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const removeClient = addClient(account, decoded.role, res);
    const heartbeat = setInterval(() => {
      res.write(`: heartbeat ${Date.now()}\n\n`);
    }, 25000);

    req.on("close", () => {
      clearInterval(heartbeat);
      removeClient();
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Realtime token invalid" });
  }
});

module.exports = {
  router,
  realtime: {
    emitTo,
    emitToAdmins,
    emitBookingEvent,
  },
};
