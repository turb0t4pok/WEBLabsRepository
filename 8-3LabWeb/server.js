import express from 'express';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import apiRouter from './routes/rest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (_, res) => res.render('index'));
app.use('/api', apiRouter);

const PORT = process.env.PORT ?? 3000;
app.use((_, res) => {
    res.status(404).send('Страница не найдена');
});
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
