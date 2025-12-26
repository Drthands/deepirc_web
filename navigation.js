// navigation.js - Gestión específica de navegación

// Configurar navegación con hash
function setupHashNavigation() {
    // Detectar cambios en el hash
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        const validSections = ['landing', 'help', 'linking', 'contract', 'admin', 'recovery', 'downloads', 'patreon'];
        
        if (validSections.includes(hash)) {
            loadSection(hash);
        }
    });
    
    // Manejar clics en enlaces internos
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="#"]');
        if (link) {
            e.preventDefault();
            const hash = link.getAttribute('href').substring(1);
            const validSections = ['landing', 'help', 'linking', 'contract', 'admin', 'recovery', 'downloads', 'patreon'];
            
            if (validSections.includes(hash)) {
                loadSection(hash);
                history.pushState(null, '', `#${hash}`);
            }
        }
    });
}

// Mantener navegación visible
function keepNavigationVisible() {
    const nav = document.querySelector('nav');
    if (nav) {
        // Prevenir que se oculte
        nav.style.opacity = '1';
        nav.style.visibility = 'visible';
        nav.style.position = 'sticky';
        nav.style.top = '0';
        nav.style.zIndex = '100';
        nav.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        nav.style.backdropFilter = 'blur(10px)';
    }
    
    // Asegurar que los enlaces de navegación siempre sean visibles
    document.querySelectorAll('.nav-link').forEach(link => {
        link.style.display = 'flex';
        link.style.opacity = '1';
        link.style.visibility = 'visible';
    });
}

// Mejorar navegación en móviles
function enhanceMobileNavigation() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    // Asegurar que el contenedor de navegación sea scrollable horizontalmente
    const navContainer = nav.querySelector('.flex.flex-nowrap.gap-2');
    if (navContainer) {
        navContainer.style.overflowX = 'auto';
        navContainer.style.scrollbarWidth = 'thin';
        navContainer.style.scrollbarColor = '#00FF41 transparent';
        navContainer.style.WebkitOverflowScrolling = 'touch';
        
        // Prevenir que se oculte al hacer scroll
        navContainer.style.flexWrap = 'nowrap';
        navContainer.style.whiteSpace = 'nowrap';
    }
    
    // Asegurar que los enlaces no desaparezcan
    document.querySelectorAll('.nav-link').forEach(link => {
        link.style.flexShrink = '0';
        link.style.minWidth = 'max-content';
    });
}

// Inicializar navegación mejorada
function initializeEnhancedNavigation() {
    setupHashNavigation();
    keepNavigationVisible();
    enhanceMobileNavigation();
    
    // Verificar navegación periódicamente
    setInterval(() => {
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.offsetParent === null) {
                link.style.display = 'flex';
                link.style.visibility = 'visible';
            }
        });
    }, 1000);
}