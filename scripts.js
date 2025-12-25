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
    initializeApp();
    setupEventListeners();
    createMatrixEffect();
});

// Inicialización de la aplicación
function initializeApp() {
    // Determinar idioma
    const savedLang = localStorage.getItem('deepirc_lang');
    const browserLang = navigator.language.split('-')[0];
    appState.currentLang = savedLang || (translations[browserLang] ? browserLang : 'es');
    
    // Aplicar idioma
    applyLanguage(appState.currentLang);
    
    // Cargar parámetros de URL
    loadUrlParams();
    
    // Configurar animación de texto
    setupTypingAnimation();
    
    // Inicializar contenido dinámico
    loadDynamicContent();
    
    // Actualizar estado de conexión
    updateConnectionStatus();
    
    // Verificar si ya se aceptó el pacto
    checkPactStatus();
    
    // Configurar navegación
    setupNavigation();
}

// Configurar navegación
function setupNavigation() {
    // Navegación por hash en URL
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const validSections = ['landing', 'help', 'linking', 'contract', 'admin', 'recovery', 'downloads'];
        
        if (validSections.includes(hash)) {
            setTimeout(() => {
                showSection(hash);
            }, 100);
        }
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Selector de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            changeLanguage(lang);
        });
    });
    
    // Navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            showSection(section);
            
            // Actualizar URL
            history.pushState(null, '', `#${section}`);
        });
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
    
    // Botón de descarga
    document.getElementById('downloadApk')?.addEventListener('click', function(e) {
        downloadAPK();
    });
    
    // Manejar navegación del historial
    window.addEventListener('popstate', function() {
        if (window.location.hash) {
            const section = window.location.hash.substring(1);
            showSection(section);
        }
    });
}

// Función principal de acceso
async function handleAccess() {
    const tokenInput = document.getElementById('accessCode');
    const code = tokenInput.value.trim();
    const status = document.getElementById('statusMsg');
    const isAccepted = document.getElementById('acceptPact')?.checked || appState.pactAccepted;
    const urlParams = new URLSearchParams(window.location.search);
    const lang = appState.currentLang;

    // Verificar pacto
    if (!isAccepted) {
        status.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i>
                           <span data-i18n="status.pactError">ERROR: Debes aceptar el Pacto de Honor para proceder.</span>`;
        applyLanguage(lang);
        status.style.color = "#ef4444";
        
        // Resaltar el pacto
        highlightPactSection();
        return;
    }

    // Verificar clave maestra (root)
    if (code === config.MASTER_KEY) {
        appState.isAdmin = true;
        
        // Mostrar panel de admin y enlace de navegación
        const adminNav = document.getElementById('adminNav');
        if (adminNav) {
            adminNav.style.display = 'flex';
        }
        
        showSection('admin');
        
        // Actualizar estado
        status.innerHTML = `<i class="fas fa-shield-alt mr-2"></i>
                           <span data-i18n="status.rootAccess">ACCESO ROOT CONCEDIDO. BIENVENIDO, OPERADOR.</span>`;
        status.style.color = "#00FF41";
        
        // Cargar datos de admin
        loadAdminData();
        
        // Limpiar input
        tokenInput.value = "";
        return;
    }

    // Procesar token normal
    if (code.length >= 8) {
        status.innerHTML = `<i class="fas fa-sync-alt animate-spin mr-2"></i>
                           <span data-i18n="status.syncing">SINCRONIZANDO CON LA RED DEEP...</span>`;
        status.style.color = "#00FF41";
        applyLanguage(lang);

        try {
            const _supabase = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
            
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
                                   <span data-i18n="status.linked">VINCULACIÓN EXITOSA. Puedes volver a la App.</span>`;
                status.style.color = "#00FF41";
                applyLanguage(lang);
                
                // Mostrar sección del contrato (ya aceptado)
                setTimeout(() => {
                    showSection('contract');
                    
                    // Mostrar mensaje de éxito
                    const contractSection = document.getElementById('contract');
                    const successMessage = document.createElement('div');
                    successMessage.className = 'cyber-status p-4 mb-4 bg-green-900/20';
                    successMessage.innerHTML = `
                        <div class="flex items-center">
                            <i class="fas fa-check-circle text-green-400 mr-3"></i>
                            <span>PACTO YA ACEPTADO Y CUENTA VINCULADA</span>
                        </div>
                    `;
                    contractSection.querySelector('.cyber-card').prepend(successMessage);
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
                           <span data-i18n="status.invalidToken">ERROR: El token no es válido o está mal formateado.</span>`;
        status.style.color = "#ef4444";
        applyLanguage(lang);
    }
}

// Mostrar sección específica
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.remove('active');
    });
    
    // Desactivar todos los enlaces de navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Activar enlace correspondiente
        const correspondingLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
        if (correspondingLink) {
            correspondingLink.classList.add('active');
        }
        
        // Actualizar estado
        appState.currentSection = sectionId;
        
        // Scroll suave a la sección
        setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
        
        // Si es la sección de descargas, cargar información
        if (sectionId === 'downloads') {
            loadDownloadsInfo();
        }
    }
}

// Función para descargar APK
function downloadAPK() {
    // URL del APK (cambiar por la real)
    const apkUrl = 'https://deepirc.net/downloads/DeepIRC_v2.0.1.apk';
    const sha256Hash = 'a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcd';
    
    // Mostrar información de seguridad
    const downloadInfo = `
        ⚠️ VERIFICACIÓN DE SEGURIDAD REQUERIDA ⚠️
        
        Nombre: DeepIRC_v2.0.1.apk
        SHA-256: ${sha256Hash}
        Tamaño: 12.4 MB
        
        ANTES DE INSTALAR:
        1. Verifica la firma SHA-256
        2. Habilita "Fuentes desconocidas"
        3. Escanea con antivirus
        
        ¿Continuar con la descarga?
    `;
    
    if (confirm(downloadInfo)) {
        // Crear enlace temporal para descarga
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

// Cargar información de descargas
function loadDownloadsInfo() {
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
                            <span data-i18n="downloads.version">Versión 2.0.1</span>
                            <span data-i18n="downloads.size">Tamaño: 12.4 MB</span>
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
            
            <!-- Patreon -->
            <div class="cyber-card p-4 md:p-6 border-purple-500/30">
                <div class="flex items-center mb-4">
                    <i class="fab fa-patreon text-purple-400 text-2xl mr-3"></i>
                    <h4 class="text-lg md:text-xl font-bold text-purple-300" data-i18n="patreon.title">
                        APOYAR_DEEPIRC
                    </h4>
                </div>
                
                <p class="mb-4 text-purple-300/80 text-sm md:text-base" data-i18n="patreon.description">
                    Ayúdanos a mantener y mejorar DeepIRC.
                </p>
                
                <a href="https://patreon.com/deepirc" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="cyber-button bg-purple-600 border-purple-500 hover:bg-purple-700 inline-flex items-center mb-6">
                    <i class="fab fa-patreon mr-2"></i>
                    <span data-i18n="patreon.button">APOYAR EN PATREON</span>
                </a>
                
                <div class="mt-4 pt-4 border-t border-purple-900/30">
                    <h5 class="font-bold mb-3 text-purple-300" data-i18n="patreon.perks">
                        VENTAJAS PATREON
                    </h5>
                    <ul class="space-y-2 text-sm text-purple-300/80">
                        <li class="flex items-start">
                            <i class="fas fa-star text-purple-400 mt-1 mr-2"></i>
                            <span data-i18n="patreon.perk1">• Acceso anticipado a nuevas características</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-headset text-purple-400 mt-1 mr-2"></i>
                            <span data-i18n="patreon.perk2">• Soporte prioritario</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-award text-purple-400 mt-1 mr-2"></i>
                            <span data-i18n="patreon.perk3">• Insignia exclusiva en la app</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-crown text-purple-400 mt-1 mr-2"></i>
                            <span data-i18n="patreon.perk4">• Acceso al canal VIP en IRC</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    // Re-aplicar idioma
    applyLanguage(appState.currentLang);
    
    // Re-configurar event listener para el botón de descarga
    document.getElementById('downloadApk')?.addEventListener('click', downloadAPK);
}

// Actualizar estado del pacto
function updatePactStatus(isAccepted) {
    appState.pactAccepted = isAccepted;
    
    if (isAccepted) {
        localStorage.setItem('deepirc_pact_accepted', 'true');
        
        // Quitar indicador de requerido
        const contractNav = document.querySelector('.nav-link[data-section="contract"] .bg-red-500');
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
        const contractNav = document.querySelector('.nav-link[data-section="contract"] .bg-red-500');
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
    showSection('contract');
    
    // Resaltar el checkbox
    setTimeout(() => {
        const pactCheckbox = document.getElementById('acceptPact');
        const pactContainer = document.querySelector('.pact-checkbox');
        
        if (pactContainer) {
            // Añadir clase de highlight
            pactContainer.classList.add('highlight-pact');
            
            // Scroll al checkbox
            pactContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Parpadear el checkbox
            let blinkCount = 0;
            const blinkInterval = setInterval(() => {
                pactContainer.classList.toggle('highlight-pact-blink');
                
                blinkCount++;
                if (blinkCount >= 6) { // 3 parpadeos completos
                    clearInterval(blinkInterval);
                    pactContainer.classList.remove('highlight-pact-blink');
                    pactContainer.classList.add('highlight-pact');
                    
                    // Quitar highlight después de 2 segundos
                    setTimeout(() => {
                        pactContainer.classList.remove('highlight-pact');
                    }, 2000);
                }
            }, 300);
        }
    }, 300);
}

// Estado de la recuperación
const recoveryState = {
    currentStep: 1,
    countdownInterval: null,
    remainingTime: recoveryConfig.COUNTDOWN_TIME,
    recoveryData: null,
    currentLang: 'es'
};



// Inicializar la página de recuperación
function initializeRecovery() {
    // Determinar idioma
    const savedLang = localStorage.getItem('deepirc_lang');
    const browserLang = navigator.language.split('-')[0];
    recoveryState.currentLang = savedLang || (translations[browserLang] ? browserLang : 'es');
    
    // Aplicar idioma
    applyRecoveryLanguage(recoveryState.currentLang);
    
    // Configurar event listeners
    setupRecoveryListeners();
    
    // Configurar contador
    setupCountdown();
    
    // Actualizar pasos visualmente
    updateProgressSteps();
}

// Configurar event listeners específicos de recuperación
function setupRecoveryListeners() {
    // Selector de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            changeRecoveryLanguage(lang);
        });
    });
    
    // Auto-avanzar código de verificación
    document.getElementById('verifyCode').addEventListener('input', function(e) {
        // Formato automático: A1B2-C3D4-E5F6
        let value = this.value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
        
        if (value.length > 12) value = value.substring(0, 12);
        
        // Insertar guiones cada 4 caracteres
        if (value.length > 4) {
            value = value.substring(0, 4) + '-' + value.substring(4);
        }
        if (value.length > 9) {
            value = value.substring(0, 9) + '-' + value.substring(9);
        }
        
        this.value = value;
        
        // Auto-verificar si está completo
        if (value.length === 14) {
            setTimeout(() => document.getElementById('verifyCode').blur(), 100);
        }
    });
    
    // Permitir Enter para enviar
    document.getElementById('oldNick').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('masterPass').focus();
        }
    });
    
    document.getElementById('masterPass').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            startRecovery();
        }
    });
    
    document.getElementById('verifyCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            confirmRecovery();
        }
    });
}

// Aplicar idioma a elementos específicos de recuperación
function applyRecoveryLanguage(lang) {
    if (!translations[lang]) return;
    
    // Aplicar traducciones generales
    applyLanguage(lang);
    
    // Traducciones específicas de recuperación
    const elements = document.querySelectorAll('[data-i18n^="recovery."]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// Cambiar idioma
function changeRecoveryLanguage(lang) {
    if (!translations[lang]) return;
    
    recoveryState.currentLang = lang;
    localStorage.setItem('deepirc_lang', lang);
    
    // Actualizar botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Aplicar traducciones
    applyRecoveryLanguage(lang);
}

// Actualizar pasos de progreso visualmente
function updateProgressSteps() {
    const steps = document.querySelectorAll('.grid.grid-cols-3 > div');
    
    steps.forEach((step, index) => {
        const circle = step.querySelector('div');
        const text = step.querySelector('span');
        
        if (index + 1 < recoveryState.currentStep) {
            // Paso completado
            circle.classList.remove('border-green-900', 'bg-black');
            circle.classList.add('border-green-500', 'bg-green-950/30');
            text.classList.remove('text-green-900');
            text.classList.add('text-green-400');
        } else if (index + 1 === recoveryState.currentStep) {
            // Paso actual
            circle.classList.remove('border-green-900', 'bg-black');
            circle.classList.add('border-yellow-500', 'bg-yellow-950/30');
            circle.querySelector('span').classList.add('text-yellow-400');
            text.classList.remove('text-green-900');
            text.classList.add('text-yellow-400');
        } else {
            // Paso futuro
            circle.classList.remove('border-green-500', 'border-yellow-500', 'bg-green-950/30', 'bg-yellow-950/30');
            circle.classList.add('border-green-900', 'bg-black');
            circle.querySelector('span').classList.remove('text-yellow-400');
            circle.querySelector('span').classList.add('text-green-900');
            text.classList.remove('text-green-400', 'text-yellow-400');
            text.classList.add('text-green-900');
        }
    });
}

// Configurar contador de tiempo
function setupCountdown() {
    // Inicializar display
    updateCountdownDisplay();
}

function updateCountdownDisplay() {
    const minutes = Math.floor(recoveryState.remainingTime / 60);
    const seconds = recoveryState.remainingTime % 60;
    document.getElementById('countdown').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startCountdown() {
    if (recoveryState.countdownInterval) {
        clearInterval(recoveryState.countdownInterval);
    }
    
    recoveryState.remainingTime = recoveryConfig.COUNTDOWN_TIME;
    updateCountdownDisplay();
    
    recoveryState.countdownInterval = setInterval(() => {
        recoveryState.remainingTime--;
        updateCountdownDisplay();
        
        if (recoveryState.remainingTime <= 0) {
            clearInterval(recoveryState.countdownInterval);
            codeExpired();
        }
    }, 1000);
}

// Paso 1: Iniciar recuperación
async function startRecovery() {
    const nick = document.getElementById('oldNick').value.trim();
    const password = document.getElementById('masterPass').value;
    const status = document.getElementById('statusMsg');
    
    // Validaciones básicas
    if (!nick || nick.length < 3) {
        showError('recovery.errors.nickShort');
        return;
    }
    
    if (!password || password.length < 8) {
        showError('recovery.errors.passShort');
        return;
    }
    
    // Mostrar estado de carga
    status.classList.remove('hidden');
    status.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-sync-alt animate-spin mr-3"></i>
            <span data-i18n="recovery.status.searching">BUSCANDO HUELLA EN LA RED...</span>
        </div>
    `;
    applyRecoveryLanguage(recoveryState.currentLang);
    
    try {
        // Simulación de llamada a API (reemplazar con llamada real)
        await simulateAPICall(nick, password);
        
        // Si la API responde con éxito
        recoveryState.recoveryData = {
            nick: nick,
            emailHash: 'encrypted@email.com', // Esto vendría de la API
            requestId: generateRequestId()
        };
        
        // Avanzar al paso 2
        goToStep(2);
        
        // Iniciar contador
        startCountdown();
        
        // Simular envío de email
        status.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-envelope mr-3"></i>
                <span data-i18n="recovery.status.emailSent">EMAIL ENVIADO. Revisa tu bandeja de entrada.</span>
            </div>
        `;
        applyRecoveryLanguage(recoveryState.currentLang);
        
        // Guardar estado
        saveRecoveryState();
        
    } catch (error) {
        showError('recovery.errors.notFound');
    }
}

// Paso 2: Confirmar recuperación con código
async function confirmRecovery() {
    const code = document.getElementById('verifyCode').value.trim();
    const status = document.getElementById('statusMsg');
    
    // Validar formato del código
    const codeRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!codeRegex.test(code)) {
        showError('recovery.errors.invalidCode');
        return;
    }
    
    // Mostrar estado de verificación
    status.classList.remove('hidden');
    status.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-shield-alt animate-pulse mr-3"></i>
            <span data-i18n="recovery.status.verifying">VERIFICANDO CÓDIGO DE SEGURIDAD...</span>
        </div>
    `;
    applyRecoveryLanguage(recoveryState.currentLang);
    
    try {
        // Simular verificación (reemplazar con llamada real)
        await simulateVerification(code);
        
        // Generar token de recuperación
        const recoveryToken = generateRecoveryToken();
        recoveryState.recoveryData.token = recoveryToken;
        
        // Avanzar al paso 3
        goToStep(3);
        
        // Mostrar token
        document.getElementById('recoveryToken').value = recoveryToken;
        
        // Generar QR (simulado - en producción usar librería QR)
        simulateQRCode(recoveryToken);
        
        // Actualizar estado
        status.innerHTML = `
            <div class="flex items-center text-green-400">
                <i class="fas fa-check-circle mr-3"></i>
                <span data-i18n="recovery.status.success">¡IDENTIDAD RECUPERADA CON ÉXITO!</span>
            </div>
        `;
        applyRecoveryLanguage(recoveryState.currentLang);
        
        // Guardar estado
        saveRecoveryState();
        
        // Limpiar contador
        if (recoveryState.countdownInterval) {
            clearInterval(recoveryState.countdownInterval);
        }
        
    } catch (error) {
        showError('recovery.errors.wrongCode');
    }
}

// Reenviar código
function resendCode() {
    const status = document.getElementById('statusMsg');
    
    status.classList.remove('hidden');
    status.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-paper-plane mr-3"></i>
            <span data-i18n="recovery.status.resending">REENVIANDO CÓDIGO...</span>
        </div>
    `;
    applyRecoveryLanguage(recoveryState.currentLang);
    
    // Simular reenvío
    setTimeout(() => {
        status.innerHTML = `
            <div class="flex items-center text-green-400">
                <i class="fas fa-check mr-3"></i>
                <span data-i18n="recovery.status.resent">CÓDIGO REENVIADO. Revisa tu email.</span>
            </div>
        `;
        applyRecoveryLanguage(recoveryState.currentLang);
        
        // Reiniciar contador
        startCountdown();
    }, 1500);
}

// Copiar token al portapapeles
function copyToken() {
    const tokenInput = document.getElementById('recoveryToken');
    tokenInput.select();
    tokenInput.setSelectionRange(0, 99999); // Para móviles
    
    try {
        const successful = navigator.clipboard.writeText(tokenInput.value);
        
        // Mostrar confirmación
        const originalValue = tokenInput.value;
        tokenInput.value = translations[recoveryState.currentLang]?.['recovery.copied'] || '¡COPIADO!';
        
        setTimeout(() => {
            tokenInput.value = originalValue;
        }, 2000);
        
    } catch (err) {
        console.error('Error al copiar:', err);
    }
}

// Reiniciar proceso de recuperación
function restartRecovery() {
    if (confirm(translations[recoveryState.currentLang]?.['recovery.confirmRestart'] || 
                '¿Estás seguro de que quieres reiniciar el proceso?')) {
        
        // Resetear estado
        recoveryState.currentStep = 1;
        recoveryState.recoveryData = null;
        
        // Limpiar formularios
        document.getElementById('oldNick').value = '';
        document.getElementById('masterPass').value = '';
        document.getElementById('verifyCode').value = '';
        
        // Ocultar pasos 2 y 3
        document.getElementById('step2').classList.add('hidden');
        document.getElementById('step3').classList.add('hidden');
        
        // Mostrar paso 1
        document.getElementById('step1').classList.remove('hidden');
        
        // Ocultar mensaje de estado
        document.getElementById('statusMsg').classList.add('hidden');
        
        // Actualizar pasos visuales
        updateProgressSteps();
        
        // Limpiar contador
        if (recoveryState.countdownInterval) {
            clearInterval(recoveryState.countdownInterval);
        }
        recoveryState.remainingTime = recoveryConfig.COUNTDOWN_TIME;
        updateCountdownDisplay();
        
        // Limpiar almacenamiento local
        localStorage.removeItem(recoveryConfig.STORAGE_KEY);
    }
}

// Navegar entre pasos
function goToStep(step) {
    recoveryState.currentStep = step;
    
    // Ocultar todos los pasos
    document.getElementById('step1').classList.add('hidden');
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step3').classList.add('hidden');
    
    // Mostrar paso actual
    document.getElementById(`step${step}`).classList.remove('hidden');
    
    // Actualizar pasos visuales
    updateProgressSteps();
}

// Mostrar error
function showError(errorKey) {
    const status = document.getElementById('statusMsg');
    status.classList.remove('hidden');
    
    const errorMessage = translations[recoveryState.currentLang]?.[errorKey] || 
                        translations[recoveryState.currentLang]?.['recovery.errors.generic'] ||
                        'Error desconocido';
    
    status.innerHTML = `
        <div class="flex items-center text-red-400">
            <i class="fas fa-exclamation-circle mr-3"></i>
            <span>${errorMessage}</span>
        </div>
    `;
}

// Código expirado
function codeExpired() {
    const status = document.getElementById('statusMsg');
    status.classList.remove('hidden');
    
    status.innerHTML = `
        <div class="flex items-center text-red-400">
            <i class="fas fa-clock mr-3"></i>
            <span data-i18n="recovery.errors.codeExpired">CÓDIGO EXPIRADO. Por favor, solicita uno nuevo.</span>
        </div>
    `;
    applyRecoveryLanguage(recoveryState.currentLang);
    
    // Deshabilitar botón de confirmación
    const confirmButton = document.querySelector('#step2 button');
    confirmButton.disabled = true;
    confirmButton.classList.add('opacity-50', 'cursor-not-allowed');
}

// Alternar visibilidad de contraseña
function togglePassword() {
    const passInput = document.getElementById('masterPass');
    const toggleIcon = passInput.nextElementSibling.querySelector('i');
    
    if (passInput.type === 'password') {
        passInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Funciones auxiliares
function generateRecoveryToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    
    for (let i = 0; i < recoveryConfig.TOKEN_LENGTH; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return token;
}

function generateRequestId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function simulateAPICall(nick, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulación: siempre éxito para demo
            // En producción, aquí iría la llamada real a Supabase Edge Function
            resolve({
                success: true,
                email: 'user@example.com',
                requestId: generateRequestId()
            });
        }, 2000);
    });
}

function simulateVerification(code) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulación: código "123456" siempre válido para demo
            if (code.replace(/-/g, '') === '123456789ABC') {
                resolve({ success: true });
            } else {
                // Para demo, aceptar cualquier código que tenga el formato correcto
                if (code.match(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/)) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Código inválido'));
                }
            }
        }, 1500);
    });
}

function simulateQRCode(token) {
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = `
        <div class="w-full h-full flex items-center justify-center bg-gray-100 rounded">
            <div class="text-center">
                <div class="text-4xl mb-2">📱</div>
                <p class="text-xs text-gray-600">QR Code Simulado</p>
                <p class="text-xs font-mono mt-2">${token.substring(0, 8)}...</p>
            </div>
        </div>
    `;
}

// Guardar estado de recuperación
function saveRecoveryState() {
    const state = {
        currentStep: recoveryState.currentStep,
        recoveryData: recoveryState.recoveryData,
        timestamp: Date.now()
    };
    
    localStorage.setItem(recoveryConfig.STORAGE_KEY, JSON.stringify(state));
}

// Cargar estado de recuperación
function loadRecoveryState() {
    try {
        const saved = localStorage.getItem(recoveryConfig.STORAGE_KEY);
        if (saved) {
            const state = JSON.parse(saved);
            const now = Date.now();
            const oneHour = 60 * 60 * 1000;
            
            // Solo cargar si tiene menos de 1 hora
            if (now - state.timestamp < oneHour) {
                recoveryState.currentStep = state.currentStep;
                recoveryState.recoveryData = state.recoveryData;
                
                // Navegar al paso guardado
                if (recoveryState.currentStep > 1) {
                    goToStep(recoveryState.currentStep);
                    
                    // Restaurar datos si existen
                    if (state.recoveryData?.nick) {
                        document.getElementById('oldNick').value = state.recoveryData.nick;
                    }
                    
                    if (state.recoveryData?.token) {
                        document.getElementById('recoveryToken').value = state.recoveryData.token;
                        simulateQRCode(state.recoveryData.token);
                    }
                    
                    // Si estamos en paso 2, iniciar contador
                    if (recoveryState.currentStep === 2) {
                        startCountdown();
                    }
                }
            } else {
                // Estado expirado, limpiar
                localStorage.removeItem(recoveryConfig.STORAGE_KEY);
            }
        }
    } catch (error) {
        console.error('Error loading recovery state:', error);
        localStorage.removeItem(recoveryConfig.STORAGE_KEY);
    }
}