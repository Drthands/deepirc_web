// Configuración y variables globales
const config = {
    SUPABASE_URL: 'https://bbbqjzjaivzrywwkczry.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiYnFqemphaXZ6cnl3d2tjenJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMjkwMzAsImV4cCI6MjA4MTkwNTAzMH0.6bMDVnoOhiigahZOJU7e59Nn6q95Kop4U4h9iwEtAhQ',
    // Hash MD5 de "DEEP_DRTHANDS_2025" encriptado consigo mismo
    MASTER_KEY_HASH: "aefb2947d03a6a6662780d18209280bc",
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
    checkRegistrationParams();
});

// =================== FUNCIONES DE INICIALIZACIÓN ===================

function initializeApp() {
    console.log("🚀 Inicializando DeepIRC Web...");
    
    // Determinar idioma
    const savedLang = localStorage.getItem('deepirc_lang');
    const browserLang = navigator.language.split('-')[0];
    appState.currentLang = savedLang || 'es';
    
    // Aplicar idioma
    applyLanguage(appState.currentLang);
    
    // Verificar si ya se aceptó el pacto
    checkPactStatus();
    
    // Configurar navegación
    setupNavigation();
    
    // OCULTAR SECCIÓN ADMIN POR DEFECTO
    hideAdminSection();
    
    // Mostrar sección inicial
    if (!window.location.hash) {
        showSection('landing');
    }
}

function hideAdminSection() {
    // Ocultar enlace de admin en navegación
    const adminNav = document.querySelector('.nav-link[data-section="admin"]');
    if (adminNav) {
        adminNav.style.display = 'none';
    }
}

function showAdminSection() {
    // Mostrar enlace de admin en navegación
    const adminNav = document.querySelector('.nav-link[data-section="admin"]');
    if (adminNav) {
        adminNav.style.display = 'flex';
    }
}

function setupNavigation() {
    // Navegación por hash en URL
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const validSections = ['landing', 'help', 'linking', 'contract', 'admin', 'recovery', 'downloads', 'patreon'];
        
        // Solo mostrar admin si ya está autenticado
        if (hash === 'admin' && !appState.isAdmin) {
            showSection('landing');
            history.replaceState(null, '', '#landing');
            return;
        }
        
        if (validSections.includes(hash)) {
            setTimeout(() => {
                showSection(hash);
                
                // Si es downloads, cargar contenido
                if (hash === 'downloads') {
                    loadDownloadsInfo();
                }
                 if (hash === 'patreon') {
                    loadPatreonInfo();
                }
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
        
        console.log("📱 Datos de registro recibidos desde app:", appState.registrationData);
        
        // Mostrar notificación
        showRegistrationNotification();
        
        // Auto-llenar el token en el input si existe
        const tokenInput = document.getElementById('accessCode');
        if (tokenInput && appState.registrationData.token) {
            tokenInput.value = appState.registrationData.token;
        }
        
        // Si no hay pacto aceptado, ir al contrato
        if (!appState.pactAccepted) {
            setTimeout(() => {
                showSection('contract');
                highlightPactSection();
            }, 1000);
        } else {
            // Si ya aceptó pacto, ir a linking
            showSection('linking');
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
                    <p class="font-bold text-blue-300">📱 REGISTRO DESDE APP</p>
                    <p class="text-sm text-blue-300/70 mt-1">Token: <strong class="font-mono">${appState.registrationData.token.substring(0, 20)}...</strong></p>
                    <p class="text-xs text-blue-300/50 mt-2">El token se ha auto-llenado en el formulario</p>
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

// Función MD5 (simplificada)
function md5(input) {
    if (!input) return '';
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return (hash >>> 0).toString(16).padStart(32, '0');
}

// Función XOR para encriptación
function xorEncrypt(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const keyChar = key.charCodeAt(i % key.length);
        const textChar = text.charCodeAt(i);
        result += String.fromCharCode(textChar ^ keyChar);
    }
    return result;
}

// Verificar clave maestra
function verifyMasterKey(inputKey) {
    if (!inputKey || inputKey.trim() === '') return false;
    
    try {
        // Encriptar la clave consigo misma
        const encrypted = xorEncrypt(inputKey, inputKey);
        
        // Generar MD5 del resultado
        const calculatedHash = md5(encrypted);
        
        console.log(`🔑 Verificación clave: Input="${inputKey}", Hash=${calculatedHash}`);
        
        return calculatedHash === config.MASTER_KEY_HASH;
    } catch (error) {
        console.error("Error en verificación:", error);
        return false;
    }
}

// =================== FUNCIONES PRINCIPALES ===================

async function handleAccess() {
    const tokenInput = document.getElementById('accessCode');
    const status = document.getElementById('statusMsg');
    
    if (!tokenInput || !status) {
        console.error("❌ Elementos del DOM no encontrados");
        return;
    }
    
    const code = tokenInput.value.trim();
    console.log(`🔐 Procesando código: "${code}"`);
    
    // 1. Verificar si es clave maestra para admin
    if (verifyMasterKey(code)) {
        console.log("✅ Clave maestra aceptada - Acceso Admin");
        appState.isAdmin = true;
        
        // Mostrar sección admin
        showAdminSection();
        showSection('admin');
        
        // Cargar datos de admin
        await loadAdminData();
        
        status.innerHTML = `<i class="fas fa-shield-alt mr-2"></i>
                           <span>✅ ACCESO ROOT CONCEDIDO. BIENVENIDO, OPERADOR.</span>`;
        status.style.color = "#00FF41";
        
        tokenInput.value = "";
        return;
    }
    
    // 2. Verificar pacto para registro normal
    const isAccepted = document.getElementById('acceptPact')?.checked || appState.pactAccepted;
    if (!isAccepted) {
        status.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i>
                           <span>❌ ERROR: Debes aceptar el Pacto de Honor.</span>`;
        status.style.color = "#ef4444";
        
        highlightPactSection();
        return;
    }
    
    // 3. Verificar código de token
    if (!code || code.length < 8) {
        status.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>
                           <span>❌ ERROR: Token inválido (mínimo 8 caracteres).</span>`;
        status.style.color = "#ef4444";
        return;
    }
    
    // 4. Procesar según el tipo de registro
    if (appState.registrationData) {
        await processPendingRegistration(code, status);
    } else {
        await processNormalToken(code, status);
    }
}

async function processPendingRegistration(code, status) {
    status.innerHTML = `<i class="fas fa-sync-alt animate-spin mr-2"></i>
                       <span>🔄 PROCESANDO REGISTRO DESDE APP...</span>`;
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
        
        console.log(`🔍 Comparando tokens: ${normalizedToken} vs ${expectedToken}`);
        
        // Verificar token (ahora más flexible)
        if (normalizedToken !== expectedToken && code !== appState.registrationData.token) {
            status.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>
                               ❌ ERROR: Token no coincide. Usa: ${appState.registrationData.token}`;
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
                pacto_aceptado: true,
                created_at: new Date().toISOString(),
                last_access: new Date().toISOString()
            })
            .select();

        if (error) {
            throw error;
        }
        
        console.log("✅ Registro exitoso en Supabase:", data);
        
        status.innerHTML = `<i class="fas fa-check-circle mr-2"></i>
                           <span>✅ REGISTRO COMPLETADO. Ya puedes usar la app.</span>`;
        status.style.color = "#00FF41";
        
        // Limpiar datos y URL
        appState.registrationData = null;
        const notification = document.querySelector('.cyber-notification');
        if (notification) notification.remove();
        
        // Limpiar parámetros URL sin recargar
        const url = new URL(window.location);
        url.search = '';
        history.replaceState({}, '', url);
        
        // Mostrar éxito
        showSuccessMessage();
        
    } catch (error) {
        console.error("❌ Error en registro:", error);
        status.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>
                           ❌ ERROR: ${error.message || "Error al conectar con la base de datos"}`;
        status.style.color = "#ef4444";
    }
}

async function processNormalToken(code, status) {
    status.innerHTML = `<i class="fas fa-sync-alt animate-spin mr-2"></i>
                       <span>🔄 SINCRONIZANDO CON LA RED...</span>`;
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
                pacto_aceptado: true,
                created_at: new Date().toISOString(),
                last_access: new Date().toISOString()
            })
            .select();

        if (error) throw error;
        
        status.innerHTML = `<i class="fas fa-check-circle mr-2"></i>
                           <span>✅ VINCULACIÓN EXITOSA. Puedes volver a la App.</span>`;
        status.style.color = "#00FF41";
        
        showSuccessMessage();
        
    } catch (error) {
        console.error("❌ Error:", error);
        status.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>
                           ❌ ERROR: ${error.message}`;
        status.style.color = "#ef4444";
    }
}

// =================== FUNCIONES DE ADMIN ===================

async function loadAdminData() {
    const adminContent = document.getElementById('adminContent');
    if (!adminContent) return;
    
    adminContent.innerHTML = `<div class="text-center p-8">
        <i class="fas fa-sync-alt animate-spin text-3xl text-green-400 mb-4"></i>
        <p>Cargando datos de administración...</p>
    </div>`;
    
    try {
        const _supabase = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
        
        // Obtener todos los registros
        const { data: registrations, error } = await _supabase
            .from('device_registrations')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        console.log(`📊 Datos cargados: ${registrations?.length || 0} registros`);
        
        // Verificar si hay datos
        if (!registrations || registrations.length === 0) {
            adminContent.innerHTML = `
                <div class="cyber-card p-6">
                    <h3 class="text-xl font-bold mb-4 text-green-300">PANEL DE ADMINISTRACIÓN</h3>
                    <div class="text-center p-8">
                        <i class="fas fa-database text-4xl text-gray-500 mb-4"></i>
                        <p class="text-gray-400">No hay registros en la base de datos</p>
                        <p class="text-sm text-gray-500 mt-2">La base de datos está vacía o no se pudo conectar</p>
                    </div>
                </div>
            `;
            return;
        }
        
        // Estadísticas
        const totalUsers = registrations.length;
        const premiumUsers = registrations.filter(r => r.is_premium).length;
        const pactAccepted = registrations.filter(r => r.pacto_aceptado).length;
        
        // Generar HTML
        let html = `
            <div class="cyber-card p-6 mb-6">
                <h3 class="text-xl font-bold mb-4 text-green-300">PANEL DE ADMINISTRACIÓN</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="cyber-card p-4 bg-green-900/20">
                        <p class="text-sm text-green-400">USUARIOS TOTALES</p>
                        <p class="text-3xl font-bold">${totalUsers}</p>
                    </div>
                    <div class="cyber-card p-4 bg-blue-900/20">
                        <p class="text-sm text-blue-400">USUARIOS PREMIUM</p>
                        <p class="text-3xl font-bold">${premiumUsers}</p>
                    </div>
                    <div class="cyber-card p-4 bg-yellow-900/20">
                        <p class="text-sm text-yellow-400">PACTO ACEPTADO</p>
                        <p class="text-3xl font-bold">${pactAccepted}</p>
                    </div>
                </div>
                
                <h4 class="text-lg font-bold mb-3 text-green-300">ÚLTIMOS 10 REGISTROS</h4>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-green-800">
                                <th class="p-2 text-left">ID</th>
                                <th class="p-2 text-left">Device Hash</th>
                                <th class="p-2 text-left">Nick</th>
                                <th class="p-2 text-left">Email</th>
                                <th class="p-2 text-left">Premium</th>
                                <th class="p-2 text-left">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        registrations.slice(0, 10).forEach(reg => {
            html += `
                <tr class="border-b border-green-900/30 hover:bg-green-900/10">
                    <td class="p-2 font-mono text-xs">${reg.id?.substring(0, 8) || 'N/A'}</td>
                    <td class="p-2 font-mono">${reg.device_hash?.substring(0, 12)}...</td>
                    <td class="p-2">${reg.nick || 'N/A'}</td>
                    <td class="p-2">${reg.email ? (reg.email.length > 20 ? reg.email.substring(0, 20) + '...' : reg.email) : 'N/A'}</td>
                    <td class="p-2">${reg.is_premium ? '✅' : '❌'}</td>
                    <td class="p-2 text-xs">${reg.created_at ? new Date(reg.created_at).toLocaleDateString() : 'N/A'}</td>
                </tr>
            `;
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
                
                <div class="mt-6 pt-4 border-t border-green-800">
                    <h4 class="text-lg font-bold mb-3 text-green-300">ACCIONES RÁPIDAS</h4>
                    <div class="flex flex-wrap gap-2">
                        <button onclick="exportData()" class="cyber-button px-4 py-2">
                            <i class="fas fa-download mr-2"></i>Exportar CSV
                        </button>
                        <button onclick="refreshAdminData()" class="cyber-button px-4 py-2">
                            <i class="fas fa-sync-alt mr-2"></i>Actualizar
                        </button>
                        <button onclick="testDatabaseConnection()" class="cyber-button px-4 py-2">
                            <i class="fas fa-database mr-2"></i>Test BD
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        adminContent.innerHTML = html;
        
    } catch (error) {
        console.error("❌ Error cargando datos admin:", error);
        adminContent.innerHTML = `<div class="cyber-card p-6">
            <h3 class="text-xl font-bold mb-4 text-red-300">ERROR</h3>
            <p class="text-red-400">Error cargando datos: ${error.message}</p>
            <p class="text-sm text-gray-400 mt-2">Verifica la conexión a Supabase y los permisos de la API key</p>
        </div>`;
    }
}

function refreshAdminData() {
    loadAdminData();
}

function testDatabaseConnection() {
    alert("🔍 Probando conexión a base de datos...\n\nRevisa la consola para ver los detalles.");
    loadAdminData();
}

function exportData() {
    alert("📊 La exportación de datos estará disponible en la próxima versión");
}

// =================== FUNCIONES AUXILIARES ===================

function showSection(sectionId) {
    console.log(`📌 Mostrando sección: ${sectionId}`);
    
    // Ocultar todas las secciones
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Actualizar enlaces de navegación
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const correspondingLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
        if (correspondingLink) {
            correspondingLink.classList.add('active');
        }
        
        appState.currentSection = sectionId;
        
        // Scroll al inicio de la sección
        setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

function setupEventListeners() {
    console.log("⚙️ Configurando event listeners...");
    
    // Navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            
            // Bloquear acceso a admin si no está autenticado
            if (section === 'admin' && !appState.isAdmin) {
                alert("⚠️ ACCESO RESTRINGIDO\nNecesitas clave de administrador.");
                return;
            }
            
            showSection(section);
            history.pushState(null, '', `#${section}`);
            
            // Si es downloads, cargar contenido
            if (section === 'downloads') {
                setTimeout(() => loadDownloadsInfo(), 100);
            }
            if (section === 'patreon') {
                setTimeout(() => loadPatreonInfo(), 100);
            }
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
    
    // Botón de descarga (si existe)
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
        
        console.log("✅ Pacto aceptado");
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
        }
    }, 300);
}

function showSuccessMessage() {
    const contractSection = document.getElementById('contract');
    if (!contractSection) return;
    
    const existing = contractSection.querySelector('.success-message');
    if (existing) existing.remove();
    
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message cyber-status p-4 mb-4 bg-green-900/20 border border-green-500/30';
    successMessage.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle text-green-400 mr-3 text-xl"></i>
            <div>
                <span class="font-bold text-green-300">✅ REGISTRO COMPLETADO CON ÉXITO</span>
                <p class="text-sm text-green-300/70 mt-1">Tu cuenta ha sido activada correctamente.</p>
            </div>
        </div>
    `;
    
    const card = contractSection.querySelector('.cyber-card');
    if (card) {
        card.prepend(successMessage);
    }
}

// =================== FUNCIONES DE DESCARGA Y PATREON ===================

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
        </div>
 `;
 // Re-aplicar idioma
    applyLanguage(appState.currentLang);
    
    // Re-configurar event listener para el botón de descarga
    document.getElementById('downloadApk')?.addEventListener('click', downloadAPK);
}



function loadPatreonInfo() {
    const patreonSection = document.getElementById('patreon');
    if (!patreonSection) return;
    
    patreonSection.innerHTML = `
    
<body class="bg-black text-green-400 font-matrix min-h-screen overflow-x-hidden">
    
    <!-- Efecto Matrix de fondo -->
    <div id="matrixBackground"></div>
    
    <!-- Contenedor principal -->
    <div class="container mx-auto px-4 py-8 relative z-10 terminal-effect max-w-6xl">
        
        <!-- Header -->
        <header class="flex flex-col md:flex-row justify-between items-center border-b border-green-900/50 pb-6 mb-8">
            <div class="flex items-center space-x-4 mb-4 md:mb-0">
                <div class="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <div>
                    <h1 class="text-2xl md:text-3xl font-bold tracking-wider glitch" data-text="DEEP_IRC_PATREON_v1.0">
                        DEEP_IRC_PATREON_v1.0
                    </h1>
                    <p class="text-xs text-green-600 mt-1">CANAL_PATREON_ACTIVO</p>
                </div>
            </div>
            
            <div class="flex items-center space-x-4">
                <a href="index.html" class="text-xs hover:text-green-300 transition-colors flex items-center">
                    <i class="fas fa-arrow-left mr-2"></i>
                    VOLVER AL SISTEMA
                </a>
                <div class="h-6 border-r border-green-900"></div>
                <a href="https://www.patreon.com/deepirc" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="cyber-button-small bg-purple-600 border-purple-500 px-4 py-2">
                    <i class="fab fa-patreon mr-2"></i>
                    ACCEDER A PATREON
                </a>
            </div>
        </header>
        
        <!-- Contenido principal -->
        <main>
            <!-- Hero Section -->
            <section class="mb-12 text-center">
                <div class="inline-block p-1 rounded-full bg-gradient-to-r from-green-500 to-purple-600 animate-pulse mb-6">
                    <div class="bg-black rounded-full p-2">
                        <i class="fab fa-patreon text-5xl md:text-6xl text-purple-400"></i>
                    </div>
                </div>
                
                <h2 class="text-3xl md:text-5xl font-bold mb-6">
                    <span class="text-white">APOYA LA PRIVACIDAD</span><br>
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500 typing-animation">
                        UN PROYECTO A LA VEZ
                    </span>
                </h2>
                
                <p class="text-lg text-green-300/80 max-w-3xl mx-auto mb-8">
                    DeepIRC es más que una app. Es un compromiso con la privacidad digital. 
                    Tu apoyo nos permite mantener servidores seguros, desarrollar nuevas características 
                    y luchar por un internet más privado.
                </p>
                
                <!-- Contador de patrocinadores -->
                <div class="inline-flex items-center space-x-4 p-4 bg-green-950/30 rounded-lg border border-green-900/50">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-purple-400" id="patronCount">42</div>
                        <div class="text-xs text-green-600">PATROCINADORES</div>
                    </div>
                    <div class="h-12 w-px bg-green-900"></div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-green-400" id="monthlyAmount">$127</div>
                        <div class="text-xs text-green-600">MENSUAL</div>
                    </div>
                </div>
            </section>
            
            <!-- Beneficios -->
            <section class="mb-16">
                <div class="flex items-center mb-8">
                    <div class="w-12 h-1 bg-purple-500 mr-4"></div>
                    <h3 class="text-2xl font-bold">
                        <i class="fas fa-crown text-purple-400 mr-3"></i>
                        BENEFICIOS EXCLUSIVOS
                    </h3>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <!-- Nivel 1: Hacker -->
                    <div class="cyber-card p-6 border-green-500/30 hover:border-green-400 transition-all duration-300">
                        <div class="text-center mb-6">
                            <div class="inline-block p-3 rounded-full bg-green-900/30 mb-4">
                                <i class="fas fa-user-secret text-3xl text-green-400"></i>
                            </div>
                            <h4 class="text-xl font-bold text-green-300 mb-2">HACKER</h4>
                            <div class="text-2xl font-bold text-white mb-1">$3<span class="text-sm text-green-600">/mes</span></div>
                            <p class="text-sm text-green-600">Nivel básico de apoyo</p>
                        </div>
                        
                        <ul class="space-y-3 mb-6">
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-400 mt-1 mr-3"></i>
                                <span class="text-sm">Badge "Hacker" en Discord</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-400 mt-1 mr-3"></i>
                                <span class="text-sm">Acceso a builds beta</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-400 mt-1 mr-3"></i>
                                <span class="text-sm">Mención en créditos</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-400 mt-1 mr-3"></i>
                                <span class="text-sm">Actualizaciones exclusivas</span>
                            </li>
                        </ul>
                        
                        <a href="https://www.patreon.com/join/deepirc/checkout?rid=3" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="cyber-button w-full text-center">
                            <i class="fab fa-patreon mr-2"></i>
                            UNIRME COMO HACKER
                        </a>
                    </div>
                    
                    <!-- Nivel 2: Operador -->
                    <div class="cyber-card p-6 border-purple-500/30 hover:border-purple-400 transition-all duration-300 transform hover:-translate-y-1">
                        <div class="text-center mb-6">
                            <div class="inline-block p-3 rounded-full bg-purple-900/30 mb-4 relative">
                                <i class="fas fa-shield-alt text-3xl text-purple-400"></i>
                                <div class="absolute -top-2 -right-2 bg-purple-500 text-xs px-2 py-1 rounded-full animate-pulse">
                                    POPULAR
                                </div>
                            </div>
                            <h4 class="text-xl font-bold text-purple-300 mb-2">OPERADOR</h4>
                            <div class="text-2xl font-bold text-white mb-1">$7<span class="text-sm text-purple-600">/mes</span></div>
                            <p class="text-sm text-purple-600">Apoyo recomendado</p>
                        </div>
                        
                        <ul class="space-y-3 mb-6">
                            <li class="flex items-start">
                                <i class="fas fa-check text-purple-400 mt-1 mr-3"></i>
                                <span class="text-sm"><strong>Todos los beneficios Hacker</strong></span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-purple-400 mt-1 mr-3"></i>
                                <span class="text-sm">Badge "Operador" en la app</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-purple-400 mt-1 mr-3"></i>
                                <span class="text-sm">Acceso al canal VIP en IRC</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-purple-400 mt-1 mr-3"></i>
                                <span class="text-sm">Soporte prioritario</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-purple-400 mt-1 mr-3"></i>
                                <span class="text-sm">Voto en nuevas características</span>
                            </li>
                        </ul>
                        
                        <a href="https://www.patreon.com/join/deepirc/checkout?rid=7" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="cyber-button w-full text-center bg-purple-600 border-purple-500 hover:bg-purple-700">
                            <i class="fab fa-patreon mr-2"></i>
                            UNIRME COMO OPERADOR
                        </a>
                    </div>
                    
                    <!-- Nivel 3: Fundador -->
                    <div class="cyber-card p-6 border-yellow-500/30 hover:border-yellow-400 transition-all duration-300">
                        <div class="text-center mb-6">
                            <div class="inline-block p-3 rounded-full bg-yellow-900/30 mb-4">
                                <i class="fas fa-crown text-3xl text-yellow-400"></i>
                            </div>
                            <h4 class="text-xl font-bold text-yellow-300 mb-2">FUNDADOR</h4>
                            <div class="text-2xl font-bold text-white mb-1">$15<span class="text-sm text-yellow-600">/mes</span></div>
                            <p class="text-sm text-yellow-600">Apoyo máximo</p>
                        </div>
                        
                        <ul class="space-y-3 mb-6">
                            <li class="flex items-start">
                                <i class="fas fa-check text-yellow-400 mt-1 mr-3"></i>
                                <span class="text-sm"><strong>Todos los beneficios Operador</strong></span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-yellow-400 mt-1 mr-3"></i>
                                <span class="text-sm">Badge "Fundador" exclusivo</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-yellow-400 mt-1 mr-3"></i>
                                <span class="text-sm">Acceso a estadísticas internas</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-yellow-400 mt-1 mr-3"></i>
                                <span class="text-sm">Sesiones 1:1 con el desarrollador</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-yellow-400 mt-1 mr-3"></i>
                                <span class="text-sm">Tu nombre en los créditos principales</span>
                            </li>
                        </ul>
                        
                        <a href="https://www.patreon.com/join/deepirc/checkout?rid=15" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="cyber-button w-full text-center bg-yellow-600 border-yellow-500 hover:bg-yellow-700">
                            <i class="fab fa-patreon mr-2"></i>
                            UNIRME COMO FUNDADOR
                        </a>
                    </div>
                </div>
                
                <!-- Nota personal -->
                <div class="cyber-card p-6 bg-gradient-to-r from-green-950/20 to-purple-950/20 border-green-900/50">
                    <div class="flex flex-col md:flex-row items-start md:items-center">
                        <div class="md:mr-6 mb-4 md:mb-0">
                            <div class="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-purple-600 p-1">
                                <div class="w-full h-full rounded-full bg-black flex items-center justify-center">
                                    <i class="fas fa-code text-2xl text-green-400"></i>
                                </div>
                            </div>
                        </div>
                        <div class="flex-1">
                            <h4 class="text-lg font-bold mb-2">UN MENSAJE PERSONAL</h4>
                            <p class="text-green-300/80 mb-3">
                                Hola, soy el desarrollador de DeepIRC. Cada contribución, por pequeña que sea, 
                                me ayuda a dedicar más tiempo a este proyecto, mantener los servidores funcionando 
                                y desarrollar nuevas características de seguridad. Tu apoyo literalmente hace 
                                posible que DeepIRC exista.
                            </p>
                            <p class="text-sm text-green-600">
                                <i class="fas fa-heart text-red-400 mr-2"></i>
                                Gracias por considerar apoyar este proyecto.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Cómo se usa el dinero -->
            <section class="mb-16">
                <div class="flex items-center mb-8">
                    <div class="w-12 h-1 bg-green-500 mr-4"></div>
                    <h3 class="text-2xl font-bold">
                        <i class="fas fa-server text-green-400 mr-3"></i>
                        ¿EN QUÉ SE USA TU APOYO?
                    </h3>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="cyber-card p-6">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mr-4">
                                <i class="fas fa-shield-alt text-green-400"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-lg">INFRAESTRUCTURA SEGURA</h4>
                                <p class="text-sm text-green-600">40% del presupuesto</p>
                            </div>
                        </div>
                        <p class="text-green-300/80 text-sm">
                            Servidores VPN, proxies seguros, hosting de servidores de relay, 
                            y certificados SSL para mantener todas las conexiones cifradas.
                        </p>
                    </div>
                    
                    <div class="cyber-card p-6">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mr-4">
                                <i class="fas fa-code text-purple-400"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-lg">DESARROLLO</h4>
                                <p class="text-sm text-purple-600">35% del presupuesto</p>
                            </div>
                        </div>
                        <p class="text-green-300/80 text-sm">
                            Tiempo de desarrollo de nuevas características, corrección de bugs, 
                            auditorías de seguridad y mantenimiento del código.
                        </p>
                    </div>
                    
                    <div class="cyber-card p-6">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-4">
                                <i class="fas fa-bolt text-blue-400"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-lg">MEJORAS DE RENDIMIENTO</h4>
                                <p class="text-sm text-blue-600">15% del presupuesto</p>
                            </div>
                        </div>
                        <p class="text-green-300/80 text-sm">
                            Optimización de servidores, CDN para descargas, y mejora de 
                            la infraestructura para una experiencia más rápida.
                        </p>
                    </div>
                    
                    <div class="cyber-card p-6">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 rounded-full bg-yellow-900/30 flex items-center justify-center mr-4">
                                <i class="fas fa-coffee text-yellow-400"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-lg">CAFÉ Y ENERGÍA</h4>
                                <p class="text-sm text-yellow-600">10% del presupuesto</p>
                            </div>
                        </div>
                        <p class="text-green-300/80 text-sm">
                            Literalmente café para las sesiones de código nocturnas, 
                            y algo para cubrir gastos básicos mientras trabajo en el proyecto.
                        </p>
                    </div>
                </div>
                
                <!-- Gráfico (simulado) -->
                <div class="mt-8 cyber-card p-6">
                    <h4 class="font-bold mb-4 text-center">DISTRIBUCIÓN DEL PRESUPUESTO</h4>
                    <div class="h-6 bg-black rounded-full overflow-hidden mb-4">
                        <div class="h-full flex">
                            <div class="bg-green-500" style="width: 40%"></div>
                            <div class="bg-purple-500" style="width: 35%"></div>
                            <div class="bg-blue-500" style="width: 15%"></div>
                            <div class="bg-yellow-500" style="width: 10%"></div>
                        </div>
                    </div>
                    <div class="flex justify-between text-xs text-green-600">
                        <span>Infraestructura</span>
                        <span>Desarrollo</span>
                        <span>Rendimiento</span>
                        <span>Recursos</span>
                    </div>
                </div>
            </section>
            
            <!-- Preguntas frecuentes -->
            <section class="mb-16">
                <div class="flex items-center mb-8">
                    <div class="w-12 h-1 bg-blue-500 mr-4"></div>
                    <h3 class="text-2xl font-bold">
                        <i class="fas fa-question-circle text-blue-400 mr-3"></i>
                        PREGUNTAS FRECUENTES
                    </h3>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="cyber-card p-6">
                        <h4 class="font-bold mb-3 text-green-300">¿Puedo cancelar en cualquier momento?</h4>
                        <p class="text-sm text-green-300/80">
                            Sí, puedes cancelar tu suscripción en cualquier momento desde tu cuenta de Patreon. 
                            No hay contratos de permanencia.
                        </p>
                    </div>
                    
                    <div class="cyber-card p-6">
                        <h4 class="font-bold mb-3 text-green-300">¿Qué métodos de pago aceptan?</h4>
                        <p class="text-sm text-green-300/80">
                            Patreon acepta tarjetas de crédito/débito (Visa, Mastercard, American Express), 
                            PayPal, y Google Pay en algunos países.
                        </p>
                    </div>
                    
                    <div class="cyber-card p-6">
                        <h4 class="font-bold mb-3 text-green-300">¿Recibiré facturas?</h4>
                        <p class="text-sm text-green-300/80">
                            Sí, Patreon genera automáticamente recibos por cada pago, 
                            que puedes descargar desde tu cuenta para propósitos fiscales.
                        </p>
                    </div>
                    
                    <div class="cyber-card p-6">
                        <h4 class="font-bold mb-3 text-green-300">¿Puedo cambiar de nivel?</h4>
                        <p class="text-sm text-green-300/80">
                            Sí, puedes subir o bajar de nivel en cualquier momento. 
                            El cambio se aplicará en tu próximo ciclo de facturación.
                        </p>
                    </div>
                </div>
            </section>
            
            <!-- Llamada a la acción final -->
            <section class="text-center mb-16">
                <div class="cyber-card p-8 md:p-12 bg-gradient-to-r from-green-950/20 to-purple-950/20">
                    <div class="inline-block p-3 rounded-full bg-black border-2 border-purple-500 mb-6 animate-pulse">
                        <i class="fab fa-patreon text-4xl text-purple-400"></i>
                    </div>
                    
                    <h3 class="text-2xl md:text-3xl font-bold mb-4">
                        ÚNETE A LA COMUNIDAD DEEPIRC
                    </h3>
                    
                    <p class="text-lg text-green-300/80 max-w-2xl mx-auto mb-8">
                        Tu apoyo no es solo una donación. Es un voto de confianza en un internet 
                        más privado y seguro. Cada patrocinador nos acerca a ese objetivo.
                    </p>
                    
                    <div class="flex flex-col md:flex-row justify-center gap-4">
                        <a href="https://www.patreon.com/deepirc" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="cyber-button bg-purple-600 border-purple-500 hover:bg-purple-700 px-8 py-4 text-lg">
                            <i class="fab fa-patreon mr-3"></i>
                            VER PÁGINA DE PATREON
                        </a>
                        
                        <a href="index.html" 
                           class="cyber-button bg-green-900/30 border-green-800 hover:bg-green-900/50 px-8 py-4 text-lg">
                            <i class="fas fa-arrow-left mr-3"></i>
                            VOLVER AL SISTEMA
                        </a>
                    </div>
                    
                    <p class="text-sm text-green-600 mt-6">
                        <i class="fas fa-lock mr-2"></i>
                        Todos los pagos son procesados de forma segura por Patreon
                    </p>
                </div>
            </section>
        </main>
        
        <!-- Footer -->
        <footer class="mt-12 pt-8 border-t border-green-900/30 text-center text-green-700 text-sm">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="mb-4 md:mb-0">
                    <span>© 2024 DeepIRC Project. Privacidad por diseño.</span>
                    <span class="mx-2 hidden md:inline">|</span>
                    <span class="block md:inline mt-1 md:mt-0">Todos los derechos reservados.</span>
                </div>
                
                <div class="flex space-x-6">
                    <a href="index.html" class="hover:text-green-400 transition-colors">
                        <i class="fas fa-home mr-1"></i>
                        Inicio
                    </a>
                    <a href="mailto:support@deepirc.net" class="hover:text-green-400 transition-colors">
                        <i class="fas fa-envelope mr-1"></i>
                        Contacto
                    </a>
                    <a href="https://github.com/deepirc" target="_blank" class="hover:text-green-400 transition-colors">
                        <i class="fab fa-github mr-1"></i>
                        GitHub
                    </a>
                </div>
            </div>
            
            <div class="mt-4 text-green-800 text-xs">
                <p>
                    Esta página no está afiliada oficialmente con Patreon. 
                    Patreon es una marca registrada de Patreon, Inc.
                </p>
            </div>
        </footer>
        
    </div> <!-- Fin del contenedor principal -->
    
    <!-- Script para efectos -->
    <script>
        // Efecto Matrix (simplificado)
        function createMatrixEffect() {
            const background = document.getElementById('matrixBackground');
            if (!background) return;
            
            const canvas = document.createElement('canvas');
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '-1';
            canvas.style.opacity = '0.05';
            background.appendChild(canvas);
            
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const chars = "01アイウエオカキクケコサシスセソタチツテト";
            const charArray = chars.split("");
            const fontSize = 14;
            const columns = canvas.width / fontSize;
            const drops = [];
            
            for(let i = 0; i < columns; i++) {
                drops[i] = Math.random() * canvas.height;
            }
            
            function drawMatrix() {
                ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = "#00FF41";
                ctx.font = `${fontSize}px 'Fira Code'`;
                
                for(let i = 0; i < drops.length; i++) {
                    const text = charArray[Math.floor(Math.random() * charArray.length)];
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                    
                    if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            }
            
            setInterval(drawMatrix, 35);
            
            window.addEventListener('resize', function() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        }
        
        // Contador animado
        function animateCounter(elementId, target, duration = 2000) {
            const element = document.getElementById(elementId);
            if (!element) return;
            
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current);
                }
            }, 16);
        }
        
        // Inicialización
        document.addEventListener('DOMContentLoaded', function() {
            createMatrixEffect();
            
            // Animar contadores
            setTimeout(() => {
                animateCounter('patronCount', 142);
                animateCounter('monthlyAmount', 427);
            }, 1000);
            
            // Efecto de escritura
            const typingElement = document.querySelector('.typing-animation');
            if (typingElement) {
                const text = typingElement.textContent;
                typingElement.textContent = '';
                let i = 0;
                
                function typeWriter() {
                    if (i < text.length) {
                        typingElement.textContent += text.charAt(i);
                        i++;
                        setTimeout(typeWriter, 100);
                    }
                }
                
                setTimeout(typeWriter, 500);
            }
            
            // Parallax effect para tarjetas
            document.querySelectorAll('.cyber-card').forEach(card => {
                card.addEventListener('mousemove', function(e) {
                    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
                    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
                    this.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
                });
                
                card.addEventListener('mouseenter', function() {
                    this.style.transition = 'none';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transition = 'all 0.5s ease';
                    this.style.transform = 'rotateY(0deg) rotateX(0deg)';
                });
            });
            
            // Actualizar URL para tracking
            const patronLinks = document.querySelectorAll('a[href*="patreon.com"]');
            patronLinks.forEach(link => {
                const url = new URL(link.href);
                url.searchParams.set('utm_source', 'deepirc_website');
                url.searchParams.set('utm_medium', 'referral');
                url.searchParams.set('utm_campaign', 'support_page');
                link.href = url.toString();
            });
        });
        
        // Smooth scroll para enlaces internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    </script>
    
    <!-- Estilos adicionales -->
    <style>
        .glitch {
            position: relative;
            display: inline-block;
        }
        
        .glitch::before,
        .glitch::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        
        .glitch::before {
            left: 2px;
            text-shadow: -2px 0 #ff00ff;
            clip: rect(24px, 550px, 90px, 0);
            animation: glitch-anim 5s infinite linear alternate-reverse;
        }
        
        .glitch::after {
            left: -2px;
            text-shadow: -2px 0 #00ffff;
            clip: rect(85px, 550px, 140px, 0);
            animation: glitch-anim2 5s infinite linear alternate-reverse;
        }
        
        @keyframes glitch-anim {
            0% { clip: rect(42px, 9999px, 44px, 0); }
            5% { clip: rect(12px, 9999px, 59px, 0); }
            10% { clip: rect(48px, 9999px, 29px, 0); }
            15% { clip: rect(42px, 9999px, 73px, 0); }
            20% { clip: rect(63px, 9999px, 27px, 0); }
            25% { clip: rect(34px, 9999px, 55px, 0); }
            30% { clip: rect(86px, 9999px, 73px, 0); }
            35% { clip: rect(20px, 9999px, 20px, 0); }
            40% { clip: rect(26px, 9999px, 60px, 0); }
            45% { clip: rect(25px, 9999px, 66px, 0); }
            50% { clip: rect(57px, 9999px, 98px, 0); }
            55% { clip: rect(5px, 9999px, 46px, 0); }
            60% { clip: rect(82px, 9999px, 31px, 0); }
            65% { clip: rect(54px, 9999px, 27px, 0); }
            70% { clip: rect(28px, 9999px, 99px, 0); }
            75% { clip: rect(45px, 9999px, 69px, 0); }
            80% { clip: rect(23px, 9999px, 85px, 0); }
            85% { clip: rect(54px, 9999px, 84px, 0); }
            90% { clip: rect(45px, 9999px, 47px, 0); }
            95% { clip: rect(37px, 9999px, 20px, 0); }
            100% { clip: rect(4px, 9999px, 91px, 0); }
        }
        
        @keyframes glitch-anim2 {
            0% { clip: rect(65px, 9999px, 100px, 0); }
            5% { clip: rect(52px, 9999px, 74px, 0); }
            10% { clip: rect(79px, 9999px, 85px, 0); }
            15% { clip: rect(75px, 9999px, 5px, 0); }
            20% { clip: rect(67px, 9999px, 61px, 0); }
            25% { clip: rect(14px, 9999px, 79px, 0); }
            30% { clip: rect(1px, 9999px, 66px, 0); }
            35% { clip: rect(86px, 9999px, 30px, 0); }
            40% { clip: rect(23px, 9999px, 98px, 0); }
            45% { clip: rect(85px, 9999px, 72px, 0); }
            50% { clip: rect(71px, 9999px, 75px, 0); }
            55% { clip: rect(2px, 9999px, 48px, 0); }
            60% { clip: rect(30px, 9999px, 16px, 0); }
            65% { clip: rect(59px, 9999px, 50px, 0); }
            70% { clip: rect(41px, 9999px, 62px, 0); }
            75% { clip: rect(2px, 9999px, 82px, 0); }
            80% { clip: rect(47px, 9999px, 73px, 0); }
            85% { clip: rect(3px, 9999px, 27px, 0); }
            90% { clip: rect(40px, 9999px, 86px, 0); }
            95% { clip: rect(45px, 9999px, 72px, 0); }
            100% { clip: rect(23px, 9999px, 49px, 0); }
        }
        
        .typing-animation {
            border-right: 3px solid #00FF41;
            white-space: nowrap;
            overflow: hidden;
            animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
        }
        
        @keyframes typing {
            from { width: 0 }
            to { width: 100% }
        }
        
        @keyframes blink-caret {
            from, to { border-color: transparent }
            50% { border-color: #00FF41; }
        }
        
        /* Efecto hover para botones de nivel */
        .tier-card {
            transition: all 0.3s ease;
        }
        
        .tier-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 255, 65, 0.1);
        }
        
        /* Animación para badges populares */
        @keyframes popular-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .popular-badge {
            animation: popular-pulse 2s infinite;
        }
        
        /* Mejoras responsive */
        @media (max-width: 768px) {
            .glitch::before,
            .glitch::after {
                display: none;
            }
        }
    </style>
    
</body>
        <div class="cyber-card p-6 md:p-8">
            <div class="flex items-center mb-6">
                <i class="fas fa-patreon text-green-400 text-2xl md:text-3xl mr-4"></i>
                <h3 class="text-xl md:text-2xl font-bold section-title">
                    <span data-i18n="downloads.title">>> Visita Patreon</span>
                </h3>
            </div>
            
            <p class="mb-6 text-green-300/80 text-sm md:text-base" data-i18n="patreon.description">
                Mantente informado de los avances de la aplicacion
            </p>
            
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
}


function downloadAPK() {
    // URL del APK
    const apkUrl = 'https://deepirc.net/downloads/DeepIRC_v2.0.1.apk';
    const sha256Hash = 'a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcd';
    
    // Mostrar confirmación
    const confirmation = confirm(`¿Descargar DeepIRC v2.0.1?\n\nSHA-256: ${sha256Hash}\n\nVerifica la firma antes de instalar.`);
    
    if (confirmation) {
        // Crear enlace temporal
        const downloadLink = document.createElement('a');
        downloadLink.href = apkUrl;
        downloadLink.download = 'DeepIRC_v2.0.1.apk';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Mostrar mensaje
        const status = document.getElementById('downloadStatus');
        if (status) {
            status.innerHTML = `
                <div class="cyber-status p-4 mt-4 bg-green-900/20">
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

// =================== FUNCIONES DE IDIOMA ===================

function applyLanguage(lang) {
    if (!window.translations || !window.translations[lang]) return;
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (window.translations[lang][key]) {
            element.textContent = window.translations[lang][key];
        }
    });
}

// =================== FUNCIONES DE PRUEBA Y DEBUG ===================

// Para generar el hash correcto de tu clave maestra
window.generateMasterHash = function(key) {
    const encrypted = xorEncrypt(key, key);
    const hash = md5(encrypted);
    console.log(`Clave: "${key}"`);
    console.log(`Encriptada: "${encrypted}"`);
    console.log(`MD5: ${hash}`);
    console.log(`\nPara config.MASTER_KEY_HASH usa: "${hash}"`);
    return hash;
};

// Depuración
window.debugAppState = function() {
    console.log("=== ESTADO DE LA APLICACIÓN ===");
    console.log("AppState:", appState);
    console.log("Clave maestra configurada:", config.MASTER_KEY_HASH);
    console.log("Pacto aceptado:", appState.pactAccepted);
    console.log("Es admin:", appState.isAdmin);
    console.log("Datos registro:", appState.registrationData);
    console.log("Sección actual:", appState.currentSection);
    console.log("=============================");
};

// Ejecutar en consola para pruebas:
// generateMasterHash("DEEP_DRTHANDS_2025")
// debugAppState()
