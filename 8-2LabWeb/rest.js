const express = require('express');
const router = express.Router();
const store = require('./store');

router.get('/weapons', (req, res) => {
  res.json(store.getAllWeapons());
});

router.get('/weapons/:id', (req, res) => {
  const weapon = store.getWeapon(req.params.id);
  weapon ? res.json(weapon) : res.status(404).send('Товар не найден');
});

router.post('/weapons', (req, res) => {
  const { name, price, description, category, manufacturer } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Название и цена обязательны' });
  }

  const weapon = {
    name,
    price,
    description: description || '',
    category: category || 'Другое',
    manufacturer: manufacturer || 'Неизвестно'
  };

  const id = store.addWeapon(weapon);
  
  if (id) {
    res.status(201).json({ id, ...weapon });
  } else {
    res.status(500).json({ error: 'Ошибка добавления' });
  }
});

router.put('/weapons/:id', (req, res) => {
  const success = store.updateWeapon(req.params.id, req.body);
  success ? res.json({ success: true }) : res.status(404).send('Товар не найден');
});

router.delete('/weapons/:id', (req, res) => {
  const success = store.deleteWeapon(req.params.id);
  success ? res.json({ success: true }) : res.status(404).send('Товар не найден');
});

module.exports = router;