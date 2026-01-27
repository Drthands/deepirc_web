// Configuración y variables globales
const config = {
    SUPABASE_URL: 'https://bbbqjzjaivzrywwkczry.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiYnFqemphaXZ6cnl3d2tjenJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMjkwMzAsImV4cCI6MjA4MTkwNTAzMH0.6bMDVnoOhiigahZOJU7e59Nn6q95Kop4U4h9iwEtAhQ',
    MASTER_KEY_HASH: "786f622048bf247dbec34f4c6236380e", 
    VERSION: "2.0.1"
};

// Estado de la aplicación
const appState = {
    currentLang: 'es',
    currentSection: 'landing',
    isAdmin: false,
    userData: null,
    pactAccepted: false,
    registrationData: null // Datos de registro pendientes
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    createMatrixEffect();
    checkRegistrationParams(); // Verificar si hay datos de registro
});

// Verificar parámetros de registro desde la app
function checkRegistrationParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('nick') && urlParams.has('token')) {
        // Guardar datos de registro pendientes
        appState.registrationData = {
            nick: urlParams.get('nick'),
            email: urlParams.get('email') || '',
            token: urlParams.get('token'),
            plan: urlParams.get('plan') || 'free',
            timestamp: Date.now()
        };
        
        console.log("Datos de registro recibidos:", appState.registrationData);
        
        // Mostrar mensaje informativo
        showRegistrationNotification();
        
        // Navegar automáticamente al contrato si no está aceptado
        if (!appState.pactAccepted) {
            setTimeout(() => {
                showSection('contract');
                highlightPactSection();
            }, 1000);
        }
    }
}

// Mostrar notificación de registro pendiente
function showRegistrationNotification() {
    const notification = document.createElement('div');
    notification.className = 'cyber-notification fixed top-4 right-4 z-50';
    notification.innerHTML = `
        <div class="cyber-card p-4 bg-green-900/30 border-green-500/50">
            <div class="flex items-center">
                <i class="fas fa-mobile-alt text-green-400 mr-3"></i>
                <div>
                    <p class="font-bold text-green-300">REGISTRO PENDIENTE</p>
                    <p class="text-sm text-green-300/70">Acepta el Pacto para completar tu registro</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Función para generar hash MD5 (simplificada para demo)
function md5(input) {
    // En producción, usar una librería como crypto-js
    // Esta es una implementación muy básica para demo
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convertir a 32-bit integer
    }
    return Math.abs(hash).toString(16);
}

// Función para verificar clave maestra encriptada
function verifyMasterKey(inputKey) {
    // Encriptar la entrada con ella misma como llave
    const encryptedInput = simpleEncrypt(inputKey, inputKey);
    const inputHash = md5(encryptedInput);
    
    console.log("Verificación de clave:");
    console.log("Input:", inputKey);
    console.log("Encrypted:", encryptedInput);
    console.log("Hash calculado:", inputHash);
    console.log("Hash esperado:", config.MASTER_KEY_HASH);
    
    return inputHash === config.MASTER_KEY_HASH;
}

// Función de encriptación simple (para demo)
function simpleEncrypt(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode);
    }
    return result;
}

// Modificar la función handleAccess para incluir registro pendiente
async function handleAccess() {
    const tokenInput = document.getElementById('accessCode');
    const code = tokenInput.value.trim();
    const status = document.getElementById('statusMsg');
    const isAccepted = document.getElementById('acceptPact')?.checked || appState.pactAccepted;
    const urlParams = new URLSearchParams(window.location.search);
    const lang = appState.currentLang;

    // Verificar si es clave maestra
    if (verifyMasterKey(code)) {
        appState.isAdmin = true;
        
        // Mostrar panel de admin
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

    // Verificar pacto para registro normal
    if (!isAccepted) {
        status.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i>
                           <span data-i18n="status.pactError">ERROR: Debes aceptar el Pacto de Honor para proceder.</span>`;
        applyLanguage(lang);
        status.style.color = "#ef4444";
        
        // Resaltar el pacto
        highlightPactSection();
        return;
    }

    // Procesar registro pendiente si existe
    if (appState.registrationData && code.length >= 8) {
        await processPendingRegistration(code, status);
    } else if (code.length >= 8) {
        // Procesar token normal (sin datos de registro pendientes)
        await processNormalToken(code, status, urlParams);
    } else {
        status.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>
                           <span data-i18n="status.invalidToken">ERROR: El token no es válido o está mal formateado.</span>`;
        status.style.color = "#ef4444";
        applyLanguage(lang);
    }
}

// Procesar registro pendiente
async function processPendingRegistration(code, status) {
    status.innerHTML = `<i class="fas fa-sync-alt animate-spin mr-2"></i>
                       <span data-i18n="status.processingRegistration">PROCESANDO REGISTRO DESDE LA APP...</span>`;
    status.style.color = "#00FF41";
    applyLanguage(appState.currentLang);

    try {
        const _supabase = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
        
        // Verificar que el token coincide con el de la app
        if (code !== appState.registrationData.token) {
            status.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>
                               ERROR: El token no coincide con el dispositivo registrado.`;
            status.style.color = "#ef4444";
            return;
        }
        
        const { data, error } = await _supabase
            .from('device_registrations')
            .upsert({ 
                device_hash: code.replace("DEEP-", "").trim().toLowerCase(),
                nick: appState.registrationData.nick,
                email: appState.registrationData.email || '',
                is_premium: (appState.registrationData.plan === 'premium'),
                plan_type: appState.registrationData.plan,
                pacto_aceptado: true,
                created_at: new Date().toISOString(),
                last_access: new Date().toISOString(),
                registration_source: 'mobile_app'
            });

        if (error) {
            console.error("Supabase Error:", error);
            status.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>
                               ERROR DE RED: ${error.message}`;
            status.style.color = "#ef4444";
        } else {
            console.log("Registro exitoso:", data);
            status.innerHTML = `<i class="fas fa-check-circle mr-2"></i>
                               <span data-i18n="status.registrationComplete">REGISTRO COMPLETADO EXITOSAMENTE. Ya puedes usar la app.</span>`;
            status.style.color = "#00FF41";
            applyLanguage(appState.currentLang);
            
            // Limpiar datos de registro pendiente
            appState.registrationData = null;
            
            // Limpiar parámetros de la URL sin recargar
            history.replaceState({}, document.title, window.location.pathname);
            
            // Mostrar sección del contrato con éxito
            setTimeout(() => {
                showSection('contract');
                
                // Mostrar mensaje de éxito
                const contractSection = document.getElementById('contract');
                const successMessage = document.createElement('div');
                successMessage.className = 'cyber-status p-4 mb-4 bg-green-900/20';
                successMessage.innerHTML = `
                    <div class="flex items-center">
                        <i class="fas fa-check-circle text-green-400 mr-3"></i>
                        <div>
                            <span class="font-bold">REGISTRO COMPLETADO</span>
                            <p class="text-sm mt-1">Tu cuenta ha sido activada. Ya puedes usar la aplicación.</p>
                        </div>
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
}

// Procesar token normal (para registros directos desde web)
async function processNormalToken(code, status, urlParams) {
    status.innerHTML = `<i class="fas fa-sync-alt animate-spin mr-2"></i>
                       <span data-i18n="status.syncing">SINCRONIZANDO CON LA RED DEEP...</span>`;
    status.style.color = "#00FF41";
    applyLanguage(appState.currentLang);

    try {
        const _supabase = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
        
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
            applyLanguage(appState.currentLang);
            
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
                        <div>
                            <span>PACTO YA ACEPTADO Y CUENTA VINCULADA</span>
                            <p class="text-sm mt-1">Token: ${code}</p>
                        </div>
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
}

// Modificar la función initializeApp para ocultar admin por defecto
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
    
    // OCULTAR SECCIÓN ADMIN POR DEFECTO
    const adminNav = document.getElementById('adminNav');
    if (adminNav) {
        adminNav.style.display = 'none';
    }
    
    // Ocultar sección admin si está activa
    const adminSection = document.getElementById('admin');
    if (adminSection && adminSection.classList.contains('active')) {
        showSection('landing');
    }
}

// Añadir estilo CSS para la notificación
const style = document.createElement('style');
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
    }
    
    .highlight-pact-blink {
        animation: blink 0.3s step-end;
    }
    
    @keyframes blink {
        50% { border-color: transparent; }
    }
`;
document.head.appendChild(style);
