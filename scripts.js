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
}

function hideAdminSection() {
    // Ocultar enlace de admin en navegación
    const adminNav = document.querySelector('.nav-link[data-section="admin"]');
    if (adminNav) {
        adminNav.style.display = 'none';
    }
    
    // Si estamos en la sección admin, redirigir a landing
    if (window.location.hash === '#admin' && !appState.isAdmin) {
        showSection('landing');
        history.replaceState(null, '', '#landing');
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
                    <p class="text-sm text-blue-300/70">2. Ingresa tu token: <strong>${appState.registrationData.token.substring(0, 12)}...</strong></p>
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
        
        console.log(`Verificación clave: Input="${inputKey}", Hash=${calculatedHash}`);
        
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
        console.error("Elementos del DOM no encontrados");
        return;
    }
    
    const code = tokenInput.value.trim();
    
    // 1. Verificar si es clave maestra para admin
    if (verifyMasterKey(code)) {
        console.log("Clave maestra aceptada - Acceso Admin");
        appState.isAdmin = true;
        
        // Mostrar sección admin
        showAdminSection();
        showSection('admin');
        
        // Cargar datos de admin
        await loadAdminData();
        
        status.innerHTML = `<i class="fas fa-shield-alt mr-2"></i>
                           <span>ACCESO ROOT CONCEDIDO. BIENVENIDO, OPERADOR.</span>`;
        status.style.color = "#00FF41";
        
        tokenInput.value = "";
        return;
    }
    
    // 2. Verificar pacto para registro normal
    const isAccepted = document.getElementById('acceptPact')?.checked || appState.pactAccepted;
    if (!isAccepted) {
        status.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i>
                           <span>ERROR: Debes aceptar el Pacto de Honor.</span>`;
        status.style.color = "#ef4444";
        
        highlightPactSection();
        return;
    }
    
    // 3. Verificar código de token
    if (!code || code.length < 8) {
        status.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>
                           <span>ERROR: Token inválido (mínimo 8 caracteres).</span>`;
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
                pacto_aceptado: true,
                created_at: new Date().toISOString(),
                last_access: new Date().toISOString()
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
        
        // Mostrar éxito
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
                pacto_aceptado: true,
                created_at: new Date().toISOString(),
                last_access: new Date().toISOString()
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
            .order('created_at', { ascending: false })
            .limit(100);
        
        if (error) throw error;
        
        // Estadísticas
        const totalUsers = registrations.length;
        const premiumUsers = registrations.filter(r => r.is_premium).length;
        const trialUsers = registrations.filter(r => r.pacto_aceptado && !r.is_premium).length;
        
        // Generar HTML
        let html = `
            <div class="cyber-card p-6 mb-6">
                <h3 class="text-xl font-bold mb-4 text-green-300">PANEL DE ADMINISTRACIÓN</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="cyber-card p-4 bg-green-900/20">
                        <p class="text-sm text-green-400">USUARIOS TOTALES</p>
                        <p class="text-2xl font-bold">${totalUsers}</p>
                    </div>
                    <div class="cyber-card p-4 bg-blue-900/20">
                        <p class="text-sm text-blue-400">USUARIOS PREMIUM</p>
                        <p class="text-2xl font-bold">${premiumUsers}</p>
                    </div>
                    <div class="cyber-card p-4 bg-yellow-900/20">
                        <p class="text-sm text-yellow-400">USUARIOS TRIAL</p>
                        <p class="text-2xl font-bold">${trialUsers}</p>
                    </div>
                </div>
                
                <h4 class="text-lg font-bold mb-3 text-green-300">ÚLTIMOS REGISTROS</h4>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-green-800">
                                <th class="p-2 text-left">Device ID</th>
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
                    <td class="p-2 font-mono">${reg.device_hash.substring(0, 8)}...</td>
                    <td class="p-2">${reg.nick || 'N/A'}</td>
                    <td class="p-2">${reg.email || 'N/A'}</td>
                    <td class="p-2">${reg.is_premium ? '✅' : '❌'}</td>
                    <td class="p-2">${new Date(reg.created_at).toLocaleDateString()}</td>
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
                            <i class="fas fa-download mr-2"></i>Exportar Datos
                        </button>
                        <button onclick="refreshAdminData()" class="cyber-button px-4 py-2">
                            <i class="fas fa-sync-alt mr-2"></i>Actualizar
                        </button>
                        <button onclick="clearAllData()" class="cyber-button px-4 py-2 bg-red-900/30 border-red-700">
                            <i class="fas fa-trash mr-2"></i>Limpiar BD
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        adminContent.innerHTML = html;
        
    } catch (error) {
        console.error("Error cargando datos admin:", error);
        adminContent.innerHTML = `<div class="cyber-card p-6">
            <p class="text-red-400">Error cargando datos: ${error.message}</p>
        </div>`;
    }
}

function refreshAdminData() {
    loadAdminData();
}

function exportData() {
    alert("Función de exportación en desarrollo...");
}

function clearAllData() {
    if (confirm("⚠️ ¿ESTÁS SEGURO DE ELIMINAR TODOS LOS DATOS?\nEsta acción no se puede deshacer.")) {
        alert("Función de limpieza en desarrollo...");
    }
}

// =================== FUNCIONES AUXILIARES ===================

function showSection(sectionId) {
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
    }
}

function setupEventListeners() {
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

// =================== RECUPERACIÓN MEJORADA ===================

// Nueva función para recuperación con contraseña
async function startPasswordRecovery() {
    const email = document.getElementById('recoveryEmail').value.trim();
    const password = document.getElementById('recoveryPassword').value;
    const status = document.getElementById('recoveryStatus');
    
    if (!email || !password) {
        showRecoveryError('Por favor, completa todos los campos');
        return;
    }
    
    status.innerHTML = `<i class="fas fa-sync-alt animate-spin mr-2"></i>Buscando cuenta...`;
    status.className = 'text-yellow-400';
    
    try {
        const _supabase = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
        
        // 1. Obtener todos los registros
        const { data: registrations, error } = await _supabase
            .from('device_registrations')
            .select('*')
            .not('email', 'is', null);
        
        if (error) throw error;
        
        // 2. Intentar descifrar cada email con la contraseña
        let foundRecord = null;
        for (const record of registrations) {
            try {
                // Intenta descifrar el email (esto depende de cómo esté cifrado en la app)
                // Para demo, asumimos que el email en la BD está cifrado con la contraseña
                const decryptedEmail = xorEncrypt(record.email, password);
                
                // Verificar si coincide (simplificado - en realidad necesitarías más lógica)
                if (decryptedEmail.includes('@') && decryptedEmail.toLowerCase() === email.toLowerCase()) {
                    foundRecord = record;
                    break;
                }
            } catch (e) {
                // Continuar con el siguiente registro
                continue;
            }
        }
        
        if (!foundRecord) {
            showRecoveryError('No se encontró cuenta con esos datos');
            return;
        }
        
        // 3. Generar nuevo token
        const newToken = 'DEEP-' + generateDeviceId();
        
        // 4. Actualizar registro con nuevo token
        const { error: updateError } = await _supabase
            .from('device_registrations')
            .update({ 
                device_hash: newToken.replace("DEEP-", "").trim().toLowerCase(),
                last_access: new Date().toISOString()
            })
            .eq('id', foundRecord.id);
        
        if (updateError) throw updateError;
        
        // 5. Mostrar éxito
        status.innerHTML = `<i class="fas fa-check-circle mr-2"></i>Recuperación exitosa!`;
        status.className = 'text-green-400';
        
        document.getElementById('recoveryResult').innerHTML = `
            <div class="cyber-card p-4 mt-4 bg-green-900/20">
                <p class="font-bold">Cuenta recuperada:</p>
                <p class="mt-2">Nick: <strong>${foundRecord.nick}</strong></p>
                <p>Nuevo Token: <strong class="font-mono">${newToken}</strong></p>
                <p class="text-sm mt-2 text-green-300/70">Usa este token en tu app para acceder.</p>
            </div>
        `;
        
    } catch (error) {
        console.error("Error en recuperación:", error);
        showRecoveryError('Error en el proceso de recuperación');
    }
}

function showRecoveryError(message) {
    const status = document.getElementById('recoveryStatus');
    status.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${message}`;
    status.className = 'text-red-400';
}

function generateDeviceId() {
    return Math.random().toString(36).substr(2, 10).toUpperCase();
}

// =================== FUNCIONES DE PRUEBA ===================

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

// Ejecutar en consola: generateMasterHash("DEEP_DRTHANDS_2025")
