const express = require("express");
const cors = require("cors");
require("dotenv").config();
const crypto = require("crypto");
const PDFDocument = require("pdfkit");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: ["https://habit-flow-umber.vercel.app", "http://localhost:" + PORT],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Sample data
let items = [
  {
    id: 1,
    name: "Morning Exercise",
    description: "30 minutes of cardio or strength training",
    frequency: "daily",
    unit: "minutes",
    targetValue: 30,
    streak: 12,
    logs: {}, // { '2025-12-29': 25 }
  },
  {
    id: 2,
    name: "Read 30 Pages",
    description: "Read from my current book",
    frequency: "daily",
    unit: "pages",
    targetValue: 20,
    streak: 8,
    logs: {},
  },
  {
    id: 3,
    name: "Meditation",
    description: "10 minutes of mindfulness meditation",
    frequency: "daily",
    unit: "minutes",
    targetValue: 10,
    streak: 5,
    logs: {},
  },
  {
    id: 4,
    name: "Learning Code",
    description: "Learn new programming concepts",
    frequency: "daily",
    unit: "hours",
    targetValue: 2,
    streak: 15,
    logs: {},
  },
  {
    id: 5,
    name: "Journaling",
    description: "Write about my day and reflections",
    frequency: "daily",
    unit: "pages",
    targetValue: 1,
    streak: 3,
    logs: {},
  },
];

let testProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 234 567 8900",
  location: "San Francisco, CA",
  bio: "Passionate about building better habits and self-improvement. 🚀",
  joinDate: "December 2025",
  avatar: null,
};

const categoryData = [
  { label: "Health", value: 85 },
  { label: "Learning", value: 72 },
  { label: "Productivity", value: 68 },
];

let sessions = new Map(); // token -> { userId, createdAt }
let newsletterSubscribers = new Set(); // emails

// In-memory "auth" + newsletter (dev/demo only)
let users = [
  {
    id: 1,
    name: testProfile.name,
    email: testProfile.email,
    // DO NOT do this in production; hash passwords properly (bcrypt/argon2)
    password: "password123",
    createdAt: new Date().toISOString(),
  },
];

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateToken() {
  return crypto.randomBytes(24).toString("hex");
}

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token || !sessions.has(token)) {
    return res.status(401).json({ message: "Unauthorized", st: false });
  }

  req.session = sessions.get(token);
  req.token = token;
  next();
}

// Routes
app.get("/api", (req, res) => {
  res.json({ message: "Backend API çalışıyor!" });
});

// GET all items
app.get("/api/items", (req, res) => {
  res.json(items);
});

// GET single item
app.get("/api/items/:id", (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ message: "Öğe bulunamadı" });
  }
  res.json(item);
});

// POST new item
app.post("/api/items", (req, res) => {
  const newItem = {
    id: items.length + 1,
    name: req.body.name,
    description: req.body.description,
    frequency: req.body.frequency,
    unit: req.body.unit,
    targetValue: req.body.targetValue,
    streak: req.body.streak,
    logs: req.body.logs || {},
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT update item
app.put("/api/items/:id", (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ message: "Öğe bulunamadı" });
  }
  item.name = req.body.name || item.name;
  item.description = req.body.description || item.description;
  res.json(item);
});

// POST log item
app.post("/api/items/:id/log", (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ message: "Öğe bulunamadı" });
  }
  item.logs = req.body.logs || item.logs || {};
  item.streak = req.body.streak || item.streak || 0;
  res.json(item);
});

// POST log item
app.post("/api/items/:id/toggle", (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ message: "Öğe bulunamadı" });
  }
  item.logs = req.body.logs || item.logs || {};
  item.streak = req.body.streak || item.streak || 0;
  res.json(item);
});

// DELETE item
app.delete("/api/items/:id", (req, res) => {
  const index = items.findIndex((i) => i.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Öğe bulunamadı", st: false });
  }
  items.splice(index, 1);
  res.json({ message: "Öğe silindi!", st: true });
});

// GET user profile
app.get("/api/user/profile", (req, res) => {
  res.json(testProfile);
});

// PUT user profile
app.put("/api/user/profile", (req, res) => {
  testProfile.name = req.body.name || testProfile.name;
  testProfile.email = req.body.email || testProfile.email;
  testProfile.phone = req.body.phone || testProfile.phone;
  testProfile.location = req.body.location || testProfile.location;
  testProfile.bio = req.body.bio || testProfile.bio;
  res.json(testProfile);
});

app.get("/api/stats/categories", (req, res) => {
  res.json(categoryData);
});

app.post("/api/newsletter/subscribe", (req, res) => {
  const { email } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email", st: false });
  }

  const normalized = email.toLowerCase().trim();
  const already = newsletterSubscribers.has(normalized);

  newsletterSubscribers.add(normalized);

  res.status(already ? 200 : 201).json({
    message: already ? "Already subscribed" : "Subscribed successfully",
    st: true,
    email: normalized,
  });
});

app.get("/api/export/csv", (req, res) => {
  // CSV escape helper
  const esc = (v) => {
    const s = v === null || v === undefined ? "" : String(v);
    // Wrap in quotes if it contains comma, quote, or newline
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  // Flatten logs count for export
  const header = [
    "id",
    "name",
    "description",
    "frequency",
    "unit",
    "targetValue",
    "streak",
    "logCount",
  ];

  const rows = items.map((it) => [
    it.id,
    it.name,
    it.description,
    it.frequency,
    it.unit,
    it.targetValue,
    it.streak,
    it.logs ? Object.keys(it.logs).length : 0,
  ]);

  const csv = [header, ...rows].map((r) => r.map(esc).join(",")).join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="habits_export.csv"'
  );
  res.status(200).send(csv);
});

app.get("/api/export/pdf", (req, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="habits_export.pdf"'
  );

  doc.pipe(res);

  // Title
  doc.fontSize(20).text("Habit Tracker Export", { align: "left" });
  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .fillColor("gray")
    .text(`Generated: ${new Date().toISOString()}`);
  doc.fillColor("black");
  doc.moveDown();

  // Profile
  doc.fontSize(14).text("User Profile");
  doc.moveDown(0.3);
  doc.fontSize(11).text(`Name: ${testProfile.name}`);
  doc.text(`Email: ${testProfile.email}`);
  doc.text(`Phone: ${testProfile.phone}`);
  doc.text(`Location: ${testProfile.location}`);
  doc.text(`Join Date: ${testProfile.joinDate}`);
  doc.moveDown();
  doc.text(`Bio: ${testProfile.bio}`);
  doc.moveDown();

  // Items
  doc.fontSize(14).text("Items");
  doc.moveDown(0.5);

  items.forEach((it, idx) => {
    doc.fontSize(12).text(`${idx + 1}. ${it.name} (ID: ${it.id})`);
    doc
      .fontSize(10)
      .fillColor("gray")
      .text(it.description || "");
    doc.fillColor("black");
    doc
      .fontSize(11)
      .text(
        `Frequency: ${it.frequency} | Target: ${it.targetValue} ${it.unit} | Streak: ${it.streak}`
      );

    const logCount = it.logs ? Object.keys(it.logs).length : 0;
    doc.fontSize(11).text(`Logs: ${logCount} entries`);
    doc.moveDown(0.6);
  });

  doc.end();
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email) || typeof password !== "string") {
    return res.status(400).json({ message: "Invalid credentials", st: false });
  }

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    return res
      .status(401)
      .json({ message: "Email or password incorrect", st: false });
  }

  const token = generateToken();
  sessions.set(token, { userId: user.id, createdAt: new Date().toISOString() });

  res.json({
    message: "Login successful",
    st: true,
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;

  if (typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ message: "Name is required", st: false });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email", st: false });
  }
  if (typeof password !== "string" || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 chars", st: false });
  }

  const exists = users.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) {
    return res
      .status(409)
      .json({ message: "Email already registered", st: false });
  }

  const newUser = {
    id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password, // dev only
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  // Keep testProfile aligned to simulate "current user"
  testProfile.name = newUser.name;
  testProfile.email = newUser.email;
  testProfile.joinDate = "January 2026";

  res.status(201).json({
    message: "Registration successful",
    st: true,
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
  });
});

app.post("/api/auth/logout", requireAuth, (req, res) => {
  sessions.delete(req.token);
  res.json({ message: "Logged out", st: true });
});

app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email", st: false });
  }

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  // Do not reveal whether user exists (best practice), but for dev we can still return a token when exists
  const resetToken = user ? generateToken() : null;

  res.json({
    message: "If that email exists, a reset link has been sent (mock).",
    st: true,
    // dev-only convenience:
    resetToken,
  });
});

app.post("/api/auth/change-password", requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
    return res.status(400).json({ message: "Invalid payload", st: false });
  }
  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "New password must be at least 6 chars", st: false });
  }

  const user = users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized", st: false });
  }

  if (user.password !== currentPassword) {
    return res
      .status(401)
      .json({ message: "Current password incorrect", st: false });
  }

  user.password = newPassword;

  res.json({ message: "Password changed successfully", st: true });
});

app.delete("/api/user/account", requireAuth, (req, res) => {
  const userId = req.session.userId;

  users = users.filter((u) => u.id !== userId);

  // Logout this session
  sessions.delete(req.token);

  // Clear app state to simulate account deletion
  items = [];
  testProfile = {
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    joinDate: "",
    avatar: null,
  };

  res.json({ message: "Account deleted", st: true });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
