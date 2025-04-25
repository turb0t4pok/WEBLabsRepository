const express = require('express');
const path = require('path');
const store = require('./store');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const restRouter = require('./rest');
app.use('/api', restRouter);

app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Оружейная лавка'
  });
});

app.get('/catalog', (req, res) => {
  const weapons = Object.entries(store.getAllWeapons())
      .map(([id, weapon]) => ({ id, ...weapon }));
  
  res.render('catalog', { 
      title: 'Каталог оружия',
      weapons 
  });
});

app.get('/weapon/:id', (req, res) => {
  const weapon = store.getWeapon(req.params.id);
  if (weapon) {
      res.render('weapon', {
          title: weapon.name,
          weapon: { id: req.params.id, ...weapon }
      });
  } else {
      res.status(404).render('404', { title: 'Товар не найден' });
  }
});

app.use((req, res) => {
  res.status(404).render('404', { title: 'Страница не найдена' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});