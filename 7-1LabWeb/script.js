document.addEventListener('DOMContentLoaded', function() {
    const homePage = document.getElementById('homePage');
    const productsPage = document.getElementById('productsPage');
    
    const homeBtn = document.getElementById('homeBtn');
    const productsBtn = document.getElementById('productsBtn');
    const showProductsBtn = document.getElementById('showProducts');

    const routes = {
        '#home': homePage,
        '#products': productsPage,
        '': homePage
    };

    function showPage(pageToShow) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        pageToShow.classList.add('active');
    }
    
    function navigateTo(hash) {
        const page = routes[hash] || routes[''];
        
        showPage(page);
        
        if (window.location.hash !== hash) {
            window.location.hash = hash;
        }
    }
    
    homeBtn.addEventListener('click', function() {
        navigateTo('#home');
    });
    
    productsBtn.addEventListener('click', function() {
        navigateTo('#products');
    });
    
    showProductsBtn.addEventListener('click', function() {
        navigateTo('#products');
    });
    
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash;
        const page = routes[hash] || routes[''];
        showPage(page);
    });
    
    const initialHash = window.location.hash;
    navigateTo(initialHash);
});