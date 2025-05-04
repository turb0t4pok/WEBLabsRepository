import express from 'express';
import * as store from '../store/store.js';

const router = express.Router();

router.get('/items/:id', async (req, res) => {
    const item = await store.findById(req.params.id);
    item ? res.json(item) : res.sendStatus(404);
});
router.post('/items', async (req, res) => {
    const created = await store.create(req.body);
    res.status(201).json(created);
});
router.put('/items/:id', async (req, res) => {
    const updated = await store.update(req.params.id, req.body);
    updated ? res.json(updated) : res.sendStatus(404);
});
router.delete('/items/:id', async (req, res) => {
    const ok = await store.remove(req.params.id);
    ok ? res.sendStatus(204) : res.sendStatus(404);
});
router.post('/reassign', async (_, res) => {
    const data = await store.reassign();
    res.json(data);
});

router.get('/items', async (req, res) => {
    let items = await store.readAll();

    const { search = '', sort = 'asc', sortField = 'person', page = 1, limit = 5 } = req.query;

    if (search) {
        items = items.filter(item => item.person.toLowerCase().includes(search.toLowerCase()));
    }

    items.sort((a, b) => {
        if (sortField === 'id') {
            const aId = parseInt(a.id);
            const bId = parseInt(b.id);
            return sort === 'desc' ? bId - aId : aId - bId;
        } else {
            const aField = a.person.toLowerCase();
            const bField = b.person.toLowerCase();
            return sort === 'desc' ? bField.localeCompare(aField) : aField.localeCompare(bField);
        }
    });

    const start = (page - 1) * limit;
    const paginatedItems = items.slice(start, start + parseInt(limit));

    res.json({
        total: items.length,
        page: parseInt(page),
        totalPages: Math.ceil(items.length / limit),
        items: paginatedItems
    });
});


export default router;
