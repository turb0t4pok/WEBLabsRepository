const MenuA = [
    {
        name: 'Ножи',
        submenu: [
            {
                name: 'Охотничьи ножи',
                submenu: [
                    { name: 'Складные охотничьи', url: 'https://www.wildberries.by/catalog/sport/vidy-sporta/ohota-i-rybolovstvo/nozhi-turisticheskie' },
                    { name: 'Фиксированные клинки', url: '#' },
                    { name: 'Ножи для разделки', url: '#' }
                ]
            },
            {
                name: 'Тактические ножи',
                submenu: [
                    { name: 'Боевые ножи', url: '#' },
                    { name: 'Ножи выживания', url: '#' },
                    { name: 'Спецназовские модели', url: '#' }
                ]
            },
            {
                name: 'Кухонные ножи',
                submenu: [
                    { name: 'Шеф-ножи', url: '#' },
                    { name: 'Сантоку', url: '#' },
                    { name: 'Обвалочные ножи', url: '#' }
                ]
            }
        ]
    },
    {
        name: 'Мечи',
        submenu: [
            { name: 'Катаны', url: '#' },
            { name: 'Двуручные мечи', url: '#' },
            { name: 'Рыцарские мечи', url: '#' },
            { name: 'Тренировочные мечи', url: '#' }
        ]
    },
    {
        name: 'Топоры',
        submenu: [
            { name: 'Боевые топоры', url: '#' },
            { name: 'Метательные топоры', url: '#' },
            { name: 'Туристические топоры', url: '#' }
        ]
    },
    {
        name: 'Экзотика',
        submenu: [
            { name: 'Кинжалы', url: '#' },
            { name: 'Сюрикены', url: '#' },
            { name: 'Кастеты', url: '#' },
            { name: 'Боевые когти', url: '#' }
        ]
    },
    { name: 'Аксессуары', url: '#' },
];

function ShowMenu(MenuItemsA, ParentElem) {
    const menuList = document.createElement('ul');
    
    const menuClass = ParentElem.id === 'menuContainer' ? 'main-menu' : 'submenu';
    if (menuClass === 'main-menu') {
        menuList.id = 'mainMenu';
    } else {
        menuList.className = 'submenu';
    }
    
    MenuItemsA.forEach(item => {
        const menuItem = document.createElement('li');
        menuItem.className = 'menu-item';
        
        if (item.url) {
            const link = document.createElement('a');
            link.href = item.url;
            link.textContent = item.name;
            menuItem.appendChild(link);
        } else {
            menuItem.textContent = item.name;
        }
        
        if (item.submenu) {
            menuItem.classList.add('has-submenu');
            
            menuItem.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const openMenus = this.parentElement.querySelectorAll('.show');
                openMenus.forEach(menu => {
                    if (menu !== this.lastElementChild) {
                        menu.classList.remove('show');
                    }
                });
                
                if (this.lastElementChild) {
                    this.lastElementChild.classList.toggle('show');
                }
            });
            
            ShowMenu(item.submenu, menuItem);
        }
        
        menuList.appendChild(menuItem);
    });
    
    ParentElem.appendChild(menuList);
}

document.addEventListener('DOMContentLoaded', function() {
    const menuContainer = document.getElementById('menuContainer');
    ShowMenu(MenuA, menuContainer);
    
    document.addEventListener('click', function() {
        const openMenus = document.querySelectorAll('.submenu.show');
        openMenus.forEach(menu => {
            menu.classList.remove('show');
        });
    });
});