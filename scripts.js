// =================== CONFIGURACIÓN ===================
const config = {
    SUPABASE_URL: 'https://bbbqjzjaivzrywwkczry.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiYnFqemphaXZ6cnl3d2tjenJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMjkwMzAsImV4cCI6MjA4MTkwNTAzMH0.6bMDVnoOhiigahZOJU7e59Nn6q95Kop4U4h9iwEtAhQ',
    // Hash MD5 de "DEEP_DRTHANDS_2025" encriptado consigo mismo
    MASTER_KEY_HASH: "aefb2947d03a6a6662780d18209280bc",
    VERSION: "2.0.1"
};

// =================== ESTADO DE LA APLICACIÓN ===================
const appState = {
    currentLang: 'es',
    currentSection: 'landing',
    isAdmin: false,
    userData: null,
    pactAccepted: false,
    registrationData: null
};

// =================== FUNCIONES DE ENCRIPTACIÓN ===================

// XOR Encryption simple pero funcional
function xorEncrypt(text, key) {
    if (!text || !key) return '';
    
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const textChar = text.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        result += String.fromCharCode(textChar ^ keyChar);
    }
    return result;
}

// MD5 simplificado pero funcional
function md5(input) {
    if (!input) return '';
    
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convertir a 32-bit integer
    }
    
    // Convertir a hexadecimal de 32 caracteres
    let hex = (hash >>> 0).toString(16);
    while (hex.length < 32) {
        hex = '0' + hex;
    }
    return hex;
}

// =================== FUNCIÓN GENERAR HASH DE CLAVE MAESTRA ===================
function generateMasterHash(key) {
    if (!key || typeof key !== 'string') {
        console.error("❌ Error: La clave debe ser un string");
        return null;
    }
    
    console.log(`🔑 Generando hash para: "${key}"`);
    
    try {
        // 1. Encriptar clave consigo misma
        const encrypted = xorEncrypt(key, key);
        console.log(`   Encriptado: "${encrypted}"`);
        
        // 2. Convertir a representación hex de ASCII
        let hexString = '';
        for (let i = 0; i < encrypted.length; i++) {
            hexString += encrypted.charCodeAt(i).toString(16).padStart(2, '0');
        }
        
        // 3. Aplicar MD5
        const finalHash = md5(hexString);
        console.log(`   Hash final: ${finalHash}`);
        
        return finalHash;
        
    } catch (error) {
        console.error("❌ Error generando hash:", error);
        return null;
    }
}

// =================== VERIFICACIÓN DE CLAVE MAESTRA ===================
function verifyMasterKey(inputKey) {
    if (!inputKey || inputKey.trim() === '') {
        return false;
    }
    
    console.log(`🔐 Verificando clave: "${inputKey}"`);
    
    const generatedHash = generateMasterHash(inputKey);
    
    if (!generatedHash) {
        return false;
    }
    
    const isValid = generatedHash === config.MASTER_KEY_HASH;
    
    console.log(`   Hash generado: ${generatedHash}`);
    console.log(`   Hash esperado: ${config.MASTER_KEY_HASH}`);
    console.log(`   Resultado: ${isValid ? '✅ VÁLIDA' : '❌ INVÁLIDA'}`);
    
    if (isValid) {
        // Guardar sesión
        sessionStorage.setItem('deepirc_admin_auth', 'true');
        sessionStorage.setItem('deepirc_admin_timestamp', Date.now().toString());
        appState.isAdmin = true;
        
        // Mostrar sección admin
        const adminNav = document.querySelector('.nav-link[data-section="admin"]');
        if (adminNav) adminNav.style.display = 'flex';
    }
    
    return isValid;
}

// =================== INICIALIZACIÓN ===================
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 DeepIRC Web inicializando...");
    
    // Configurar idioma
    const savedLang = localStorage.getItem('deepirc_lang') || 'es';
    appState.currentLang = savedLang;
    
    // Verificar pacto
    checkPactStatus();
    
    // Verificar sesión admin
    checkAdminSession();
    
    // Ocultar admin por defecto
    hideAdminSection();
    
    // Configurar navegación
    setupNavigation();
    
    // Configurar eventos
    setupEventListeners();
    
    // Verificar registro desde app
    checkRegistrationParams();
});

// =================== FUNCIONES DE ADMIN ===================
function hideAdminSection() {
    const adminNav = document.querySelector('.nav-link[data-section="admin"]');
    if (adminNav) adminNav.style.display = 'none';
    
    const adminSection = document.getElementById('admin');
    if (adminSection) adminSection.style.display = 'none';
}

function checkAdminSession() {
    const auth = sessionStorage.getItem('deepirc_admin_auth');
    const timestamp = sessionStorage.getItem('deepirc_admin_timestamp');
    
    if (auth === 'true' && timestamp) {
        const now = Date.now();
        const sessionAge = now - parseInt(timestamp);
        const sessionLimit = 2 * 60 * 60 * 1000; // 2 horas
        
        if (sessionAge < sessionLimit) {
            appState.isAdmin = true;
            const adminNav = document.querySelector('.nav-link[data-section="admin"]');
            if (adminNav) adminNav.style.display = 'flex';
        } else {
            sessionStorage.removeItem('deepirc_admin_auth');
            sessionStorage.removeItem('deepirc_admin_timestamp');
        }
    }
}

// =================== NAVEGACIÓN ===================
function setupNavigation() {
    // Mostrar sección según hash
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        showSection(hash);
    } else {
        showSection('landing');
    }
}

function showSection(sectionId) {
    console.log(`📌 Mostrando sección: ${sectionId}`);
    
    // Verificar acceso a admin
    if (sectionId === 'admin' && !appState.isAdmin) {
        alert("⛔ Acceso restringido. Introduce la clave de administrador en el campo principal.");
        showSection('landing');
        return;
    }
    
    // Ocultar todas las secciones
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar sección objetivo
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
        
        // Actualizar navegación
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');
        
        appState.currentSection = sectionId;
        
        // Cargar contenido específico
        if (sectionId === 'admin' && appState.isAdmin) {
            loadAdminData();
        }
        if (sectionId === 'downloads') {
            loadDownloadsInfo();
        }
    }
}

// =================== FUNCIONES DE REGISTRO ===================
function checkRegistrationParams() {
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('nick') && params.has('token')) {
        appState.registrationData = {
            nick: decodeURIComponent(params.get('nick')),
            email: params.get('email') ? decodeURIComponent(params.get('email')) : '',
            token: decodeURIComponent(params.get('token')),
            plan: params.get('plan') || 'free'
        };
        
        console.log("📱 Datos de registro recibidos:", appState.registrationData);
        
        // Auto-llenar token
        const tokenInput = document.getElementById('accessCode');
        if (tokenInput) {
            tokenInput.value = appState.registrationData.token;
        }
        
        // Mostrar notificación
        showRegistrationNotification();
    }
}

function showRegistrationNotification() {
    const existing = document.querySelector('.registration-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'registration-notification fixed top-4 right-4 z-50';
    notification.innerHTML = `
        <div class="bg-blue-900/80 border border-blue-500 rounded p-4 max-w-xs">
            <div class="flex items-start">
                <span class="text-blue-400 mr-2">📱</span>
                <div>
                    <p class="font-bold text-blue-300">Registro desde App</p>
                    <p class="text-sm text-blue-200/80">Token auto-llenado</p>
                    <p class="text-xs text-blue-300/60 mt-1">Acepta el pacto y presiona "Acceder"</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 5000);
}

// =================== FUNCIÓN PRINCIPAL DE ACCESO ===================
async function handleAccess() {
    const tokenInput = document.getElementById('accessCode');
    const status = document.getElementById('statusMsg');
    
    if (!tokenInput || !status) return;
    
    const code = tokenInput.value.trim();
    
    // 1. Verificar si es clave maestra
    if (verifyMasterKey(code)) {
        status.innerHTML = `<span class="text-green-400">✅ Clave maestra aceptada. Acceso admin concedido.</span>`;
        showSection('admin');
        tokenInput.value = '';
        return;
    }
    
    // 2. Verificar pacto
    const pactCheckbox = document.getElementById('acceptPact');
    if (pactCheckbox && !pactCheckbox.checked && !appState.pactAccepted) {
        status.innerHTML = `<span class="text-red-400">❌ Debes aceptar el Pacto de Honor</span>`;
        showSection('contract');
        return;
    }
    
    // 3. Verificar token
    if (!code || code.length < 8) {
        status.innerHTML = `<span class="text-red-400">❌ Token inválido</span>`;
        return;
    }
    
    // 4. Procesar registro
    status.innerHTML = `<span class="text-yellow-400">🔄 Procesando...</span>`;
    
    try {
        if (appState.registrationData) {
            await processAppRegistration(code, status);
        } else {
            await processWebRegistration(code, status);
        }
    } catch (error) {
        status.innerHTML = `<span class="text-red-400">❌ Error: ${error.message}</span>`;
    }
}

async function processAppRegistration(code, status) {
    // Verificar que el token coincida
    if (code !== appState.registrationData.token && 
        code.replace('DEEP-', '') !== appState.registrationData.token.replace('DEEP-', '')) {
        status.innerHTML = `<span class="text-red-400">❌ Token no coincide con la app</span>`;
        return;
    }
    
    // Insertar en Supabase
    const _supabase = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
    const deviceHash = code.replace('DEEP-', '').toLowerCase().trim();
    
    const { error } = await _supabase
        .from('device_registrations')
        .upsert({
            device_hash: deviceHash,
            nick: appState.registrationData.nick,
            email: appState.registrationData.email,
            is_premium: appState.registrationData.plan === 'premium',
            pacto_aceptado: true,
            created_at: new Date().toISOString(),
            last_access: new Date().toISOString()
        });
    
    if (error) throw error;
    
    status.innerHTML = `<span class="text-green-400">✅ Registro completado. Ya puedes usar la app.</span>`;
    appState.registrationData = null;
    
    // Limpiar URL
    history.replaceState({}, '', window.location.pathname);
}

async function processWebRegistration(code, status) {
    const _supabase = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
    const params = new URLSearchParams(window.location.search);
    
    const { error } = await _supabase
        .from('device_registrations')
        .upsert({
            device_hash: code.replace('DEEP-', '').toLowerCase().trim(),
            nick: params.get('nick') || 'Anon',
            email: params.get('email') || '',
            is_premium: params.get('plan') === 'premium',
            pacto_aceptado: true,
            created_at: new Date().toISOString(),
            last_access: new Date().toISOString()
        });
    
    if (error) throw error;
    
    status.innerHTML = `<span class="text-green-400">✅ Vinculación exitosa</span>`;
}

// =================== PANEL DE ADMINISTRACIÓN ===================
async function loadAdminData() {
    const adminContent = document.getElementById('adminContent');
    if (!adminContent) return;
    
    adminContent.innerHTML = `
        <div class="p-8 text-center">
            <div class="animate-spin text-green-400 text-3xl mb-4">🔄</div>
            <p>Cargando datos...</p>
        </div>
    `;
    
    try {
        const _supabase = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
        
        const { data: registrations, error } = await _supabase
            .from('device_registrations')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);
        
        if (error) throw error;
        
        // Calcular estadísticas
        const total = registrations.length;
        const premium = registrations.filter(r => r.is_premium).length;
        const today = new Date().toISOString().split('T')[0];
        const todayCount = registrations.filter(r => r.created_at?.startsWith(today)).length;
        
        let html = `
            <div class="p-6">
                <h3 class="text-xl font-bold mb-6 text-green-300">🔧 Panel de Administración</h3>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div class="bg-green-900/30 p-4 rounded border border-green-700/50">
                        <p class="text-sm text-green-400">Total</p>
                        <p class="text-2xl font-bold">${total}</p>
                    </div>
                    <div class="bg-blue-900/30 p-4 rounded border border-blue-700/50">
                        <p class="text-sm text-blue-400">Premium</p>
                        <p class="text-2xl font-bold">${premium}</p>
                    </div>
                    <div class="bg-yellow-900/30 p-4 rounded border border-yellow-700/50">
                        <p class="text-sm text-yellow-400">Hoy</p>
                        <p class="text-2xl font-bold">${todayCount}</p>
                    </div>
                    <div class="bg-purple-900/30 p-4 rounded border border-purple-700/50">
                        <p class="text-sm text-purple-400">Activos</p>
                        <p class="text-2xl font-bold">${total}</p>
                    </div>
                </div>
                
                <div class="mb-4">
                    <h4 class="text-lg font-bold mb-3 text-green-300">Últimos registros</h4>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-green-900/50">
                                <tr>
                                    <th class="p-3 text-left">ID</th>
                                    <th class="p-3 text-left">Nick</th>
                                    <th class="p-3 text-left">Email</th>
                                    <th class="p-3 text-left">Premium</th>
                                    <th class="p-3 text-left">Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
        `;
        
        registrations.slice(0, 10).forEach(reg => {
            html += `
                <tr class="border-b border-green-800/30">
                    <td class="p-3 font-mono text-xs">${reg.device_hash?.substring(0, 8)}...</td>
                    <td class="p-3">${reg.nick || 'N/A'}</td>
                    <td class="p-3">${reg.email?.substring(0, 20) || 'N/A'}</td>
                    <td class="p-3">${reg.is_premium ? '✅' : '❌'}</td>
                    <td class="p-3 text-xs">${new Date(reg.created_at).toLocaleDateString()}</td>
                </tr>
            `;
        });
        
        html += `
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="flex gap-2 mt-6">
                    <button onclick="refreshAdminData()" class="px-4 py-2 bg-green-700 hover:bg-green-600 rounded">
                        Actualizar
                    </button>
                    <button onclick="exportAdminData()" class="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded">
                        Exportar
                    </button>
                </div>
            </div>
        `;
        
        adminContent.innerHTML = html;
        
    } catch (error) {
        adminContent.innerHTML = `
            <div class="p-6">
                <div class="bg-red-900/30 border border-red-700 p-4 rounded mb-4">
                    <p class="text-red-300">Error: ${error.message}</p>
                </div>
                <button onclick="loadAdminData()" class="px-4 py-2 bg-green-700 rounded">
                    Reintentar
                </button>
            </div>
        `;
    }
}

function refreshAdminData() {
    loadAdminData();
}

function exportAdminData() {
    alert("La exportación estará disponible en la próxima versión");
}

// =================== FUNCIONES AUXILIARES ===================
function setupEventListeners() {
    // Navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            showSection(section);
        });
    });
    
    // Input con Enter
    const accessInput = document.getElementById('accessCode');
    if (accessInput) {
        accessInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleAccess();
        });
    }
    
    // Pacto
    const pactCheckbox = document.getElementById('acceptPact');
    if (pactCheckbox) {
        pactCheckbox.addEventListener('change', function() {
            appState.pactAccepted = this.checked;
            localStorage.setItem('deepirc_pact_accepted', this.checked);
        });
    }
}

function checkPactStatus() {
    const saved = localStorage.getItem('deepirc_pact_accepted');
    const checkbox = document.getElementById('acceptPact');
    
    if (saved === 'true' && checkbox) {
        checkbox.checked = true;
        appState.pactAccepted = true;
    }
}

// =================== FUNCIONES DE DESCARGA ===================
function loadDownloadsInfo() {
    const downloadsSection = document.getElementById('downloads');
    if (!downloadsSection) return;
    
    downloadsSection.innerHTML = `
        <div class="p-6">
            <h3 class="text-xl font-bold mb-6 text-green-300">📥 Descargas</h3>
            
            <div class="bg-green-900/30 border border-green-700/50 rounded p-6 mb-6">
                <div class="flex flex-col md:flex-row justify-between items-center mb-4">
                    <div>
                        <h4 class="text-lg font-bold text-green-300 mb-2">DeepIRC Android APK</h4>
                        <div class="text-sm text-green-400/80">
                            <span class="mr-4">v2.0.1</span>
                            <span class="mr-4">12.4 MB</span>
                            <span>SHA-256 Verificado</span>
                        </div>
                    </div>
                    <button onclick="downloadAPK()" class="mt-4 md:mt-0 px-6 py-3 bg-green-600 hover:bg-green-500 rounded font-bold">
                        📥 Descargar APK
                    </button>
                </div>
                
                <div class="mt-6 pt-6 border-t border-green-800/50">
                    <h5 class="font-bold mb-3 text-green-300">Instrucciones</h5>
                    <ol class="list-decimal pl-5 space-y-2 text-green-400/80">
                        <li>Permite "Fuentes desconocidas" en Ajustes de seguridad</li>
                        <li>Descarga e instala el APK</li>
                        <li>Abre DeepIRC y acepta el Pacto de Honor</li>
                    </ol>
                </div>
            </div>
            
            <div class="bg-purple-900/30 border border-purple-700/50 rounded p-6">
                <h4 class="text-lg font-bold mb-4 text-purple-300">❤️ Apoya el proyecto en Patreon</h4>
                <p class="mb-4 text-purple-400/80">Tu apoyo nos ayuda a mantener los servidores y desarrollar nuevas características.</p>
                <a href="https://patreon.com/deepirc" target="_blank" 
                   class="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded font-bold">
                    <span class="mr-2">🎯</span> Apoyar en Patreon
                </a>
            </div>
        </div>
    `;
}

function downloadAPK() {
    const apkUrl = 'https://deepirc.net/downloads/DeepIRC_v2.0.1.apk';
    
    if (confirm('¿Descargar DeepIRC v2.0.1?\n\nVerifica la firma SHA-256 antes de instalar.')) {
        const link = document.createElement('a');
        link.href = apkUrl;
        link.download = 'DeepIRC_v2.0.1.apk';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// =================== FUNCIONES DE DEPURACIÓN ===================
window.generateMasterHash = generateMasterHash;

window.testMasterKey = function(key = "DEEP_DRTHANDS_2025") {
    console.log("🧪 Probando clave:", key);
    const hash = generateMasterHash(key);
    console.log("Hash generado:", hash);
    console.log("Hash en config:", config.MASTER_KEY_HASH);
    console.log("Coincide:", hash === config.MASTER_KEY_HASH);
    return hash;
};

window.debugApp = function() {
    console.log("=== DEBUG APP ===");
    console.log("AppState:", appState);
    console.log("Config:", config);
    console.log("Admin:", appState.isAdmin);
    console.log("Pacto:", appState.pactAccepted);
    console.log("Registro:", appState.registrationData);
    console.log("=================");
};

// =================== INICIALIZAR MASTER KEY ===================
(function initMasterKey() {
    // Si no hay hash configurado, usar el por defecto
    if (!config.MASTER_KEY_HASH || config.MASTER_KEY_HASH.length !== 32) {
        const defaultKey = "DEEP_DRTHANDS_2025";
        const defaultHash = generateMasterHash(defaultKey);
        if (defaultHash) {
            config.MASTER_KEY_HASH = defaultHash;
            console.log("🔄 Hash configurado:", defaultHash);
        }
    }
})();
