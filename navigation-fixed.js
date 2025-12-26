// navigation-fixed.js - Solución definitiva para navegación

// Configuración simplificada
function setupFixedNavigation() {
    console.log("Configurando navegación fija...");
    
    // 1. Prevenir comportamientos por defecto en todos los enlaces
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.hash && link.hash.startsWith('#')) {
            e.preventDefault();
            e.stopPropagation();
            
            const sectionId = link.hash.substring(1);
            console.log("Clic en enlace:", sectionId);
            
            if (sectionId) {
                // Cambiar sección
                switchSection(sectionId);
                
                // Actualizar URL
                history.pushState({ section: sectionId }, '', `#${sectionId}`);
            }
            return false;
        }
    });
    
    // 2. Manejar estado del historial
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.section) {
            switchSection(event.state.section);
        }
    });
    
    // 3. Cargar sección inicial
    const initialHash = window.location.hash.substring(1);
    if (initialHash && isValidSection(initialHash)) {
        setTimeout(() => switchSection(initialHash), 100);
    } else {
        switchSection('landing');
    }
    
    // 4. Asegurar que la navegación sea siempre visible
    ensureNavVisibility();
}

// Cambiar sección
function switchSection(sectionId) {
    console.log("Cambiando a sección:", sectionId);
    
    if (!isValidSection(sectionId)) {
        console.warn("Sección inválida:", sectionId);
        return;
    }
    
    // 1. Ocultar todas las secciones
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // 2. Desactivar todos los enlaces de navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // 3. Mostrar la sección objetivo
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        setTimeout(() => {
            targetSection.classList.add('active');
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 10);
    } else {
        console.error("Sección no encontrada:", sectionId);
    }
    
    // 4. Activar el enlace correspondiente
    const navLink = document.querySelector(`.nav-link[data-section="${sectionId}"], a[href="#${sectionId}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }
    
    // 5. Cargar contenido dinámico si es necesario
    loadDynamicContentForSection(sectionId);
    
    console.log("Sección cambiada exitosamente a:", sectionId);
}

// Verificar si la sección es válida
function isValidSection(sectionId) {
    const validSections = [
        'landing', 'help', 'linking', 'contract', 
        'admin', 'recovery', 'downloads', 'patreon'
    ];
    return validSections.includes(sectionId);
}

// Asegurar que la navegación sea visible
function ensureNavVisibility() {
    const nav = document.querySelector('nav');
    if (nav) {
        // Forzar visibilidad
        nav.style.opacity = '1';
        nav.style.visibility = 'visible';
        nav.style.display = 'block';
        nav.style.position = 'sticky';
        nav.style.top = '0';
        nav.style.zIndex = '1000';
        nav.style.backgroundColor = 'rgba(0, 0, 0, 0.98)';
        nav.style.backdropFilter = 'blur(10px)';
        nav.style.borderBottom = '1px solid rgba(0, 255, 65, 0.2)';
        
        // Prevenir cualquier ocultamiento
        nav.style.pointerEvents = 'auto';
        nav.style.userSelect = 'auto';
    }
    
    // Asegurar que los enlaces sean clickeables
    document.querySelectorAll('.nav-link').forEach(link => {
        link.style.pointerEvents = 'auto';
        link.style.opacity = '1';
        link.style.cursor = 'pointer';
        link.style.userSelect = 'auto';
        
        // Prevenir efectos no deseados
        link.onmouseenter = null;
        link.onmouseleave = null;
    });
}

// Cargar contenido dinámico
async function loadDynamicContentForSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section || section.innerHTML.trim().length > 100) {
        return; // Ya tiene contenido
    }
    
    console.log("Cargando contenido para:", sectionId);
    
    try {
        switch(sectionId) {
            case 'patreon':
                await loadPatreonContent();
                break;
            case 'downloads':
                await loadDownloadsContent();
                break;
            case 'help':
                await loadHelpContent();
                break;
            // Añadir más casos según necesites
        }
    } catch (error) {
        console.error("Error cargando contenido:", error);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado, inicializando navegación...");
    setTimeout(setupFixedNavigation, 100);
});

// También inicializar cuando todo esté cargado
window.addEventListener('load', function() {
    console.log("Página completamente cargada");
    ensureNavVisibility();
});