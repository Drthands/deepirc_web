// Configuración y variables globales para recuperación
const recoveryConfig = {
    COUNTDOWN_TIME: 300, // 5 minutos en segundos
    TOKEN_LENGTH: 16,
    API_BASE_URL: 'https://bbbqjzjaivzrywwkczry.supabase.co/functions/v1',
    STORAGE_KEY: 'deepirc_recovery_state'
};

// Estado de la recuperación
const recoveryState = {
    currentStep: 1,
    countdownInterval: null,
    remainingTime: recoveryConfig.COUNTDOWN_TIME,
    recoveryData: null,
    currentLang: 'es'
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeRecovery();
    loadRecoveryState();
});

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