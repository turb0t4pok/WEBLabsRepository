const express = require('express');
const bodyParser = require('body-parser');
const restRouter = require('./rest');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use('/api', restRouter);

// Статические файлы
app.use(express.static('public'));

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`REST API доступно по: http://localhost:${PORT}/api/weapons`);
});