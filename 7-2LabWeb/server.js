const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/download', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'data', 'weapons.json');
    res.download(filePath, 'weapons-catalog.json', (err) => {
        if (err) {
            console.error('Ошибка загрузки файла:', err);
            res.status(500).send('Не удалось загрузить файл');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Откройте http://localhost:${PORT} в браузере`);
});