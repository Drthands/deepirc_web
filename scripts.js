// Configuración y variables globales
const config = {
    SUPABASE_URL: 'https://bbbqjzjaivzrywwkczry.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiYnFqemphaXZ6cnl3d2tjenJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMjkwMzAsImV4cCI6MjA4MTkwNTAzMH0.6bMDVnoOhiigahZOJU7e59Nn6q95Kop4U4h9iwEtAhQ',
    MASTER_KEY: "DEEP_DRTHANDS_2025", // Mantenida por compatibilidad
    VERSION: "2.0.1"
};

// Inicialización de Supabase
const _supabase = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

// Estado de la aplicación
const appState = {
    currentLang: 'es',
    currentSection: 'landing',
    isAdmin: false,
    userData: null
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
        });
    });
    
    // Auto-rellenar token con Enter
    document.getElementById('accessCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleAccess();
        }
    });
    
    // Pacto checkbox
    document.getElementById('acceptPact').addEventListener('change', function() {
        const statusMsg = document.getElementById('statusMsg');
        if (!this.checked) {
            statusMsg.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i>
                                  <span data-i18n="status.pactError">ERROR: Debes aceptar el Pacto de Honor para proceder.</span>`;
            applyLanguage(appState.currentLang); // Reaplicar traducción
        }
    });
}

// Crear efecto Matrix en el fondo
function createMatrixEffect() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrixCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';
    document.getElementById('matrixBackground').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = "01アイウエオカキクケコサシスセソタチツテト";
    const charArray = chars.split("");
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for(let i = 0; i < columns; i++) {
        drops[i] = 1;
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
    
    setInterval(drawMatrix, 50);
    
    // Redimensionar canvas
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Cambiar idioma
function changeLanguage(lang) {
    if (!translations[lang]) return;
    
    appState.currentLang = lang;
    localStorage.setItem('deepirc_lang', lang);
    
    // Actualizar botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Aplicar traducciones
    applyLanguage(lang);
    
    // Actualizar contenido dinámico
    loadDynamicContent();
}

// Aplicar traducciones a todos los elementos con data-i18n
function applyLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Actualizar atributo lang del HTML
    document.documentElement.lang = lang;
}

// Cargar parámetros de la URL
function loadUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('id')) {
        document.getElementById('accessCode').value = urlParams.get('id');
        const statusMsg = document.getElementById('statusMsg');
        statusMsg.innerHTML = `<i class="fas fa-microchip mr-2"></i>
                              DISPOSITIVO DETECTADO: ${urlParams.get('nick') || 'Unknown'}`;
    }
    
    if (urlParams.has('section')) {
        showSection(urlParams.get('section'));
    }
}

// Configurar animación de escritura
function setupTypingAnimation() {
    const texts = [
        "PRIVACIDAD POR DISEÑO.",
        "CERO RASTROS DIGITALES.",
        "COMUNICACIÓN SEGURA.",
        "ANONIMATO GARANTIZADO."
    ];
    
    let currentTextIndex = 0;
    const typingElement = document.getElementById('typingText');
    
    function typeWriter(text, i, callback) {
        if (i < text.length) {
            typingElement.innerHTML = text.substring(0, i + 1);
            setTimeout(() => typeWriter(text, i + 1, callback), 100);
        } else if (callback) {
            setTimeout(callback, 2000);
        }
    }
    
    function startTypingAnimation() {
        typeWriter(texts[currentTextIndex], 0, function() {
            currentTextIndex = (currentTextIndex + 1) % texts.length;
            setTimeout(startTypingAnimation, 500);
        });
    }
    
    startTypingAnimation();
}

// Cargar contenido dinámico
function loadDynamicContent() {
    const lang = appState.currentLang;
    
    // Cargar items del manual de operaciones
    if (translations[lang] && translations[lang]["help.items"]) {
        const helpSection = document.querySelector('#help .grid');
        helpSection.innerHTML = '';
        
        translations[lang]["help.items"].forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'cyber-card p-6';
            card.innerHTML = `
                <h4 class="font-bold text-white mb-2">${item.title}</h4>
                <p class="text-sm text-green-300/70">${item.desc}</p>
            `;
            helpSection.appendChild(card);
        });
    }
    
    // Cargar items del contrato
    if (translations[lang] && translations[lang]["contract.items"]) {
        const contractSection = document.querySelector('#contract .space-y-6');
        contractSection.innerHTML = '';
        
        translations[lang]["contract.items"].forEach(item => {
            const paragraph = document.createElement('p');
            paragraph.className = 'leading-relaxed';
            paragraph.innerHTML = `
                <span class="text-white font-bold">${item.title}</span>
                <span class="text-green-300/90"> ${item.desc}</span>
            `;
            contractSection.appendChild(paragraph);
        });
    }
    
    // Cargar FAQ de recuperación
    if (translations[lang] && translations[lang]["recovery.faqItems"]) {
        const faqSection = document.querySelector('#recovery .space-y-4');
        faqSection.innerHTML = '';
        
        translations[lang]["recovery.faqItems"].forEach((item, index) => {
            const faqItem = document.createElement('div');
            faqItem.className = 'cyber-card p-4';
            faqItem.innerHTML = `
                <h5 class="font-bold text-green-300 mb-2">Q: ${item.q}</h5>
                <p class="text-sm text-green-300/70">A: ${item.a}</p>
            `;
            faqSection.appendChild(faqItem);
        });
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
        
        // Actualizar URL sin recargar
        history.pushState(null, '', `#${sectionId}`);
        
        // Scroll suave a la sección
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Actualizar estado
        appState.currentSection = sectionId;
    }
}

// Función principal de acceso
async function handleAccess() {
    const tokenInput = document.getElementById('accessCode');
    const code = tokenInput.value.trim();
    const status = document.getElementById('statusMsg');
    const isAccepted = document.getElementById('acceptPact').checked;
    const urlParams = new URLSearchParams(window.location.search);
    const lang = appState.currentLang;

    // Verificar pacto
    if (!isAccepted) {
        status.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i>
                           <span data-i18n="status.pactError">ERROR: Debes aceptar el Pacto de Honor para proceder.</span>`;
        applyLanguage(lang);
        status.style.color = "#ef4444";
        return;
    }

    // Verificar clave maestra (root)
    if (code === config.MASTER_KEY) {
        appState.isAdmin = true;
        
        // Mostrar panel de admin y enlace de navegación
        document.getElementById('adminNav').style.display = 'block';
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
                
                // Mostrar sección del contrato
                setTimeout(() => showSection('contract'), 1000);
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

// Cargar datos para el panel de admin
async function loadAdminData() {
    try {
        const { data, error } = await _supabase
            .from('device_registrations')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const tbody = document.getElementById('userTable');
        tbody.innerHTML = '';

        let total = 0;
        let active = 0;
        let premium = 0;

        data.forEach(user => {
            total++;
            
            // Contar activos (últimas 24h)
            const lastAccess = new Date(user.last_access);
            const now = new Date();
            const hoursDiff = (now - lastAccess) / (1000 * 60 * 60);
            if (hoursDiff <= 24) active++;
            
            // Contar premium
            if (user.is_premium) premium++;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="font-mono text-xs">${user.device_hash || 'N/A'}</td>
                <td>${user.nick || 'Anon'}</td>
                <td>${user.email || 'N/A'}</td>
                <td>
                    <span class="${user.is_premium ? 'text-yellow-400' : 'text-green-400'}">
                        ${user.is_premium ? 'PREMIUM' : 'BASIC'}
                    </span>
                </td>
                <td>${formatDate(user.last_access)}</td>
                <td>
                    <button onclick="revokeUser('${user.device_hash}')" class="text-red-400 hover:text-red-300 mr-2">
                        <i class="fas fa-ban"></i>
                    </button>
                    <button onclick="editUser('${user.device_hash}')" class="text-green-400 hover:text-green-300">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Actualizar estadísticas
        document.getElementById('totalUsers').textContent = total;
        document.getElementById('activeUsers').textContent = active;
        document.getElementById('premiumUsers').textContent = premium;

    } catch (err) {
        console.error("Error loading admin data:", err);
    }
}

// Sincronizar datos de admin
async function syncUsers() {
    const status = document.getElementById('statusMsg');
    const lang = appState.currentLang;
    
    status.innerHTML = `<i class="fas fa-sync-alt animate-spin mr-2"></i>
                       <span data-i18n="status.syncing">SINCRONIZANDO CON LA RED DEEP...</span>`;
    applyLanguage(lang);
    
    await loadAdminData();
    
    status.innerHTML = `<i class="fas fa-check-circle mr-2"></i>
                       Sincronización completada.`;
    status.style.color = "#00FF41";
}

// Salir del modo admin
function logoutAdmin() {
    appState.isAdmin = false;
    document.getElementById('adminNav').style.display = 'none';
    showSection('landing');
    
    const status = document.getElementById('statusMsg');
    status.innerHTML = `<i class="fas fa-sign-out-alt mr-2"></i>
                       Sesión de admin cerrada.`;
    status.style.color = "#00FF41";
}

// Iniciar proceso de recuperación
async function initiateRecovery() {
    const email = document.getElementById('recoveryEmail').value.trim();
    const status = document.getElementById('statusMsg');
    const lang = appState.currentLang;
    
    if (!email || !validateEmail(email)) {
        status.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>
                           <span data-i18n="status.noEmail">ERROR: Email no válido o no registrado.</span>`;
        status.style.color = "#ef4444";
        applyLanguage(lang);
        return;
    }
    
    status.innerHTML = `<i class="fas fa-paper-plane mr-2"></i>
                       <span data-i18n="status.recoverySent">ENLACE DE RECUPERACIÓN ENVIADO. Revisa tu email.</span>`;
    status.style.color = "#00FF41";
    applyLanguage(lang);
    
    // Aquí iría la lógica real de envío de email
    console.log(`Recovery email would be sent to: ${email}`);
}

// Revocar usuario (admin)
async function revokeUser(deviceHash) {
    if (!confirm("¿Estás seguro de revocar el acceso de este usuario?")) return;
    
    try {
        const { error } = await _supabase
            .from('device_registrations')
            .delete()
            .eq('device_hash', deviceHash);
            
        if (error) throw error;
        
        loadAdminData();
    } catch (err) {
        console.error("Error revoking user:", err);
    }
}

// Editar usuario (admin)
function editUser(deviceHash) {
    // Implementar lógica de edición
    alert(`Editar usuario: ${deviceHash}\n\nEsta función estará disponible en la próxima versión.`);
}

// Funciones auxiliares
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function updateConnectionStatus() {
    const statusElement = document.getElementById('connectionStatus');
    const statusText = document.getElementById('statusText');
    
    // Simular cambios de estado (en una app real, esto verificaría conexión real)
    const statuses = [
        { status: "CONEXIÓN_SEGURA_E2EE", text: "EN LÍNEA", color: "#00FF41" },
        { status: "CIFRANDO_CANAL", text: "PROCESANDO", color: "#FFFF00" },
        { status: "CONEXIÓN_TOR_ACTIVA", text: "ENCRIPTADO", color: "#00FF41" }
    ];
    
    let currentIndex = 0;
    
    setInterval(() => {
        const status = statuses[currentIndex];
        statusElement.textContent = status.status;
        statusText.textContent = status.text;
        statusText.style.color = status.color;
        
        currentIndex = (currentIndex + 1) % statuses.length;
    }, 5000);
}

// Inicializar cuando la ventana carga
window.onload = initializeApp;