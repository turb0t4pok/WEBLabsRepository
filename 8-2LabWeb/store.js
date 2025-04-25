const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Ошибка чтения db.json:', err);
    return {};
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('Ошибка записи в db.json:', err);
    return false;
  }
};

module.exports = {
  getAllWeapons: () => readDB(),
  
  getWeapon: (id) => {
    const db = readDB();
    return db[id] || null;
  },
  
  addWeapon: (weapon) => {
    const db = readDB();
    const id = Date.now().toString();
    db[id] = weapon;
    return writeDB(db) ? id : null;
  },
  
  updateWeapon: (id, updates) => {
    const db = readDB();
    if (!db[id]) return false;
    db[id] = { ...db[id], ...updates };
    return writeDB(db);
  },
  
  deleteWeapon: (id) => {
    const db = readDB();
    if (!db[id]) return false;
    delete db[id];
    return writeDB(db);
  }
};