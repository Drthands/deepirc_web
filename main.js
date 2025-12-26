// main.js - Configuración principal corregida

// Configuración y variables globales
const config = {
    SUPABASE_URL: 'https://bbbqjzjaivzrywwkczry.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiYnFqemphaXZ6cnl3d2tjenJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMjkwMzAsImV4cCI6MjA4MTkwNTAzMH0.6bMDVnoOhiigahZOJU7e59Nn6q95Kop4U4h9iwEtAhQ',
    MASTER_KEY: "DEEP_DRTHANDS_2025",
    VERSION: "2.0.1"
};

// Estado de la aplicación
const appState = {
    currentLang: 'es',
    currentSection: 'landing',
    isAdmin: false,
    userData: null,
    pactAccepted: false
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log("DeepIRC - Inicializando aplicación");
    initializeApp();
    setupEventListeners();
    
    // Inicializar efectos si existen
    if (typeof createMatrixEffect === 'function') {
        createMatrixEffect();
    }
    
    if (typeof setupTypingAnimation === 'function') {
        setupTypingAnimation();
    }
});

// Inicialización de la aplicación
function initializeApp() {
    console.log("Inicializando aplicación...");
    
    // Determinar idioma
    const savedLang = localStorage.getItem('deepirc_lang');
    const browserLang = navigator.language.split('-')[0];
    appState.currentLang = savedLang || (translations && translations[browserLang] ? browserLang : 'es');
    
    // Aplicar idioma si existe translations
    if (typeof applyLanguage === 'function') {
        applyLanguage(appState.currentLang);
    }
    
    // Verificar si ya se aceptó el pacto
    checkPactStatus();
    
    // Cargar sección inicial basada en hash
    loadInitialSection();
}

// Cargar sección inicial
function loadInitialSection() {
    const hash = window.location.hash.substring(1);
    const validSections = ['landing', 'help', 'linking', 'contract', 'admin', 'recovery', 'downloads', 'patreon'];
    
    console.log("Hash actual:", hash);
    
    if (hash && validSections.includes(hash)) {
        setTimeout(() => {
            loadSection(hash);
        }, 100);
    } else {
        // Mostrar landing por defecto
        loadSection('landing');
    }
}

// Configurar event listeners
function setupEventListeners() {
    console.log("Configurando event listeners...");
    
    // Selector de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const lang = this.dataset.lang;
            changeLanguage(lang);
        });
    });
    
    // Navegación - MANERA MÁS SIMPLE Y FUNCIONAL
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const sectionId = href.substring(1);
                console.log("Clic en navegación:", sectionId);
                
                // Cambiar sección
                loadSection(sectionId);
                
                // Actualizar URL
                history.pushState({ section: sectionId }, '', href);
            }
            return false;
        });
    });
    
    // Manejar navegación del historial
    window.addEventListener('popstate', function(event) {
        if (window.location.hash) {
            const sectionId = window.location.hash.substring(1);
            loadSection(sectionId);
        }
    });
    
    // Auto-rellenar token con Enter
    document.getElementById('accessCode')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleAccess();
        }
    });
    
    // Pacto checkbox
    document.getElementById('acceptPact')?.addEventListener('change', function() {
        updatePactStatus(this.checked);
    });
}

// Función principal para cambiar sección
function loadSection(sectionId) {
    console.log("Cargando sección:", sectionId);
    
    // Validar sección
    const validSections = ['landing', 'help', 'linking', 'contract', 'admin', 'recovery', 'downloads', 'patreon'];
    if (!validSections.includes(sectionId)) {
        console.warn("Sección inválida:", sectionId);
        sectionId = 'landing';
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
    
    // 3. Activar el enlace correspondiente
    const navLink = document.querySelector(`a[href="#${sectionId}"], .nav-link[href="#${sectionId}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }
    
    // 4. Mostrar la sección objetivo
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // Pequeño delay para asegurar que el display se aplique
        setTimeout(() => {
            targetSection.classList.add('active');
            
            // Scroll suave a la sección
            targetSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
            });
        }, 10);
        
        // Actualizar estado
        appState.currentSection = sectionId;
        
        // Cargar contenido dinámico si es necesario
        loadDynamicContent(sectionId);
        
        console.log("Sección cargada exitosamente:", sectionId);
    } else {
        console.error("Sección no encontrada:", sectionId);
        // Fallback a landing
        loadSection('landing');
    }
}

// Cargar contenido dinámico para sección
function loadDynamicContent(sectionId) {
    // Si ya tiene contenido, no hacer nada
    const section = document.getElementById(sectionId);
    if (!section || section.innerHTML.trim().length > 500) {
        return;
    }
    
    console.log("Cargando contenido dinámico para:", sectionId);
    
    // Cargar contenido específico
    switch(sectionId) {
        case 'downloads':
            loadDownloadsContent();
            break;
        case 'patreon':
            loadPatreonContent();
            break;
        case 'help':
            loadHelpContent();
            break;
        case 'contract':
            loadContractContent();
            break;
        // Añadir más casos según necesites
    }
}

// Función para cargar contenido de descargas
function loadDownloadsContent() {
    const section = document.getElementById('downloads');
    if (!section) return;
    
    section.innerHTML = `
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
                            <span data-i18n="downloads.version">Versión 2.0.1</span>
                            <span data-i18n="downloads.size">Tamaño: 12.4 MB</span>
                            <span data-i18n="downloads.security">Verificado: SHA-256</span>
                        </div>
                    </div>
                    <button id="downloadApkBtn" class="cyber-button mt-4 md:mt-0 px-6 py-3">
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
    
    // Aplicar idioma
    if (typeof applyLanguage === 'function') {
        applyLanguage(appState.currentLang);
    }
    
    // Configurar botón de descarga
    document.getElementById('downloadApkBtn')?.addEventListener('click', downloadAPK);
}

// Función para descargar APK
function downloadAPK() {
    const apkUrl = 'https://deepirc.net/downloads/DeepIRC_v2.0.1.apk';
    const sha256Hash = 'a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcd';
    
    const downloadInfo = `⚠️ VERIFICACIÓN DE SEGURIDAD REQUERIDA ⚠️\n\nNombre: DeepIRC_v2.0.1.apk\nSHA-256: ${sha256Hash}\nTamaño: 12.4 MB\n\n¿Continuar con la descarga?`;
    
    if (confirm(downloadInfo)) {
        const downloadLink = document.createElement('a');
        downloadLink.href = apkUrl;
        downloadLink.download = 'DeepIRC_v2.0.1.apk';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Mostrar mensaje de éxito
        const status = document.getElementById('downloadStatus');
        if (status) {
            status.innerHTML = `
                <div class="cyber-status p-4 mt-4">
                    <div class="flex items-center">
                        <i class="fas fa-download text-green-400 mr-3"></i>
                        <div>
                            <strong>DESCARGA INICIADA</strong>
                            <p class="text-sm mt-1">Verifica la firma SHA-256 antes de instalar.</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

// Función principal de acceso
async function handleAccess() {
    const tokenInput = document.getElementById('accessCode');
    const code = tokenInput?.value.trim();
    const status = document.getElementById('statusMsg');
    const isAccepted = document.getElementById('acceptPact')?.checked || appState.pactAccepted;
    
    if (!tokenInput || !status) {
        console.error("Elementos del formulario no encontrados");
        return;
    }
    
    // Verificar pacto
    if (!isAccepted) {
        status.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i>
                           <span>ERROR: Debes aceptar el Pacto de Honor para proceder.</span>`;
        status.style.color = "#ef4444";
        
        // Resaltar el pacto
        highlightPactSection();
        return;
    }
    
    // Verificar clave maestra (root)
    if (code === config.MASTER_KEY) {
        appState.isAdmin = true;
        localStorage.setItem('deepirc_is_admin', 'true');
        
        // Mostrar panel de admin
        const adminNav = document.getElementById('adminNav');
        if (adminNav) {
            adminNav.style.display = 'flex';
        }
        
        loadSection('admin');
        
        // Actualizar estado
        status.innerHTML = `<i class="fas fa-shield-alt mr-2"></i>
                           <span>ACCESO ROOT CONCEDIDO. BIENVENIDO, OPERADOR.</span>`;
        status.style.color = "#00FF41";
        
        // Limpiar input
        tokenInput.value = "";
        return;
    }
    
    // Procesar token normal
    if (code && code.length >= 8) {
        status.innerHTML = `<i class="fas fa-sync-alt animate-spin mr-2"></i>
                           <span>SINCRONIZANDO CON LA RED DEEP...</span>`;
        status.style.color = "#00FF41";
        
        try {
            const _supabase = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
            const urlParams = new URLSearchParams(window.location.search);
            
            const { data, error } = await _supabase
                .from('device_registrations')
                .upsert({ 
                    device_hash: code, 
                    nick: urlParams.get('nick') || 'Anon',
                    email: urlParams.get('email') || 'Anon',
                    is_premium: (urlParams.get('plan') === 'premium'),
                    pacto_aceptado: true,
                    created_at: new Date().toISOString(),
                    last_access: new Date().toISOString()
                });
            
            if (error) {
                console.error("Supabase Error:", error);
                status.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>
                                   ERROR DE RED: ${error.message}`;
                status.style.color = "#ef4444";
            } else {
                console.log("Success:", data);
                status.innerHTML = `<i class="fas fa-check-circle mr-2"></i>
                                   <span>VINCULACIÓN EXITOSA. Puedes volver a la App.</span>`;
                status.style.color = "#00FF41";
                
                // Mostrar sección del contrato
                setTimeout(() => {
                    loadSection('contract');
                }, 1000);
            }
        } catch (err) {
            console.error("Crashed:", err);
            status.innerHTML = `<i class="fas fa-server mr-2"></i>
                               ERROR CRÍTICO: No se pudo contactar con el servidor.`;
            status.style.color = "#ef4444";
        }
    } else {
        status.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>
                           <span>ERROR: El token no es válido o está mal formateado.</span>`;
        status.style.color = "#ef4444";
    }
}

// Manejar cambio de idioma
function changeLanguage(lang) {
    if (!window.translations || !window.translations[lang]) {
        console.warn("Traducciones no disponibles para:", lang);
        return;
    }
    
    appState.currentLang = lang;
    localStorage.setItem('deepirc_lang', lang);
    
    // Actualizar botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Aplicar traducciones si existe la función
    if (typeof applyLanguage === 'function') {
        applyLanguage(lang);
    }
}

// Actualizar estado del pacto
function updatePactStatus(isAccepted) {
    appState.pactAccepted = isAccepted;
    
    if (isAccepted) {
        localStorage.setItem('deepirc_pact_accepted', 'true');
        
        // Quitar indicador de requerido
        const contractNav = document.querySelector('.nav-link[href="#contract"] .bg-red-500');
        if (contractNav) {
            contractNav.remove();
        }
        
        // Quitar botón flotante en móvil
        const quickAccessBtn = document.getElementById('contractQuickAccess');
        if (quickAccessBtn) {
            quickAccessBtn.style.display = 'none';
        }
    } else {
        localStorage.removeItem('deepirc_pact_accepted');
    }
}

// Verificar estado del pacto
function checkPactStatus() {
    const pactAccepted = localStorage.getItem('deepirc_pact_accepted');
    const pactCheckbox = document.getElementById('acceptPact');
    
    if (pactAccepted && pactCheckbox) {
        pactCheckbox.checked = true;
        appState.pactAccepted = true;
        
        // Quitar indicador de requerido
        const contractNav = document.querySelector('.nav-link[href="#contract"] .bg-red-500');
        if (contractNav) {
            contractNav.remove();
        }
        
        // Quitar botón flotante en móvil
        const quickAccessBtn = document.getElementById('contractQuickAccess');
        if (quickAccessBtn) {
            quickAccessBtn.style.display = 'none';
        }
    }
}

// Resaltar sección del pacto
function highlightPactSection() {
    loadSection('contract');
    
    setTimeout(() => {
        const pactCheckbox = document.getElementById('acceptPact');
        const pactContainer = document.querySelector('.pact-checkbox');
        
        if (pactContainer) {
            pactContainer.classList.add('highlight');
            
            pactContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            setTimeout(() => {
                pactContainer.classList.remove('highlight');
            }, 2000);
        }
    }, 300);
}

// Función auxiliar para ayuda del contrato
function scrollToContractHelp() {
    alert("El Pacto de Honor es un acuerdo de confianza mutua entre tú y DeepIRC. Establece las reglas básicas de uso y privacidad. Si tienes preguntas específicas, contacta a support@deepirc.net");
}

// Función para scroll al contrato
function scrollToContract() {
    loadSection('contract');
    
    setTimeout(() => {
        const pactCheckbox = document.getElementById('acceptPact');
        const pactContainer = document.querySelector('.pact-checkbox');
        
        if (pactContainer) {
            pactContainer.classList.add('highlight');
            
            pactContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            setTimeout(() => {
                pactContainer.classList.remove('highlight');
            }, 2000);
        }
    }, 300);
}

// Hacer funciones disponibles globalmente
window.handleAccess = handleAccess;
window.scrollToContract = scrollToContract;
window.scrollToContractHelp = scrollToContractHelp;
window.loadSection = loadSection;