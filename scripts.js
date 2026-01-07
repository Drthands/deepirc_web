/// scripts.js - Versión actualizada con carga de secciones específicas

// Configuración global
const config = {
    SUPABASE_URL: 'https://bbbqjzjaivzrywwkczry.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiYnFqemphaXZ6cnl3d2tjenJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMjkwMzAsImV4cCI6MjA4MTkwNTAzMH0.6bMDVnoOhiigahZOJU7e59Nn6q95Kop4U4h9iwEtAhQ',
    MASTER_KEY: "DEEP_DRTHANDS_2025",
    VERSION: "2.0.1"
};

const appState = {
    currentLang: 'es',
    currentSection: 'landing',
    isAdmin: false,
    userData: null,
    pactAccepted: false
};

// Función optimizada para mostrar secciones con carga dinámica
function showSection(sectionId) {
    console.log('Cambiando a sección:', sectionId);
    
    const nav = document.querySelector('.sticky-nav');
    const navHeight = nav ? Math.max(nav.offsetHeight, 50) : 50;
    
    // Ocultar todas las secciones
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.remove('active');
        section.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            opacity: 0;
            visibility: hidden;
            z-index: 1;
            pointer-events: none;
            padding-top: 0;
            min-height: 0;
        `;
    });
    
    // Desactivar enlaces
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // MÍNIMO ESPACIO: Solo 5-10px de separación
        const paddingTop = sectionId === 'landing' ? 5 : 10;
        
        targetSection.style.cssText = `
            position: relative;
            opacity: 1;
            visibility: visible;
            z-index: 2;
            pointer-events: auto;
            padding-top: ${paddingTop}px;
            min-height: calc(100vh - ${navHeight}px);
        `;
        
        // Activar enlace correspondiente
        const correspondingLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
        if (correspondingLink) {
            correspondingLink.classList.add('active');
        }
        
        // Actualizar URL
        history.replaceState(null, '', `#${sectionId}`);
        
        // Scroll suave
        setTimeout(() => {
            if (sectionId !== 'landing') {
                const scrollPosition = targetSection.offsetTop - navHeight + paddingTop;
                window.scrollTo({
                    top: Math.max(0, scrollPosition),
                    behavior: 'smooth'
                });
            }
        }, 50);
        
        // ===== CARGAR CONTENIDO ESPECÍFICO DE CADA SECCIÓN =====
        setTimeout(() => {
            switch(sectionId) {
                case 'downloads':
                    if (typeof loadDownloadsInfo === 'function') {
                        console.log('Cargando sección de descargas...');
                        loadDownloadsInfo();
                    } else {
                        console.error('loadDownloadsInfo no está definida');
                        // Crear contenido básico como fallback
                        createFallbackDownloads();
                    }
                    break;
                    
                case 'patreon':
                    if (typeof loadPatreonSection === 'function') {
                        console.log('Cargando sección de Patreon...');
                        loadPatreonSection();
                    } else {
                        console.error('loadPatreonSection no está definida');
                        // Crear contenido básico como fallback
                        createFallbackPatreon();
                    }
                    break;
                    
                case 'admin':
                    if (typeof loadAdminData === 'function') {
                        setTimeout(loadAdminData, 100);
                    }
                    break;
                    
                case 'recovery':
                    if (typeof initializeRecovery === 'function') {
                        setTimeout(initializeRecovery, 100);
                    }
                    break;
                    
                case 'linking':
                    // Limpiar campo de token al entrar
                    const tokenInput = document.getElementById('accessCode');
                    if (tokenInput) {
                        tokenInput.value = '';
                        tokenInput.focus();
                    }
                    break;
                    
                case 'contract':
                    // Verificar estado del pacto
                    if (typeof checkPactStatus === 'function') {
                        checkPactStatus();
                    }
                    break;
            }
        }, 100); // Pequeño delay para asegurar que el DOM esté listo
        
    } else {
        console.error('Sección no encontrada:', sectionId);
        showSection('landing');
    }
}

// Funciones fallback para cuando las funciones específicas no estén disponibles
function createFallbackDownloads() {
    // Cargar información de descargas
    const downloadsSection = document.getElementById('downloads');
    if (!downloadsSection) return;

    downloadsSection.innerHTML = `
        <div class="cyber-card p-6 md:p-8">
            <div class="flex items-center mb-6">
                <i class="fas fa-download text-green-400 text-2xl md:text-3xl mr-4"></i>
                <h3 class="text-xl md:text-2xl font-bold section-title">
                    <span data-i18n="downloads.title">>> DESCARGAR_DEEPIRC</span>
                </h3>
            </div>
            
            <p class="mb-6 text-green-300/80 text-sm md:text-base" data-i18n="downloads.description">
                Obten la última versión de DeepIRC para tu dispositivo.
            </p>
            
            <!-- Android APK -->
            <div class="cyber-card p-4 md:p-6 mb-6 border-green-500/30">
                <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                        <h4 class="text-lg md:text-xl font-bold text-green-300 mb-2" data-i18n="downloads.android">
                            ANDROID (APK)
                        </h4>
                        <div class="flex flex-wrap gap-4 text-sm text-green-400/70">
                            <span data-i18n="downloads.version">Versión 0.2.1</span>
                            <span data-i18n="downloads.size">Tamaño: 23.2 MB</span>
                            <span data-i18n="downloads.security">Verificado: SHA-256</span>
                        </div>
                    </div>
                    <button id="downloadApk" class="cyber-button mt-4 md:mt-0 px-6 py-3">
                        <i class="fas fa-download mr-2"></i>
                        <span data-i18n="downloads.button">DESCARGAR APK</span>
                    </button>
                </div>
                
                <div id="downloadStatus"></div> 
                
                <!-- Instrucciones -->
                <div class="mt-6 pt-4 border-t border-green-900/30">
                    <h5 class="font-bold mb-3 text-green-300" data-i18n="downloads.instructions">
                        INSTRUCCIONES DE INSTALACIÓN
                    </h5>
                    <ol class="space-y-2 text-sm text-green-300/80">
                        <li class="flex items-start">
                            <span class="font-bold mr-2">1.</span>
                            <span data-i18n="downloads.step1">Permite instalación desde fuentes desconocidas</span>
                        </li>
                        <li class="flex items-start">
                            <span class="font-bold mr-2">2.</span>
                            <span data-i18n="downloads.step2">Descarga e instala el archivo APK</span>
                        </li>
                        <li class="flex items-start">
                            <span class="font-bold mr-2">3.</span>
                            <span data-i18n="downloads.step3">Inicia DeepIRC y acepta el Pacto</span>
                        </li>
                    </ol>
                </div>
                
                <!-- Advertencia de seguridad -->
                <div class="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded">
                    <div class="flex items-start">
                        <i class="fas fa-exclamation-triangle text-yellow-500 mt-1 mr-3"></i>
                        <div>
                            <p class="text-sm text-yellow-300" data-i18n="downloads.warning">
                                ⚠️ IMPORTANTE: Siempre verifica la firma SHA-256
                            </p>
                            <p class="text-xs text-yellow-300/70 mt-1" data-i18n="downloads.support">
                                Soporte: support@deepirc.net
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Re-aplicar idioma
    applyLanguage(appState.currentLang);
    
    // ESPERAR a que el DOM actualice antes de asignar el event listener
    setTimeout(() => {
        const downloadBtn = document.getElementById('downloadApk');
        
        if (downloadBtn) {
            console.log('Botón encontrado, asignando event listener...');
            
            // Remover cualquier listener anterior
            downloadBtn.replaceWith(downloadBtn.cloneNode(true));
            
            // Obtener el nuevo botón clonado
            const newDownloadBtn = document.getElementById('downloadApk');
            
            // Asignar el event listener correctamente
            newDownloadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Botón de descarga clickeado');
                downloadAPK();
            });
            
            // También añadir un atributo onclick como backup
            newDownloadBtn.setAttribute('onclick', 'downloadAPK(); return false;');
            
            console.log('Event listener asignado exitosamente');
        } else {
            console.error('ERROR: Botón downloadApk no encontrado en el DOM');
            
            // Debug: mostrar todos los botones en la sección
            const allButtons = downloadsSection.querySelectorAll('button');
            console.log('Botones encontrados en la sección:', allButtons.length);
            allButtons.forEach((btn, index) => {
                console.log(`Botón ${index}:`, btn.id, btn.className);
            });
        }
    }, 50); // Pequeño delay para asegurar que el DOM se haya actualizado
}

// Función para descargar APK (versión corregida)
function downloadAPK() {
    const apkUrl = './downloads/deepirc_v0.2.1.rar';
    const fileName = 'deepirc_v0.2.1.rar';
    
    const confirmMessage = `¿Descargar DeepIRC v0.2.1?

📦 Archivo: ${fileName}
📱 Android APK (comprimido)
⚠️ IMPORTANTE:
1. Activa "Fuentes desconocidas" en Android
2. Extrae el archivo .rar antes de instalar
3. Verifica el hash SHA-256 después de descargar

¿Continuar con la descarga?`;
    
    if (confirm(confirmMessage)) {
        console.log('Iniciando descarga de:', apkUrl);
        
        // Crear enlace temporal
        const link = document.createElement('a');
        link.href = apkUrl;
        link.download = fileName;
        link.style.display = 'none';
        
        // Añadir al DOM
        document.body.appendChild(link);
        
        // Intentar descargar
        link.click();
        
        // Limpiar después
        setTimeout(() => {
            document.body.removeChild(link);
        }, 100);
        
        // Mostrar mensaje de éxito
        const status = document.getElementById('downloadStatus');
        if (status) {
            status.innerHTML = `
                <div class="download-success p-4 mt-4 border border-green-500 rounded-lg bg-green-900/20">
                    <div class="flex items-center">
                        <i class="fas fa-download text-green-400 mr-3 text-xl"></i>
                        <div>
                            <h4 class="font-bold text-green-300">Descarga iniciada</h4>
                            <p class="text-sm text-green-400/80 mt-1">
                                Archivo: <strong>${fileName}</strong>
                            </p>
                            <p class="text-xs text-green-600 mt-2">
                                Si la descarga no comienza, 
                                <a href="${apkUrl}" download="${fileName}" 
                                   class="underline text-green-400 ml-1" 
                                   onclick="event.stopPropagation();">
                                   haz clic aquí
                                </a>
                            </p>
                            <div class="mt-3 p-2 bg-black/30 rounded text-xs">
                                <p class="text-yellow-400 mb-1">⚠️ Nota: Archivo comprimido .rar</p>
                                <p class="text-green-400/70">Necesitarás WinRAR, 7-Zip o similar para extraer el APK</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Añadir event listener al enlace alternativo
            setTimeout(() => {
                const altLink = status.querySelector('a');
                if (altLink) {
                    altLink.addEventListener('click', function(e) {
                        e.preventDefault();
                        const tempLink = document.createElement('a');
                        tempLink.href = apkUrl;
                        tempLink.download = fileName;
                        document.body.appendChild(tempLink);
                        tempLink.click();
                        document.body.removeChild(tempLink);
                    });
                }
            }, 100);
            
            // Auto-eliminar después de 10 segundos
            setTimeout(() => {
                status.innerHTML = '';
            }, 10000);
        }
    }
}




function createFallbackPatreon() {
    const patreonSection = document.getElementById('patreon');
    if (!patreonSection) return;
    
    patreonSection.innerHTML = `
        <div class="cyber-card p-4">
            <div class="flex items-center mb-4">
                <i class="fab fa-patreon text-purple-400 text-xl mr-3"></i>
                <h3 class="text-lg font-bold">PATREON</h3>
            </div>
            
            <p class="mb-4 text-green-300/80">
                Apoya el desarrollo de DeepIRC y obtén beneficios exclusivos.
            </p>
            
            <a href="https://www.patreon.com/deepirc" 
               target="_blank" 
               rel="noopener noreferrer"
               class="cyber-button bg-purple-600 border-purple-500 block text-center">
                <i class="fab fa-patreon mr-2"></i>
                IR A PATREON
            </a>
        </div>
    `;
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
createMatrixEffect();

    // Configurar navegación sticky
    const nav = document.querySelector('nav');
    if (nav && !nav.classList.contains('sticky-nav')) {
        nav.classList.add('sticky-nav');
        
        // Crear contenedor de scroll para navegación
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'nav-scroll-container';
        
        // Mover todos los enlaces al contenedor de scroll
        const navLinks = Array.from(nav.children);
        navLinks.forEach(child => {
            if (child.classList.contains('nav-link') || child.tagName === 'A') {
                scrollContainer.appendChild(child);
            }
        });
        
        // Añadir contenedor de scroll a la nav
        nav.appendChild(scrollContainer);
    }
    
    // Configurar event listeners
    document.addEventListener('click', function(e) {
        const navLink = e.target.closest('.nav-link');
        if (navLink && navLink.dataset.section) {
            e.preventDefault();
            showSection(navLink.dataset.section);
        }
    });
    
    // Manejar hash inicial
    if (window.location.hash && window.location.hash.length > 1) {
        const hash = window.location.hash.substring(1);
        const validSections = ['landing', 'help', 'linking', 'contract', 'admin', 'recovery', 'downloads', 'patreon'];
        
        if (validSections.includes(hash)) {
            setTimeout(() => showSection(hash), 50);
            return;
        }
    }
    
    // Inicial con landing
    setTimeout(() => showSection('landing'), 30);
    
    // Efecto de scroll en navegación
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.sticky-nav');
        if (nav) {
            if (window.scrollY > 10) {
                nav.classList.add('scrolled');
                nav.style.height = '48px';
            } else {
                nav.classList.remove('scrolled');
                nav.style.height = '50px';
            }
        }
    });


});

// Función para manejar el acceso (si existe en tu código)
async function handleAccess() {
    // Tu código existente para manejar el acceso...
    console.log('handleAccess called');
}

// Exponer funciones globalmente
window.showSection = showSection;
window.handleAccess = handleAccess;

// Asegurarse de que las funciones específicas estén disponibles
if (typeof loadDownloadsInfo !== 'function') {
    console.warn('loadDownloadsInfo no está definida. Asegúrate de incluir downloads.js');
}

if (typeof loadPatreonSection !== 'function') {
    console.warn('loadPatreonSection no está definida. Asegúrate de incluir patreon.js');
}
