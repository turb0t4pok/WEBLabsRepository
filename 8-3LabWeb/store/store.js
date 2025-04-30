import fs from 'node:fs/promises';
import path from 'node:path';

const dbPath = path.resolve('data', 'data.json');

await fs.mkdir(path.dirname(dbPath), { recursive: true }).catch(() => {});
try { await fs.access(dbPath); } catch { await fs.writeFile(dbPath, '[]'); }

export const readAll = async () => JSON.parse(await fs.readFile(dbPath, 'utf8'));
export const writeAll = data => fs.writeFile(dbPath, JSON.stringify(data, null, 2));
export const findById = async id => (await readAll()).find(i => i.id === id);

export async function create(obj) {
    const list = await readAll();
    const id = (Math.max(0, ...list.map(i => +i.id || 0)) + 1).toString();
    const rec = { id, ...obj };
    await writeAll([...list, rec]);
    return rec;
}

export async function update(id, patch) {
    const list = await readAll();
    const i = list.findIndex(r => r.id === id);
    if (i === -1) return null;
    list[i] = { ...list[i], ...patch, id };
    await writeAll(list);
    return list[i];
}

export async function remove(id) {
    const list = await readAll();
    const filtered = list.filter(r => r.id !== id);
    await writeAll(filtered);
    return filtered.length !== list.length;
}

export async function reassign() {
    const list = await readAll();
    const renum = list.map((obj, idx) => ({ ...obj, id: (idx + 1).toString() }));
    await writeAll(renum);
    return renum;
}
