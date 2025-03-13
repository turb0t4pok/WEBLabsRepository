class TLocalStorage {
    constructor(storageKey = 'weaponShopStorage') {
        this.storageKey = storageKey;
        this.loadFromStorage();
    }

    loadFromStorage() {
        const storedData = localStorage.getItem(this.storageKey);
        this.hash = storedData ? JSON.parse(storedData) : {};
    }

    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.hash));
    }

    Reset() {
        this.hash = {};
        this.saveToStorage();
    }

    AddValue(Key, Value) {
        this.hash[Key] = Value;
        this.saveToStorage();
    }

    GetValue(Key) {
        return this.hash[Key];
    }

    DeleteValue(Key) {
        if (this.hash.hasOwnProperty(Key)) {
            delete this.hash[Key];
            this.saveToStorage();
        } else {
            console.log("Ключ не найден.");
        }
    }

    GetKeys() {
        return Object.keys(this.hash);
    }
}

const Storage = new TLocalStorage();

function addWeaponInfo() {
    let key = prompt("Введите название оружия:");
    let value = prompt("Введите описание оружия:");
    Storage.AddValue(key, value);
    console.log(`Добавлено: ${key} - ${value}`);
}

function deleteWeaponInfo() {
    let key = prompt("Введите название оружия для удаления:");
    Storage.DeleteValue(key);
    console.log(`Удалено: ${key}`);
}

function getWeaponInfo() {
    let key = prompt("Введите название оружия для получения информации:");
    let info = Storage.GetValue(key);
    console.log(info ? `Ключ: ${key}, Значение: ${info}` : "Нет информации");
}

function listAllWeapons() {
    let keys = Storage.GetKeys();
    console.log(keys.length > 0 ? keys.join("\n") : "Нет данных об оружии.");
}

function ResetWeaponShop() {
    if(confirm("Вы уверены, что хотите удалить ассортимент в магазине?")){
        Storage.Reset();
        console.log("Ассортимент в магазине удалён");
    }
    else {
        console.log("Отмена удаления ассортимента");
    }
}