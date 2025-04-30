const api = '/api/items';
const out = document.getElementById('out');
let currentSortField = 'person';

export function hide() { out.innerHTML = ''; }

export async function add() {
    const person = prompt('Имя?');
    if (!person) return;
    const text = prompt('Сплетня?');
    if (!text) return;
    const type = prompt('Тип (Безобидная/Угрожающая):') || 'Безобидная';

    await fetch(api, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({person, text, type})
    });
    await list();
}

export async function edit() {
    const id = prompt('ID записи для редактирования:'); if (!id) return;
    const person = prompt('Новое имя (оставьте пустым, чтобы не менять):');
    const text = prompt('Новый текст сплетни (оставьте пустым, чтобы не менять):');
    const type = prompt('Новый тип (Безобидная/Угрожающая, оставьте пустым чтобы не менять):');

    const patch = {};
    if (person) patch.person = person;
    if (text)   patch.text = text;
    if (type)   patch.type = type;

    if (Object.keys(patch).length === 0) return alert('Ничего не изменено');

    await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
    });

    await list();
}

export async function del() {
    const id = prompt('ID для удаления:'); if (!id) return;
    await fetch(`${api}/${id}`, { method:'DELETE' });
    await list();
}

export async function one() {
    const id = prompt('ID для поиска:');
    if (!id) return;
    const r = await fetch(`${api}/${id}`);
    if (r.status !== 200) {
        out.innerHTML = '<p>Не найдено</p>';
        return;
    }
    const { id: itemId, person, type, text } = await r.json();

    out.innerHTML = `
    <table class="list-table">
      <thead>
        <tr><th>ID</th><th>Имя</th><th>Тип</th><th>Текст</th></tr>
      </thead>
      <tbody>
        <tr><td>${itemId}</td><td>${person}</td><td>${type}</td><td>${text}</td></tr>
      </tbody>
    </table>
    `;
}

async function reassign() {
    await fetch('/api/reassign', { method:'POST' });
    await list();
}

let currentPage = 1;
let currentSearch = '';
let currentSort = 'asc';
const limit = 5;

export async function list(page = 1) {
    const params = new URLSearchParams({
        search: currentSearch,
        sort: currentSort,
        sortField: currentSortField,
        page,
        limit
    });

    const response = await fetch(`${api}?${params}`);
    const data = await response.json();

    if (!data.items.length) {
        out.innerHTML = '<p>Пока нет записей</p>';
        return;
    }

    const rows = data.items.map(
        ({ id, person, type, text }) =>
            `<tr><td>${id}</td><td>${person}</td><td>${type}</td><td>${text}</td></tr>`
    ).join('');

    out.innerHTML = `
        <input type="text" id="searchInput" placeholder="Поиск по имени..." value="${currentSearch}">
        <button onclick="search()">Поиск</button>
        <button onclick="toggleSort()">Порядок (${currentSort === 'asc' ? '↑' : '↓'})</button>
        <button onclick="toggleSortField()">Сортировка по (${currentSortField === 'person' ? 'Имени' : 'ID'})</button>
        
        <table class="list-table">
          <thead>
            <tr><th>ID</th><th>Имя</th><th>Тип</th><th>Текст</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        
        <div style="margin-top: 10px;">
          <button ${data.page === 1 ? 'disabled' : ''} onclick="prevPage()">Назад</button>
          Страница ${data.page} из ${data.totalPages}
          <button ${data.page === data.totalPages ? 'disabled' : ''} onclick="nextPage()">Вперед</button>
        </div>
    `;

    currentPage = data.page;
}

window.toggleSortField = function () {
    currentSortField = currentSortField === 'person' ? 'id' : 'person';
    list().catch(console.error);
};

window.search = function () {
    const input = document.getElementById('searchInput');
    currentSearch = input.value;
    currentPage = 1;
    list().catch(console.error);
};

window.toggleSort = function () {
    currentSort = currentSort === 'asc' ? 'desc' : 'asc';
    list().catch(console.error);
};

window.prevPage = function () {
    if (currentPage > 1) {
        list(currentPage - 1).catch(console.error);
    }
};

window.nextPage = async function () {
    list(currentPage + 1).catch(console.error);
};

Object.assign(globalThis, { list, hide, add, del, one, reassign, edit });