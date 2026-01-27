// Configuración y variables globales
const config = {
    SUPABASE_URL: 'https://bbbqjzjaivzrywwkczry.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiYnFqemphaXZ6cnl3d2tjenJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMjkwMzAsImV4cCI6MjA4MTkwNTAzMH0.6bMDVnoOhiigahZOJU7e59Nn6q95Kop4U4h9iwEtAhQ',
    // Hash MD5 de la clave encriptada consigo misma
    MASTER_KEY_HASH: "bb4b3d7d11c8e1e3e4c5d6a7b8c9d0e1", // Ejemplo: hash de "DEEP_DRTHANDS_2025" encriptado consigo mismo
    VERSION: "2.0.1"
};

// Estado de la aplicación
const appState = {
    currentLang: 'es',
    currentSection: 'landing',
    isAdmin: false,
    userData: null,
    pactAccepted: false,
    registrationData: null
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    // createMatrixEffect(); // Comentar si no existe esta función
    checkRegistrationParams();
});

// =================== FUNCIONES DE INICIALIZACIÓN ===================

function initializeApp() {
    // Determinar idioma
    const savedLang = localStorage.getItem('deepirc_lang');
    const browserLang = navigator.language.split('-')[0];
    appState.currentLang = savedLang || (translations && translations[browserLang] ? browserLang : 'es');
    
    // Aplicar idioma
    applyLanguage(appState.currentLang);
    
    // Cargar parámetros de URL
    loadUrlParams();
    
    // Configurar animación de texto si existe
    if (typeof setupTypingAnimation === 'function') {
        setupTypingAnimation();
    }
    
    // Inicializar contenido dinámico si existe
    if (typeof loadDynamicContent === 'function') {
        loadDynamicContent();
    }
    
    // Actualizar estado de conexión si existe
    if (typeof updateConnectionStatus === 'function') {
        updateConnectionStatus();
    }
    
    // Verificar si ya se aceptó el pacto
    checkPactStatus();
    
    // Configurar navegación
    setupNavigation();
    
    // OCULTAR SECCIÓN ADMIN POR DEFECTO
    const adminNav = document.getElementById('adminNav');
    if (adminNav) {
        adminNav.style.display = 'none';
    }
}

function setupNavigation() {
    // Navegación por hash en URL
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const validSections = ['landing', 'help', 'linking', 'contract', 'admin', 'recovery', 'downloads'];
        
        // Solo mostrar admin si ya está autenticado
        if (hash === 'admin' && !appState.isAdmin) {
            showSection('landing');
            history.replaceState(null, '', '#landing');
        } else if (validSections.includes(hash)) {
            setTimeout(() => {
                showSection(hash);
            }, 100);
        }
    }
}

// =================== FUNCIONES DE REGISTRO ===================

function checkRegistrationParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('nick') && urlParams.has('token')) {
        // Guardar datos de registro pendientes
        appState.registrationData = {
            nick: decodeURIComponent(urlParams.get('nick')),
            email: urlParams.has('email') ? decodeURIComponent(urlParams.get('email')) : '',
            token: decodeURIComponent(urlParams.get('token')),
            plan: urlParams.get('plan') || 'free',
            timestamp: Date.now()
        };
        
        console.log("Datos de registro recibidos desde app:", appState.registrationData);
        
        // Mostrar notificación
        showRegistrationNotification();
        
        // Si no hay pacto aceptado, ir al contrato
        if (!appState.pactAccepted) {
            setTimeout(() => {
                showSection('contract');
                highlightPactSection();
            }, 500);
        }
    }
}

function showRegistrationNotification() {
    // Remover notificaciones previas
    const existing = document.querySelector('.cyber-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'cyber-notification fixed top-4 right-4 z-50';
    notification.innerHTML = `
        <div class="cyber-card p-4 bg-blue-900/30 border-blue-500/50 max-w-xs">
            <div class="flex items-start">
                <i class="fas fa-mobile-alt text-blue-400 mr-3 mt-1"></i>
                <div>
                    <p class="font-bold text-blue-300">REGISTRO DESDE APP</p>
                    <p class="text-sm text-blue-300/70 mt-1">1. Acepta el Pacto de Honor</p>
                    <p class="text-sm text-blue-300/70">2. Ingresa tu token: <strong>${appState.registrationData.token.substring(0, 8)}...</strong></p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-gray-400 hover:text-white">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(notification);
}

// =================== FUNCIONES DE SEGURIDAD ===================

// Función MD5 simplificada (para producción usar crypto-js/md5)
function md5(input) {
    // Esta es una implementación simple para demo
    // En producción, usar: import md5 from 'crypto-js/md5';
    let hash = 0;
    if (input.length === 0) return hash.toString(16);
    
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    
    // Convertir a string hexadecimal de 32 caracteres
    let result = (hash >>> 0).toString(16);
    while (result.length < 32) {
        result = '0' + result;
    }
    return result;
}

// Función XOR simple para encriptación
function xorEncrypt(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode);
    }
    return result;
}

// Verificar clave maestra
function verifyMasterKey(inputKey) {
    if (!inputKey || inputKey.length === 0) return false;
    
    try {
        // 1. Encriptar la clave consigo misma
        const encrypted = xorEncrypt(inputKey, inputKey);
        
        // 2. Generar MD5 del resultado
        const calculatedHash = md5(encrypted);
        
        // 3. Comparar con el hash esperado
        console.log(`Verificación clave: Input="${inputKey}", Hash calculado=${calculatedHash}, Hash esperado=${config.MASTER_KEY_HASH}`);
        
        return calculatedHash === config.MASTER_KEY_HASH;
    } catch (error) {
        console.error("Error en verificación de clave:", error);
        return false;
    }
}

// =================== FUNCIONES PRINCIPALES ===================

async function handleAccess() {
    const tokenInput = document.getElementById('accessCode');
    const status = document.getElementById('statusMsg');
    
    if (!tokenInput || !status) {
        console.error("Elementos del DOM no encontrados");
        return;
    }
    
    const code = tokenInput.value.trim();
    const lang = appState.currentLang;
    
    // Verificar clave maestra
    if (verifyMasterKey(code)) {
        console.log("Clave maestra aceptada");
        appState.isAdmin = true;
        
        // Mostrar navegación admin
        const adminNav = document.getElementById('adminNav');
        if (adminNav) {
            adminNav.style.display = 'flex';
        }
        
        // Mostrar sección admin
        showSection('admin');
        
        // Actualizar estado
        status.innerHTML = `<i class="fas fa-shield-alt mr-2"></i>
                           <span data-i18n="status.rootAccess">ACCESO ROOT CONCEDIDO. BIENVENIDO, OPERADOR.</span>`;
        status.style.color = "#00FF41";
        
        // Cargar datos de admin si existe la función
        if (typeof loadAdminData === 'function') {
            loadAdminData();
        }
        
        tokenInput.value = "";
        return;
    }
    
    // Verificar pacto para registro normal
    const isAccepted = document.getElementById('acceptPact')?.checked || appState.pactAccepted;
    if (!isAccepted) {
        status.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i>
                           <span data-i18n="status.pactError">ERROR: Debes aceptar el Pacto de Honor.</span>`;
        applyLanguage(lang);
        status.style.color = "#ef4444";
        
        highlightPactSection();
        return;
    }
    
    // Verificar código de token
    if (!code || code.length < 8) {
        status.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>
                           <span data-i18n="status.invalidToken">ERROR: Token inválido (mínimo 8 caracteres).</span>`;
        status.style.color = "#ef4444";
        applyLanguage(lang);
        return;
    }
    
    // Procesar según el tipo de registro
    if (appState.registrationData) {
        await processPendingRegistration(code, status);
    } else {
        await processNormalToken(code, status);
    }
}

async function processPendingRegistration(code, status) {
    status.innerHTML = `<i class="fas fa-sync-alt animate-spin mr-2"></i>
                       <span>PROCESANDO REGISTRO DESDE APP...</span>`;
    status.style.color = "#00FF41";
    
    try {
        // Verificar que supabase está disponible
        if (typeof supabase === 'undefined') {
            throw new Error("Supabase no está disponible");
        }
        
        const _supabase = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
        
        // Normalizar token (remover prefijo DEEP- si existe)
        const normalizedToken = code.replace("DEEP-", "").trim().toLowerCase();
        const expectedToken = appState.registrationData.token.replace("DEEP-", "").trim().toLowerCase();
        
        // Verificar token
        if (normalizedToken !== expectedToken) {
            status.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>
                               ERROR: Token incorrecto. Usa: ${appState.registrationData.token}`;
            status.style.color = "#ef4444";
            return;
        }
        
        // Insertar en Supabase
        const { data, error } = await _supabase
            .from('device_registrations')
            .upsert({ 
                device_hash: normalizedToken,
                nick: appState.registrationData.nick,
                email: appState.registrationData.email,
                is_premium: (appState.registrationData.plan === 'premium'),
                plan_type: appState.registrationData.plan,
                pacto_aceptado: true,
                created_at: new Date().toISOString(),
                last_access: new Date().toISOString(),
                registration_source: 'mobile_app'
            })
            .select();

        if (error) {
            throw error;
        }
        
        console.log("Registro exitoso en Supabase:", data);
        
        status.innerHTML = `<i class="fas fa-check-circle mr-2"></i>
                           <span>REGISTRO COMPLETADO. Ya puedes usar la app.</span>`;
        status.style.color = "#00FF41";
        
        // Limpiar datos y URL
        appState.registrationData = null;
        const notification = document.querySelector('.cyber-notification');
        if (notification) notification.remove();
        
        // Limpiar parámetros URL sin recargar
        const url = new URL(window.location);
        url.search = '';
        history.replaceState({}, '', url);
        
        // Mostrar éxito en sección contract
        showSuccessMessage();
        
    } catch (error) {
        console.error("Error en registro:", error);
        status.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>
                           ERROR: ${error.message || "Error al conectar con la base de datos"}`;
        status.style.color = "#ef4444";
    }
}

async function processNormalToken(code, status) {
    status.innerHTML = `<i class="fas fa-sync-alt animate-spin mr-2"></i>
                       <span>SINCRONIZANDO CON LA RED...</span>`;
    status.style.color = "#00FF41";
    
    try {
        if (typeof supabase === 'undefined') {
            throw new Error("Supabase no disponible");
        }
        
        const _supabase = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
        const urlParams = new URLSearchParams(window.location.search);
        
        const { data, error } = await _supabase
            .from('device_registrations')
            .upsert({ 
                device_hash: code.replace("DEEP-", "").trim().toLowerCase(),
                nick: urlParams.get('nick') || 'Anon',
                email: urlParams.get('email') || '',
                is_premium: (urlParams.get('plan') === 'premium'),
                plan_type: urlParams.get('plan') || 'free',
                pacto_aceptado: true,
                created_at: new Date().toISOString(),
                last_access: new Date().toISOString(),
                registration_source: 'web_direct'
            })
            .select();

        if (error) throw error;
        
        status.innerHTML = `<i class="fas fa-check-circle mr-2"></i>
                           <span>VINCULACIÓN EXITOSA. Puedes volver a la App.</span>`;
        status.style.color = "#00FF41";
        
        showSuccessMessage();
        
    } catch (error) {
        console.error("Error:", error);
        status.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>
                           ERROR: ${error.message}`;
        status.style.color = "#ef4444";
    }
}

function showSuccessMessage() {
    const contractSection = document.getElementById('contract');
    if (!contractSection) return;
    
    // Remover mensajes previos
    const existing = contractSection.querySelector('.success-message');
    if (existing) existing.remove();
    
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message cyber-status p-4 mb-4 bg-green-900/20 border border-green-500/30';
    successMessage.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle text-green-400 mr-3 text-xl"></i>
            <div>
                <span class="font-bold text-green-300">REGISTRO COMPLETADO CON ÉXITO</span>
                <p class="text-sm text-green-300/70 mt-1">Tu cuenta ha sido activada correctamente.</p>
            </div>
        </div>
    `;
    
    const card = contractSection.querySelector('.cyber-card');
    if (card) {
        card.prepend(successMessage);
    }
}

// =================== FUNCIONES AUXILIARES ===================

function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.remove('active');
    });
    
    // Actualizar enlaces de navegación
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
        
        appState.currentSection = sectionId;
        
        // Scroll suave
        setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
}

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
            
            // Bloquear acceso a admin si no está autenticado
            if (section === 'admin' && !appState.isAdmin) {
                alert("Acceso restringido. Necesitas clave de administrador.");
                return;
            }
            
            showSection(section);
            history.pushState(null, '', `#${section}`);
        });
    });
    
    // Auto-rellenar token con Enter
    const accessInput = document.getElementById('accessCode');
    if (accessInput) {
        accessInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleAccess();
            }
        });
    }
    
    // Pacto checkbox
    const pactCheckbox = document.getElementById('acceptPact');
    if (pactCheckbox) {
        pactCheckbox.addEventListener('change', function() {
            updatePactStatus(this.checked);
        });
    }
    
    // Botón de descarga
    const downloadBtn = document.getElementById('downloadApk');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadAPK);
    }
    
    // Navegación del historial
    window.addEventListener('popstate', function() {
        if (window.location.hash) {
            const section = window.location.hash.substring(1);
            if (section === 'admin' && !appState.isAdmin) {
                showSection('landing');
                history.replaceState(null, '', '#landing');
            } else {
                showSection(section);
            }
        }
    });
}

function updatePactStatus(isAccepted) {
    appState.pactAccepted = isAccepted;
    
    if (isAccepted) {
        localStorage.setItem('deepirc_pact_accepted', 'true');
        
        // Quitar indicador de requerido
        const contractNav = document.querySelector('.nav-link[data-section="contract"] .bg-red-500');
        if (contractNav) {
            contractNav.remove();
        }
    } else {
        localStorage.removeItem('deepirc_pact_accepted');
    }
}

function checkPactStatus() {
    const pactAccepted = localStorage.getItem('deepirc_pact_accepted');
    const pactCheckbox = document.getElementById('acceptPact');
    
    if (pactAccepted && pactCheckbox) {
        pactCheckbox.checked = true;
        appState.pactAccepted = true;
        
        const contractNav = document.querySelector('.nav-link[data-section="contract"] .bg-red-500');
        if (contractNav) {
            contractNav.remove();
        }
    }
}

function highlightPactSection() {
    showSection('contract');
    
    setTimeout(() => {
        const pactCheckbox = document.getElementById('acceptPact');
        const pactContainer = document.querySelector('.pact-checkbox');
        
        if (pactContainer) {
            pactContainer.classList.add('highlight-pact');
            
            pactContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            let blinkCount = 0;
            const blinkInterval = setInterval(() => {
                pactContainer.classList.toggle('highlight-pact-blink');
                blinkCount++;
                if (blinkCount >= 6) {
                    clearInterval(blinkInterval);
                    pactContainer.classList.remove('highlight-pact-blink');
                    setTimeout(() => {
                        pactContainer.classList.remove('highlight-pact');
                    }, 2000);
                }
            }, 300);
        }
    }, 300);
}

// =================== FUNCIONES DE IDIOMA ===================

function applyLanguage(lang) {
    if (!translations || !translations[lang]) return;
    
    // Traducir elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

function changeLanguage(lang) {
    if (!translations || !translations[lang]) return;
    
    appState.currentLang = lang;
    localStorage.setItem('deepirc_lang', lang);
    
    // Actualizar botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Aplicar traducciones
    applyLanguage(lang);
}

// =================== ESTILOS DINÁMICOS ===================

// Añadir estilos CSS dinámicamente
if (!document.querySelector('#dynamic-styles')) {
    const style = document.createElement('style');
    style.id = 'dynamic-styles';
    style.textContent = `
        .cyber-notification {
            animation: slideInRight 0.3s ease-out;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .highlight-pact {
            animation: pulse 2s infinite;
            border-color: #ef4444 !important;
            box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
        }
        
        .highlight-pact-blink {
            animation: blink 0.3s step-end;
        }
        
        @keyframes blink {
            50% { opacity: 0.5; }
        }
        
        @keyframes pulse {
            0%, 100% { box-shadow: 0 0 5px rgba(239, 68, 68, 0.5); }
            50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.8); }
        }
        
        .success-message {
            animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-spin {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// =================== FUNCIONES DE PRUEBA ===================

// Para probar la clave maestra, usa esta función en consola:
window.testMasterKey = function(key) {
    const encrypted = xorEncrypt(key, key);
    const hash = md5(encrypted);
    console.log(`Clave: "${key}"`);
    console.log(`Encriptada: "${encrypted}" (longitud: ${encrypted.length})`);
    console.log(`MD5: ${hash}`);
    console.log(`Coincide con config: ${hash === config.MASTER_KEY_HASH}`);
    
    // Para generar un nuevo hash:
    console.log(`\nPara config.MASTER_KEY_HASH usa: "${hash}"`);
};

// Ejemplo de uso en consola:
// testMasterKey("DEEP_DRTHANDS_2025");
