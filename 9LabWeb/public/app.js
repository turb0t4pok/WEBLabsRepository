import { ajax } from 'rxjs/ajax';
import { fromEvent, of, EMPTY } from 'rxjs';
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import './style.css';


const api = '/api/items';
const out = document.getElementById('out');

const addBtn = document.getElementById('addBtn');
const editBtn = document.getElementById('editBtn');
const delBtn = document.getElementById('delBtn');
const oneBtn = document.getElementById('oneBtn');
const reassignBtn = document.getElementById('reassignBtn');
const listBtn = document.getElementById('listBtn');
const hideBtn = document.getElementById('hideBtn');

let currentSortField = 'person';
let currentPage = 1;
let currentSearch = '';
let currentSort = 'asc';
const limit = 5;

const renderList = (data) => {
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
        <button id="searchBtn">Поиск</button>
        <button id="toggleSortBtn">Порядок (${currentSort === 'asc' ? '↑' : '↓'})</button>
        <button id="toggleSortFieldBtn">Сортировка по (${currentSortField === 'person' ? 'Имени' : 'ID'})</button>

        <table class="list-table">
          <thead>
            <tr><th>ID</th><th>Имя</th><th>Тип</th><th>Текст</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <div style="margin-top: 10px;">
          <button id="prevPageBtn" ${data.page === 1 ? 'disabled' : ''}>Назад</button>
          Страница ${data.page} из ${data.totalPages}
          <button id="nextPageBtn" ${data.page === data.totalPages ? 'disabled' : ''}>Вперед</button>
        </div>
    `;

    attachInnerEvents();
};

function fetchList(page = 1) {
    const params = new URLSearchParams({
        search: currentSearch,
        sort: currentSort,
        sortField: currentSortField,
        page,
        limit
    });

    ajax.getJSON(`${api}?${params}`).subscribe(data => {
        renderList(data);
        currentPage = data.page;
    });
}

function attachInnerEvents() {
    const searchBtn = document.getElementById('searchBtn');
    const toggleSortBtn = document.getElementById('toggleSortBtn');
    const toggleSortFieldBtn = document.getElementById('toggleSortFieldBtn');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');

    fromEvent(searchBtn, 'click').subscribe(() => {
        const input = document.getElementById('searchInput');
        currentSearch = input.value;
        currentPage = 1;
        fetchList();
    });

    fromEvent(toggleSortBtn, 'click').subscribe(() => {
        currentSort = currentSort === 'asc' ? 'desc' : 'asc';
        fetchList();
    });

    fromEvent(toggleSortFieldBtn, 'click').subscribe(() => {
        currentSortField = currentSortField === 'person' ? 'id' : 'person';
        fetchList();
    });

    fromEvent(prevPageBtn, 'click').subscribe(() => {
        if (currentPage > 1) fetchList(currentPage - 1);
    });

    fromEvent(nextPageBtn, 'click').subscribe(() => {
        fetchList(currentPage + 1);
    });
}

fromEvent(hideBtn, 'click').subscribe(() => {
    out.innerHTML = '';
});

fromEvent(addBtn, 'click').pipe(
    switchMap(() => {
        const person = prompt('Имя?');
        if (!person) return EMPTY;
        const text = prompt('Сплетня?');
        if (!text) return EMPTY;
        const type = prompt('Тип (Безобидная/Угрожающая):') || 'Безобидная';

        return ajax.post(api, { person, text, type }, { 'Content-Type': 'application/json' });
    }),
    tap(() => fetchList())
).subscribe();

fromEvent(editBtn, 'click').pipe(
    switchMap(() => {
        const id = prompt('ID записи для редактирования:');
        if (!id) return EMPTY;
        const person = prompt('Новое имя (оставьте пустым, чтобы не менять):');
        const text = prompt('Новый текст сплетни (оставьте пустым, чтобы не менять):');
        const type = prompt('Новый тип (Безобидная/Угрожающая, оставьте пустым чтобы не менять):');

        const patch = {};
        if (person) patch.person = person;
        if (text) patch.text = text;
        if (type) patch.type = type;

        if (Object.keys(patch).length === 0) {
            alert('Ничего не изменено');
            return EMPTY;
        }

        return ajax.put(`${api}/${id}`, patch, { 'Content-Type': 'application/json' });
    }),
    tap(() => fetchList())
).subscribe();

fromEvent(delBtn, 'click').pipe(
    switchMap(() => {
        const id = prompt('ID для удаления:');
        if (!id) return EMPTY;
        return ajax.delete(`${api}/${id}`);
    }),
    tap(() => fetchList())
).subscribe();

fromEvent(oneBtn, 'click').pipe(
    switchMap(() => {
        const id = prompt('ID для поиска:');
        if (!id) return EMPTY;
        return ajax.getJSON(`${api}/${id}`).pipe(
            tap(item => {
                out.innerHTML = `
                <table class="list-table">
                  <thead>
                    <tr><th>ID</th><th>Имя</th><th>Тип</th><th>Текст</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>${item.id}</td><td>${item.person}</td><td>${item.type}</td><td>${item.text}</td></tr>
                  </tbody>
                </table>`;
            })
        );
    }),
    catchError(() => {
        out.innerHTML = '<p>Не найдено</p>';
        return of();
    })
).subscribe();

fromEvent(reassignBtn, 'click').pipe(
    switchMap(() => ajax.post('/api/reassign')),
    tap(() => fetchList())
).subscribe();

fromEvent(listBtn, 'click').subscribe(() => fetchList());