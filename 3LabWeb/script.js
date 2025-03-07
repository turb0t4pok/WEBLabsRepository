let hash = {};

function AddValue(key, value) {
    hash[key] = value;
}

function DeleteValue(key) {
    if (hash.hasOwnProperty(key)) {
        delete hash[key];
    } else {
        console.log("Ключ не найден.");
    }
}

function GetValueInfo(key) {
    return hash.hasOwnProperty(key) ? `Ключ: ${key}, Значение: ${hash[key]}` : "Нет информации";
}

function ListValues() {
    return Object.keys(hash).map(key => `Ключ: ${key}, Значение: ${hash[key]}`).join("\n");
}

function addWeaponInfo() {
    let key = prompt("Введите название оружия:");
    let value = prompt("Введите описание оружия:");
    AddValue(key, value);
    console.log(`Добавлено: ${key} - ${value}`);
}

function deleteWeaponInfo() {
    let key = prompt("Введите название оружия для удаления:");
    DeleteValue(key);
    console.log(`Удалено: ${key}`);
}

function getWeaponInfo() {
    let key = prompt("Введите название оружия для получения информации:");
    let info = GetValueInfo(key);
    console.log(info);
}

function listAllWeapons() {
    let list = ListValues();
    console.log(list || "Нет данных об оружии.");
}