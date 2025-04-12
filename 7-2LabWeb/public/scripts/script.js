document.addEventListener('DOMContentLoaded', function() {
    const content = document.getElementById('content');
    const homeBtn = document.getElementById('homeBtn');
    const productsBtn = document.getElementById('productsBtn');
    const loadDataBtn = document.getElementById('loadDataBtn');
    
    const appState = {
        currentPage: '',
        weaponsData: null,
        isTableLoaded: false
    };

    const routes = {
        '#home': {
            file: 'home.html',
            hasTable: true
        },
        '#products': {
            file: 'products.html',
            hasTable: false
        },
        '': {
            file: 'home.html',
            hasTable: true
        }
    };

    async function loadPage(routeKey) {
        const route = routes[routeKey];
        try {
            const response = await fetch(`/pages/${route.file}`);
            if (!response.ok) throw new Error('Страница не найдена');
            
            appState.currentPage = routeKey;
            const html = await response.text();
            content.innerHTML = html;
            
            manageDataContainer(route.hasTable);
            
            activatePage();
            
            const showProductsBtn = content.querySelector('#showProducts');
            if (showProductsBtn) {
                showProductsBtn.addEventListener('click', () => navigateTo('#products'));
            }
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            content.innerHTML = `
                <section class="page active">
                    <h2>Ошибка загрузки</h2>
                    <p>${error.message}</p>
                    <button onclick="location.reload()">Обновить</button>
                </section>
            `;
        }
    }

    function manageDataContainer(shouldHaveTable) {
        let dataContainer = document.getElementById('dataContainer');
        
        if (shouldHaveTable) {
            if (!dataContainer) {
                dataContainer = document.createElement('div');
                dataContainer.id = 'dataContainer';
                dataContainer.className = 'container';
                content.appendChild(dataContainer);
            }
            
            if (appState.isTableLoaded && appState.weaponsData) {
                displayWeaponsTable(appState.weaponsData);
            }
        } else {
            if (dataContainer) {
                dataContainer.remove();
            }
        }
    }

    function activatePage() {
        const pages = content.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));
        
        const currentPage = content.querySelector('.page');
        if (currentPage) {
            currentPage.classList.add('active');
        }
    }

    function navigateTo(hash) {
        const routeKey = hash in routes ? hash : '';
        loadPage(routeKey);
        
        if (window.location.hash !== hash) {
            window.location.hash = hash;
        }
    }
    
    homeBtn.addEventListener('click', () => navigateTo('#home'));
    productsBtn.addEventListener('click', () => navigateTo('#products'));
    
    window.addEventListener('hashchange', () => {
        navigateTo(window.location.hash);
    });

    if (loadDataBtn) {
        loadDataBtn.addEventListener('click', async function() {
            const dataContainer = document.getElementById('dataContainer');
            if (!dataContainer) return;
            
            try {
                const response = await fetch('/data/weapons.json');
                if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
                
                appState.weaponsData = await response.json();
                appState.isTableLoaded = true;
                displayWeaponsTable(appState.weaponsData);
            } catch (error) {
                console.error('Ошибка загрузки:', error);
                dataContainer.innerHTML = `<div class="error">${error.message}</div>`;
            }
        });
    }

    function displayWeaponsTable(weapons) {
        const dataContainer = document.getElementById('dataContainer');
        if (!dataContainer) return;
        
        dataContainer.innerHTML = '';
        
        const table = document.createElement('table');
        table.className = 'weapons-table';
        
        const headers = ['Название', 'Описание', 'Цена', 'Категория', 'Производитель'];
        const headerRow = document.createElement('tr');
        
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        table.appendChild(headerRow);
        
        Object.entries(weapons).forEach(([name, details]) => {
            const row = document.createElement('tr');
            
            [name, details.описание, details.цена, details.категория, details.производитель]
                .forEach(text => {
                    const td = document.createElement('td');
                    td.textContent = text;
                    row.appendChild(td);
                });
            
            table.appendChild(row);
        });
        
        dataContainer.appendChild(table);
    }
    
    navigateTo(window.location.hash || '#home');
});