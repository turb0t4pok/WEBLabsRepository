const express = require('express');
const router = express.Router();
const store = require('./store');

// Получить все товары
router.get('/weapons', (req, res) => {
  res.json(store.getAllWeapons());
});

// Получить один товар
router.get('/weapons/:id', (req, res) => {
  const weapon = store.getWeapon(req.params.id);
  weapon ? res.json(weapon) : res.status(404).send('Товар не найден');
});

// Добавить товар
router.post('/weapons', (req, res) => {
  const { name, description, price, category, manufacturer } = req.body;
  if (!name || !description || !price || !category || !manufacturer) {
    return res.status(400).send('Не все поля заполнены');
  }
  
  const id = store.addWeapon({
    name,
    description,
    price,
    category,
    manufacturer
  });
  
  id ? res.status(201).json({ id, ...req.body }) : res.status(500).send('Ошибка добавления');
});

// Обновить товар
router.put('/weapons/:id', (req, res) => {
  const success = store.updateWeapon(req.params.id, req.body);
  success ? res.json({ success: true }) : res.status(404).send('Товар не найден');
});

// Удалить товар
router.delete('/weapons/:id', (req, res) => {
  const success = store.deleteWeapon(req.params.id);
  success ? res.json({ success: true }) : res.status(404).send('Товар не найден');
});

module.exports = router;