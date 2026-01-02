const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
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

// DELETE item
app.delete("/api/items/:id", (req, res) => {
  const index = items.findIndex((i) => i.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Öğe bulunamadı" });
  }
  items.splice(index, 1);
  res.json({ message: "Öğe silindi" });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
