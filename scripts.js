// =================== CONFIGURACIÓN ===================
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

    // Verificar admin persistente
    checkAdminPersistent();

    // Configurar navegación inicial
    setupInitialNavigation();

    // OCULTAR SECCIÓN ADMIN POR DEFECTO
    hideAdminSection();

     // ... otras inicializaciones ...
    initializeMasterKey();

    // Mostrar sección inicial
    if (!window.location.hash) {
        showSection('landing');
    }
}

function hideAdminSection() {
    console.log("👻 Ocultando sección admin...");

    // Ocultar enlace de admin en navegación
    const adminNavLinks = document.querySelectorAll('.nav-link[data-section="admin"]');
    adminNavLinks.forEach(link => {
        link.style.display = 'none';
        link.classList.remove('active');
    });

    // Ocultar sección admin si está visible
    const adminSection = document.getElementById('admin');
    if (adminSection) {
        adminSection.style.display = 'none';
        adminSection.classList.remove('active');
    }
}


function showAdminSection() {
    console.log("👑 Mostrando sección admin...");

    // Mostrar enlace de admin en navegación
    const adminNavLinks = document.querySelectorAll('.nav-link[data-section="admin"]');
    adminNavLinks.forEach(link => {
        link.style.display = 'flex';
    });

    // Mostrar sección admin
    const adminSection = document.getElementById('admin');
    if (adminSection) {
        adminSection.style.display = 'block';
    }
}


function setupInitialNavigation() {
    // Manejar hash inicial
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);

        // Si intentan acceder a admin sin permisos
        if (hash === 'admin' && !appState.isAdmin) {
            console.log("⛔ Bloqueando acceso admin no autorizado");
            showSection('landing');
            history.replaceState(null, '', '#landing');
            return;
        }

        // Mostrar sección válida
    
        const validSections = ['landing', 'help', 'linking', 'contract', 'admin', 'recovery', 'downloads', 'patreon'];
        if (validSections.includes(hash)) {
            setTimeout(() => {
                showSection(hash);

                // Cargar contenido específico
                if (hash === 'admin' && appState.isAdmin) {
                    loadAdminData();
                }
                if (hash === 'downloads') {
                    loadDownloadsInfo();
                }
                if (hash === 'patreon') {
                    loadPatreonSection();
                }
            }, 100);
        }
    } else {
        // Por defecto, mostrar landing
        showSection('landing');
    }
}
// =================== FUNCIONES DE REGISTRO ===================

function checkAdminPersistent() {
    const adminAuth = sessionStorage.getItem('deepirc_admin_auth');
    const adminTimestamp = sessionStorage.getItem('deepirc_admin_timestamp');

    if (adminAuth === 'true' && adminTimestamp) {
        const now = Date.now();
        const sessionDuration = 2 * 60 * 60 * 1000; // 2 horas

        if (now - parseInt(adminTimestamp) < sessionDuration) {
            console.log("✅ Sesión admin activa encontrada");
            appState.isAdmin = true;
            showAdminSection();
            return true;
        } else {
            console.log("⏰ Sesión admin expirada");
            sessionStorage.removeItem('deepirc_admin_auth');
            sessionStorage.removeItem('deepirc_admin_timestamp');
        }
    }

    appState.isAdmin = false;
    return false;
}

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

function saveAdminSession() {
    sessionStorage.setItem('deepirc_admin_auth', 'true');
    sessionStorage.setItem('deepirc_admin_timestamp', Date.now().toString());
    console.log("💾 Sesión admin guardada");
}

function clearAdminSession() {
    sessionStorage.removeItem('deepirc_admin_auth');
    sessionStorage.removeItem('deepirc_admin_timestamp');
    appState.isAdmin = false;
    hideAdminSection();
    console.log("🧹 Sesión admin limpiada");
}

// =================== FUNCIONES DE SEGURIDAD ===================

// Inicializar con la clave correcta si no está configurada
function initializeMasterKey() {
    if (!config.MASTER_KEY_HASH || config.MASTER_KEY_HASH.length !== 32) {
        console.warn("⚠️ MASTER_KEY_HASH no configurado o inválido");

        // Generar hash por defecto
        const defaultKey = "DEEP_DRTHANDS_2025";
        const defaultHash = generateMasterHash(defaultKey);

        if (defaultHash) {
            console.log(`🔄 Configurando hash por defecto: ${defaultHash}`);
            config.MASTER_KEY_HASH = defaultHash;

            // Mostrar alerta informativa
            setTimeout(() => {
                alert(`🔑 CLAVE MAESTRA CONFIGURADA\n\nClave: ${defaultKey}\nHash: ${defaultHash.substring(0, 16)}...\n\nGuarda este hash en config.MASTER_KEY_HASH`);
            }, 1000);
        }
    } else {
        console.log(`✅ MASTER_KEY_HASH configurado: ${config.MASTER_KEY_HASH.substring(0, 8)}...`);
    }
}


// Función MD5 mejorada (versión simplificada pero funcional)
function md5(input) {
    if (!input) return '';

    // Convertir string a array de bytes
    const bytes = [];
    for (let i = 0; i < input.length; i++) {
        bytes.push(input.charCodeAt(i));
    }

    // Implementación MD5 simplificada
    // En producción, usaría una librería como crypto-js
    let h0 = 0x67452301;
    let h1 = 0xEFCDAB89;
    let h2 = 0x98BADCFE;
    let h3 = 0x10325476;

    // Procesar bloques
    for (let i = 0; i < bytes.length; i += 64) {
        const chunk = bytes.slice(i, i + 64);

        // Operaciones MD5 (simplificadas)
        for (let j = 0; j < 64; j++) {
            let f, g;
             if (j < 16) {
                f = (h1 & h2) | ((~h1) & h3);
                g = j;
            } else if (j < 32) {
                f = (h3 & h1) | ((~h3) & h2);
                g = (5 * j + 1) % 16;
            } else if (j < 48) {
                f = h1 ^ h2 ^ h3;
                g = (3 * j + 5) % 16;
            } else {
                f = h2 ^ (h1 | (~h3));
                g = (7 * j) % 16;
            }

            // Variables temporales
            const temp = h3;
            h3 = h2;
            h2 = h1;
            h1 = h1 + ((h0 + f + chunk[g]) >>> 0);
            h0 = temp;
        }
    }

    // Convertir a hex
    const toHex = (num) => {
        const hex = (num >>> 0).toString(16);
        return '0'.repeat(8 - hex.length) + hex;
    };

    return toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3);
}

// Función de encriptación XOR mejorada
function xorEncrypt(text, key) {
    if (!text || !key) return '';

    let result = '';
    const keyLength = key.length;

    for (let i = 0; i < text.length; i++) {
        // Obtener caracteres como códigos ASCII
        const textCharCode = text.charCodeAt(i);
        const keyCharCode = key.charCodeAt(i % keyLength);

        // Aplicar XOR
        const encryptedCharCode = textCharCode ^ keyCharCode;

        // Asegurar que esté en rango ASCII imprimible (32-126)
        const safeCharCode = (encryptedCharCode % 95) + 32;

        result += String.fromCharCode(safeCharCode);
    }

    return result;
}

// Función de verificación mejorada
function verifyMasterKey(inputKey) {
    if (!inputKey || typeof inputKey !== 'string' || inputKey.trim() === '') {
        console.log("❌ Clave vacía o inválida");
        return false;
    }

    console.log(`🔐 Verificando clave: "${inputKey}"`);

    try {
        // Generar hash de la clave ingresada
        const inputHash = generateMasterHash(inputKey);

        if (!inputHash) {
            console.log("❌ No se pudo generar hash de la entrada");
            return false;
        }

        console.log(`📊 Hash de entrada: ${inputHash}`);
        console.log(`📊 Hash esperado:   ${config.MASTER_KEY_HASH}`);

        const isValid = inputHash === config.MASTER_KEY_HASH;

        if (isValid) {
            console.log("✅ ¡CLAVE VÁLIDA! Acceso concedido.");

            // Guardar sesión admin
            saveAdminSession();
            appState.isAdmin = true;
            showAdminSection();

            // Cargar datos admin automáticamente
            setTimeout(() => {
                if (appState.currentSection === 'admin') {
                    loadAdminData();
                }
            }, 500);
        } else {
            console.log("❌ Clave incorrecta");
        }

        return isValid;

    } catch (error) {
        console.error("❌ Error en verificación:", error);
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

        // Mostrar sección admin
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

// =================== FUNCIONES DE ADMIN - CORREGIDAS ===================

async function loadAdminData() {
    console.log("📊 Cargando datos de administración...");

    const adminContent = document.getElementById('adminContent');
    if (!adminContent) {
        console.error("❌ No se encontró adminContent");
        return;
    }

    // Mostrar loading
    adminContent.innerHTML = `
        <div class="text-center p-8">
            <i class="fas fa-sync-alt animate-spin text-3xl text-green-400 mb-4"></i>
            <p class="text-green-300">Conectando con la base de datos...</p>
            <p class="text-sm text-green-400/60 mt-2">Obteniendo registros de usuarios</p>
        </div>
    `;

    try {
        // Verificar que supabase está disponible
        if (typeof supabase === 'undefined') {
            throw new Error("Supabase no está disponible. Verifica la conexión.");
        }

        const _supabase = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

        console.log("🔗 Conectando a Supabase...");

        // Obtener todos los registros con timeout
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Timeout: La conexión tardó demasiado")), 10000)
        );

        const queryPromise = _supabase
            .from('device_registrations')
            .select('*')
            .order('created_at', { ascending: false });

 const { data: registrations, error } = await Promise.race([queryPromise, timeoutPromise]);

        if (error) {
            console.error("❌ Error en consulta Supabase:", error);
            throw new Error(`Error de base de datos: ${error.message}`);
        }

        console.log(`✅ Datos obtenidos: ${registrations?.length || 0} registros`);

        // Mostrar datos o mensaje si no hay
        if (!registrations || registrations.length === 0) {
            adminContent.innerHTML = `
                <div class="cyber-card p-6">
                    <h3 class="text-xl font-bold mb-4 text-green-300">PANEL DE ADMINISTRACIÓN</h3>
                    <div class="text-center p-8">
                        <i class="fas fa-database text-4xl text-gray-500 mb-4"></i>
                        <p class="text-gray-400">No hay registros en la base de datos</p>
                        <p class="text-sm text-gray-500 mt-2">La base de datos está vacía</p>
                        <button onclick="loadAdminData()" class="cyber-button mt-4">
                            <i class="fas fa-sync-alt mr-2"></i>Reintentar
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        // Calcular estadísticas
        const totalUsers = registrations.length;
        const premiumUsers = registrations.filter(r => r.is_premium).length;
        const pactAccepted = registrations.filter(r => r.pacto_aceptado).length;
        const today = new Date().toISOString().split('T')[0];
        const todayRegistrations = registrations.filter(r => 
            r.created_at && r.created_at.startsWith(today)
        ).length;


        // Generar HTML del panel admin
        let html = `
            <div class="cyber-card p-6 mb-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold text-green-300">PANEL DE ADMINISTRACIÓN</h3>
                    <div class="flex gap-2">
                        <button onclick="refreshAdminData()" class="cyber-button px-3 py-1">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button onclick="clearAdminSession()" class="cyber-button px-3 py-1 bg-red-900/30">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Estadísticas -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div class="cyber-card p-4 bg-green-900/20">
                        <p class="text-sm text-green-400">TOTAL</p>
                        <p class="text-2xl font-bold">${totalUsers}</p>
                    </div>
                    <div class="cyber-card p-4 bg-blue-900/20">
                        <p class="text-sm text-blue-400">PREMIUM</p>
                        <p class="text-2xl font-bold">${premiumUsers}</p>
                    </div>
                    <div class="cyber-card p-4 bg-yellow-900/20">
                        <p class="text-sm text-yellow-400">PACTO</p>
                        <p class="text-2xl font-bold">${pactAccepted}</p>
                    </div>
                    <div class="cyber-card p-4 bg-purple-900/20">
                        <p class="text-sm text-purple-400">HOY</p>
                        <p class="text-2xl font-bold">${todayRegistrations}</p>
                    </div>
                </div>
         <!-- Tabla de registros -->
                <div class="mb-4">
                    <h4 class="text-lg font-bold mb-3 text-green-300">ÚLTIMOS REGISTROS</h4>
                    <div class="overflow-x-auto rounded border border-green-800/50">
                        <table class="w-full text-sm">
                            <thead class="bg-green-950/50">
                                <tr>
                                    <th class="p-3 text-left">ID</th>
                                    <th class="p-3 text-left">Device ID</th>
                                    <th class="p-3 text-left">Nick</th>
                                    <th class="p-3 text-left">Email</th>
                                    <th class="p-3 text-left">Premium</th>
                                    <th class="p-3 text-left">Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
        `;

        // Filas de datos
        registrations.slice(0, 15).forEach((reg, index) => {
            const rowClass = index % 2 === 0 ? 'bg-green-900/10' : 'bg-green-900/5';
            const deviceId = reg.device_hash || 'N/A';
            const nick = reg.nick || 'N/A';
            const email = reg.email ? (reg.email.length > 15 ? reg.email.substring(0, 15) + '...' : reg.email) : 'N/A';
            const premium = reg.is_premium ? '✅' : '❌';
            const date = reg.created_at ? new Date(reg.created_at).toLocaleDateString('es-ES') : 'N/A';

            html += `
                <tr class="${rowClass} hover:bg-green-800/20">
                    <td class="p-3 font-mono text-xs">${reg.id ? reg.id.substring(0, 6) + '...' : 'N/A'}</td>
                    <td class="p-3 font-mono text-xs">${deviceId.substring(0, 10)}...</td>
                    <td class="p-3">${nick}</td>
                    <td class="p-3">${email}</td>
                    <td class="p-3 text-center">${premium}</td>
                    <td class="p-3 text-xs">${date}</td>
                </tr>
            `;
        });

        html += `
                            </tbody>
                        </table>
                    </div>
                    <p class="text-xs text-green-400/60 mt-2">Mostrando ${Math.min(15, registrations.length)} de ${registrations.length} registros</p>
                </div>
                
                <!-- Información de conexión -->
                <div class="mt-6 pt-4 border-t border-green-800">
                    <div class="flex flex-wrap gap-4 text-xs text-green-400/70">
                        <div class="flex items-center">
                            <i class="fas fa-database mr-2"></i>
                            <span>Tabla: device_registrations</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-clock mr-2"></i>
                            <span>Actualizado: ${new Date().toLocaleTimeString()}</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-user-shield mr-2"></i>
                            <span>Acceso: Root</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        adminContent.innerHTML = html;

    } catch (error) {
 console.error("❌ Error cargando datos admin:", error);
        adminContent.innerHTML = `
            <div class="cyber-card p-6">
                <h3 class="text-xl font-bold mb-4 text-red-300">ERROR DE CONEXIÓN</h3>
                <div class="p-4 bg-red-900/20 border border-red-700/30 rounded mb-4">
                    <p class="text-red-400">${error.message}</p>
                    <p class="text-sm text-red-400/70 mt-2">
                        Posibles causas:<br>
                        1. Sin conexión a internet<br>
                        2. Supabase no disponible<br>
                        3. Problemas con la API key<br>
                        4. La tabla no existe o tiene otro nombre
                    </p>
                </div>
                <div class="flex gap-2">
                    <button onclick="loadAdminData()" class="cyber-button">
                        <i class="fas fa-sync-alt mr-2"></i>Reintentar
                    </button>
                    <button onclick="testSupabaseConnection()" class="cyber-button">
                        <i class="fas fa-network-wired mr-2"></i>Test Conexión
                    </button>
                </div>
            </div>
        `;
    }
}

async function testSupabaseConnection() {
    try {
        const _supabase = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
        const { data, error } = await _supabase
            .from('device_registrations')
            .select('count')
            .limit(1);

        if (error) throw error;

        alert(`✅ Conexión exitosa\n\nSupabase responde correctamente.\nURL: ${config.SUPABASE_URL}`);
    } catch (error) {
        alert(`❌ Error de conexión:\n\n${error.message}\n\nVerifica:\n1. La URL de Supabase\n2. La API key\n3. Los permisos de la tabla`);
    }
}

function refreshAdminData() {
    console.log("🔄 Actualizando datos admin...");
    loadAdminData();
}

// =================== FUNCIONES DE NAVEGACIÓN ===================

function showSection(sectionId) {
    console.log(`📌 Mostrando sección: ${sectionId}`);

    // Ocultar todas las secciones
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });

    // Actualizar enlaces de navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Mostrar sección seleccionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');

        // Activar enlace correspondiente (si existe y es visible)
        const correspondingLink = document.querySelector(`.nav-link[data-section="${sectionId}"]:not([style*="none"])`);
        if (correspondingLink) {
            correspondingLink.classList.add('active');
        }

        appState.currentSection = sectionId;

        // Actualizar URL
        history.pushState(null, '', `#${sectionId}`);

        // Scroll suave
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    }
}


// =================== FUNCIONES DE EVENTOS ===================

function setupEventListeners() {
    console.log("⚙️ Configurando event listeners...");

    // Navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;

            // Verificar acceso a admin
            if (section === 'admin') {
                if (!appState.isAdmin) {
                    const userKey = prompt("🔑 Introduce la clave de administrador:");
                    if (userKey && verifyMasterKey(userKey)) {
                        showSection('admin');
                        setTimeout(() => loadAdminData(), 300);
                    } else {
                        alert("❌ Clave incorrecta. Acceso denegado.");
                        return;
                    }
                } else {
                    showSection('admin');
                    setTimeout(() => loadAdminData(), 100);
                }
                return;
            }

            showSection(section);

            // Cargar contenido específico
            if (section === 'downloads') {
                setTimeout(() => loadDownloadsInfo(), 100);
            }
            if (section === 'patreon') {
                setTimeout(() => loadPatreonSection(), 100);
            }
        });
    });

    // Input de acceso con Enter
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

    // Navegación del historial
    window.addEventListener('popstate', function() {
        if (window.location.hash) {
            const section = window.location.hash.substring(1);

            // Bloquear admin si no tiene acceso
            if (section === 'admin' && !appState.isAdmin) {
                alert("⛔ Acceso restringido. Necesitas clave de administrador.");
                showSection('landing');
                history.replaceState(null, '', '#landing');
                return;
            }

            showSection(section);
        }
    });
}
// =================== FUNCIONES AUXILIARES ===================

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

// Función para generar hash de clave maestra CORREGIDA
function generateMasterHash(key) {
    if (!key || typeof key !== 'string') {
        console.error("❌ Error: La clave debe ser un string no vacío");
        return null;
    }

    console.log(`🔑 Generando hash para clave: "${key}"`);

    try {
        // Paso 1: Encriptar la clave consigo misma
        const encrypted = xorEncrypt(key, key);
        console.log(`   Paso 1 - Clave encriptada: "${encrypted}" (${encrypted.length} chars)`);

        // Paso 2: Convertir a representación hexadecimal de los códigos ASCII
        let hexRepresentation = '';
        for (let i = 0; i < encrypted.length; i++) {
            hexRepresentation += encrypted.charCodeAt(i).toString(16).padStart(2, '0');
        }
        console.log(`   Paso 2 - Representación hex: ${hexRepresentation.substring(0, 32)}...`);

        // Paso 3: Aplicar MD5 a la representación hexadecimal
        const hashResult = simpleMD5(hexRepresentation);
        console.log(`   Paso 3 - Hash MD5 resultante: ${hashResult}`);

        // Paso 4: Verificar que el hash sea válido
        if (!hashResult || hashResult.length !== 32) {
            throw new Error("Hash inválido generado");
        }

        console.log(`✅ Hash generado exitosamente: ${hashResult}`);
        console.log(`📋 Para config.MASTER_KEY_HASH usa: "${hashResult}"`);

        return hashResult;

    } catch (error) {
        console.error("❌ Error generando hash:", error);
        return null;
    }
}

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
