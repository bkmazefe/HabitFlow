const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data
let items = [
  { id: 1, name: 'Item 1', description: 'Bu ilk öğe' },
  { id: 2, name: 'Item 2', description: 'Bu ikinci öğe' },
  { id: 3, name: 'Item 3', description: 'Bu üçüncü öğe' }
];

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Backend API çalışıyor!' });
});

// GET all items
app.get('/api/items', (req, res) => {
  res.json(items);
});

// GET single item
app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ message: 'Öğe bulunamadı' });
  }
  res.json(item);
});

// POST new item
app.post('/api/items', (req, res) => {
  const newItem = {
    id: items.length + 1,
    name: req.body.name,
    description: req.body.description
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT update item
app.put('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ message: 'Öğe bulunamadı' });
  }
  item.name = req.body.name || item.name;
  item.description = req.body.description || item.description;
  res.json(item);
});

// DELETE item
app.delete('/api/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Öğe bulunamadı' });
  }
  items.splice(index, 1);
  res.json({ message: 'Öğe silindi' });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
