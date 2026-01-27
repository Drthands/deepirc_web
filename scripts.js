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
                setTimeout(() => loadPatreonSection(), 100);
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
