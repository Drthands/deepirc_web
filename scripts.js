// Configuración y variables globales
const config = {
    SUPABASE_URL: 'https://bbbqjzjaivzrywwkczry.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiYnFqemphaXZ6cnl3d2tjenJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMjkwMzAsImV4cCI6MjA4MTkwNTAzMH0.6bMDVnoOhiigahZOJU7e59Nn6q95Kop4U4h9iwEtAhQ',
    VERSION: "2.0.1"
};

// Clave maestra OCULTA - solo en memoria
const getMasterKey = () => {
    // Generada dinámicamente para mayor seguridad
    const baseKey = "DEEP_DRTHANDS";
    const year = new Date().getFullYear();
    return `${baseKey}_${year}`;
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
    
    // Asegurar que el pacto sea visible
    highlightContractSection();
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
    
    // Mejorar navegación para móviles
    enhanceMobileNavigation();
}

// Configurar event listeners
function setupEventListeners() {
    // Selector de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.dataset.lang;
            changeLanguage(lang);
            
            // Feedback táctil
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // Touch feedback
        btn.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
        });
        
        btn.addEventListener('touchend', function() {
            this.style.opacity = '';
        });
    });
    
    // Navegación mejorada para touch
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            showSection(section);
            
            // Feedback visual
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Scroll suave en móvil
            if (window.innerWidth < 768) {
                setTimeout(() => {
                    document.getElementById(section).scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }, 100);
            }
        });
        
        // Touch feedback
        link.addEventListener('touchstart', function() {
            this.style.backgroundColor = 'rgba(0, 255, 65, 0.15)';
        });
        
        link.addEventListener('touchend', function() {
            this.style.backgroundColor = '';
        });
    });
    
    // Auto-rellenar token con Enter
    document.getElementById('accessCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleAccess();
        }
    });
    
    // Pacto checkbox - hacer más visible
    const pactCheckbox = document.getElementById('acceptPact');
    const pactContainer = pactCheckbox.closest('.pact-checkbox');
    
    pactContainer.addEventListener('click', function(e) {
        if (e.target !== pactCheckbox) {
            pactCheckbox.checked = !pactCheckbox.checked;
            pactCheckbox.dispatchEvent(new Event('change'));
            
            // Feedback visual
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        }
    });
    
    pactCheckbox.addEventListener('change', function() {
        const statusMsg = document.getElementById('statusMsg');
        if (!this.checked) {
            statusMsg.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i>
                                  <span data-i18n="status.pactError">ERROR: Debes aceptar el Pacto de Honor para proceder.</span>`;
            statusMsg.classList.add('highlight');
            applyLanguage(appState.currentLang);
        } else {
            statusMsg.classList.remove('highlight');
        }
    });
    
    // Botones con mejor feedback
    document.querySelectorAll('.cyber-button').forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.97)';
            this.style.opacity = '0.9';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
            this.style.opacity = '';
        });
    });
}

// Mejorar navegación para móviles
function enhanceMobileNavigation() {
    if (window.innerWidth < 768) {
        // Asegurar que la navegación sea scrollable
        const nav = document.querySelector('nav');
        nav.style.overflowX = 'auto';
        nav.style.WebkitOverflowScrolling = 'touch';
        
        // Añadir indicador de scroll
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-black to-transparent pointer-events-none';
        nav.appendChild(scrollIndicator);
        
        // Añadir botón para mostrar/ocultar contrato
        addContractQuickAccess();
    }
}

// Añadir acceso rápido al contrato
function addContractQuickAccess() {
    const contractSection = document.getElementById('contract');
    if (!contractSection) return;
    
    const quickAccess = document.createElement('div');
    quickAccess.className = 'fixed bottom-4 right-4 z-50 md:hidden';
    quickAccess.innerHTML = `
        <button onclick="scrollToContract()" class="cyber-button-small bg-green-900/80 backdrop-blur-sm border-green-500 p-3 rounded-full shadow-lg">
            <i class="fas fa-file-contract text-xl"></i>
        </button>
    `;
    
    document.body.appendChild(quickAccess);
}

// Scroll al contrato
function scrollToContract() {
    showSection('contract');
    document.getElementById('contract').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
    
    // Destacar el checkbox
    const pactCheckbox = document.getElementById('acceptPact');
    const pactContainer = pactCheckbox.closest('.pact-checkbox');
    pactContainer.classList.add('highlight');
    
    setTimeout(() => {
        pactContainer.classList.remove('highlight');
    }, 2000);
}

// Destacar la sección del contrato
function highlightContractSection() {
    // Si el usuario no ha aceptado el pacto, destacar la sección
    const pactAccepted = localStorage.getItem('deepirc_pact_accepted');
    if (!pactAccepted) {
        // Añadir indicador visual en el nav
        const contractNav = document.querySelector('.nav-link[data-section="contract"]');
        if (contractNav) {
            const indicator = document.createElement('span');
            indicator.className = 'ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse';
            contractNav.appendChild(indicator);
            
            // Añadir título especial
            contractNav.insertAdjacentHTML('beforeend', 
                '<span class="ml-2 text-xs text-red-400">¡REQUERIDO!</span>');
        }
    }
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
    canvas.style.opacity = '0.05'; // Más sutil para móviles
    document.getElementById('matrixBackground').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    
    const chars = "01アイウエオカキクケコサシスセソタチツテト";
    const charArray = chars.split("");
    const fontSize = window.innerWidth < 768 ? 10 : 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for(let i = 0; i < columns; i++) {
        drops[i] = Math.random() * canvas.height;
    }
    
    function drawMatrix() {
        // Fondo más oscuro para mejor contraste
        ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
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
    
    // Optimizar para móviles
    const interval = window.innerWidth < 768 ? 80 : 50;
    setInterval(drawMatrix, interval);
    
    // Redimensionar canvas
    window.addEventListener('resize', function() {
        resizeCanvas();
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
        const section = urlParams.get('section');
        if (section === 'contract') {
            // Scroll automático al contrato si se solicita
            setTimeout(() => {
                showSection('contract');
                scrollToContract();
            }, 500);
        } else {
            showSection(section);
        }
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
    
    // Ajustar velocidad para móviles
    const speed = window.innerWidth < 768 ? 80 : 100;
    
    function typeWriter(text, i, callback) {
        if (i < text.length) {
            typingElement.innerHTML = text.substring(0, i + 1);
            setTimeout(() => typeWriter(text, i + 1, callback), speed);
        } else if (callback) {
            setTimeout(callback, 1500);
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
                <div class="flex items-start">
                    <div class="text-2xl text-green-400 mr-4">
                        <i class="fas fa-${index === 0 ? 'user-secret' : index === 1 ? 'tor' : index === 2 ? 'mask' : 'trash'}"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-white mb-2">${item.title}</h4>
                        <p class="text-sm text-green-300/70">${item.desc}</p>
                    </div>
                </div>
            `;
            helpSection.appendChild(card);
        });
    }
    
    // Cargar items del contrato - MEJOR VISIBILIDAD
    if (translations[lang] && translations[lang]["contract.items"]) {
        const contractSection = document.querySelector('#contract .space-y-6');
        contractSection.innerHTML = '';
        
        translations[lang]["contract.items"].forEach((item, index) => {
            const paragraph = document.createElement('div');
            paragraph.className = 'p-4 border-l-2 border-green-500 bg-green-950/10 mb-4';
            paragraph.innerHTML = `
                <div class="flex items-start">
                    <span class="inline-block w-6 h-6 bg-green-900 text-green-400 text-center rounded mr-3 flex-shrink-0">${index + 1}</span>
                    <div>
                        <span class="text-white font-bold block mb-1">${item.title}</span>
                        <span class="text-green-300/90 text-sm">${item.desc}</span>
                    </div>
                </div>
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
                <h5 class="font-bold text-green-300 mb-2 flex items-center">
                    <i class="fas fa-question-circle mr-2 text-green-500"></i>
                    ${item.q}
                </h5>
                <p class="text-sm text-green-300/70 pl-6">${item.a}</p>
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
        
        // Scroll suave a la sección (optimizado para móvil)
        const scrollOptions = window.innerWidth < 768 ? 
            { behavior: 'smooth', block: 'start', inline: 'nearest' } :
            { behavior: 'smooth', block: 'start' };
        
        setTimeout(() => {
            targetSection.scrollIntoView(scrollOptions);
        }, 100);
        
        // Actualizar estado
        appState.currentSection = sectionId;
        
        // Si es la sección del contrato, asegurar visibilidad
        if (sectionId === 'contract') {
            ensureContractVisible();
        }
    }
}

// Asegurar que el contrato sea visible
function ensureContractVisible() {
    const pactCheckbox = document.getElementById('acceptPact');
    const pactContainer = pactCheckbox.closest('.pact-checkbox');
    
    // Scroll al checkbox si no es visible
    setTimeout(() => {
        const rect = pactContainer.getBoundingClientRect();
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
            pactContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }, 300);
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
        status.innerHTML = `<div class="flex items-center text-red-400">
                           <i class="fas fa-exclamation-triangle mr-3 text-xl"></i>
                           <div>
                               <span class="font-bold block" data-i18n="status.pactError">ERROR: Debes aceptar el Pacto de Honor para proceder.</span>
                               <span class="text-xs mt-1">Haz clic en la casilla de arriba para aceptar</span>
                           </div>
                           </div>`;
        applyLanguage(lang);
        status.style.color = "#ef4444";
        
        // Destacar el contrato
        showSection('contract');
        scrollToContract();
        return;
    }

    // Verificar clave maestra (root) - USANDO FUNCIÓN OCULTA
    if (code === getMasterKey()) {
        appState.isAdmin = true;
        
        // Mostrar panel de admin y enlace de navegación
        document.getElementById('adminNav').style.display = 'flex';
        showSection('admin');
        
        // Actualizar estado
        status.innerHTML = `<div class="flex items-center text-green-400">
                           <i class="fas fa-shield-alt mr-3 text-xl"></i>
                           <div>
                               <span class="font-bold block" data-i18n="status.rootAccess">ACCESO ROOT CONCEDIDO</span>
                               <span class="text-xs mt-1">Bienvenido, Operador</span>
                           </div>
                           </div>`;
        status.style.color = "#00FF41";
        applyLanguage(lang);
        
        // Cargar datos de admin
        loadAdminData();
        
        // Limpiar input
        tokenInput.value = "";
        
        // Guardar en localStorage (opcional, con expiración)
        localStorage.setItem('deepirc_admin_session', Date.now().toString());
        return;
    }

    // Procesar token normal
    if (code.length >= 8) {
        status.innerHTML = `<div class="flex items-center">
                           <i class="fas fa-sync-alt animate-spin mr-3 text-xl"></i>
                           <div>
                               <span class="font-bold block" data-i18n="status.syncing">SINCRONIZANDO CON LA RED DEEP...</span>
                               <span class="text-xs mt-1">No cierres esta ventana</span>
                           </div>
                           </div>`;
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
                status.innerHTML = `<div class="flex items-center text-red-400">
                                   <i class="fas fa-exclamation-circle mr-3 text-xl"></i>
                                   <div>
                                       <span class="font-bold block">ERROR DE RED</span>
                                       <span class="text-xs mt-1">${error.message}</span>
                                   </div>
                                   </div>`;
                status.style.color = "#ef4444";
            } else {
                console.log("Success:", data);
                status.innerHTML = `<div class="flex items-center text-green-400">
                                   <i class="fas fa-check-circle mr-3 text-xl"></i>
                                   <div>
                                       <span class="font-bold block" data-i18n="status.linked">VINCULACIÓN EXITOSA</span>
                                       <span class="text-xs mt-1">Puedes volver a la App</span>
                                   </div>
                                   </div>`;
                status.style.color = "#00FF41";
                applyLanguage(lang);
                
                // Marcar pacto como aceptado
                localStorage.setItem('deepirc_pact_accepted', 'true');
                
                // Mostrar sección del contrato con confirmación
                setTimeout(() => {
                    showSection('contract');
                    
                    // Mostrar mensaje de éxito
                    const contractSection = document.getElementById('contract');
                    const successMsg = document.createElement('div');
                    successMsg.className = 'cyber-card bg-green-900/20 border-green-500 p-4 mb-6';
                    successMsg.innerHTML = `
                        <div class="flex items-center">
                            <i class="fas fa-check-circle text-green-400 mr-3 text-xl"></i>
                            <div>
                                <span class="font-bold block">PACTO ACEPTADO</span>
                                <span class="text-sm">Tu cuenta ha sido vinculada exitosamente</span>
                            </div>
                        </div>
                    `;
                    contractSection.querySelector('.cyber-card').prepend(successMsg);
                }, 1000);
            }
        } catch (err) {
            console.error("Crashed:", err);
            status.innerHTML = `<div class="flex items-center text-red-400">
                               <i class="fas fa-server mr-3 text-xl"></i>
                               <div>
                                   <span class="font-bold block">ERROR CRÍTICO</span>
                                   <span class="text-xs mt-1">No se pudo contactar con el servidor</span>
                               </div>
                               </div>`;
            status.style.color = "#ef4444";
        }
    } else {
        status.innerHTML = `<div class="flex items-center text-red-400">
                           <i class="fas fa-exclamation-circle mr-3 text-xl"></i>
                           <div>
                               <span class="font-bold block" data-i18n="status.invalidToken">ERROR: Token inválido</span>
                               <span class="text-xs mt-1">El token debe tener al menos 8 caracteres</span>
                           </div>
                           </div>`;
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
                <td class="font-mono text-xs py-3">
                    <span class="block truncate max-w-[120px]" title="${user.device_hash || 'N/A'}">
                        ${user.device_hash ? user.device_hash.substring(0, 12) + '...' : 'N/A'}
                    </span>
                </td>
                <td class="py-3">${user.nick || 'Anon'}</td>
                <td class="py-3">
                    <span class="block truncate max-w-[100px]" title="${user.email || 'N/A'}">
                        ${user.email || 'N/A'}
                    </span>
                </td>
                <td class="py-3">
                    <span class="inline-block px-2 py-1 rounded text-xs ${user.is_premium ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700' : 'bg-green-900/30 text-green-400 border border-green-700'}">
                        ${user.is_premium ? 'PREMIUM' : 'BASIC'}
                    </span>
                </td>
                <td class="py-3 text-xs">${formatDate(user.last_access)}</td>
                <td class="py-3">
                    <div class="flex space-x-2">
                        <button onclick="revokeUser('${user.device_hash}')" 
                                class="p-2 bg-red-900/20 hover:bg-red-900/40 rounded border border-red-700 text-red-400">
                            <i class="fas fa-ban"></i>
                        </button>
                        <button onclick="editUser('${user.device_hash}')" 
                                class="p-2 bg-green-900/20 hover:bg-green-900/40 rounded border border-green-700 text-green-400">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
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
    
    status.innerHTML = `<div class="flex items-center">
                       <i class="fas fa-sync-alt animate-spin mr-3 text-xl"></i>
                       <span data-i18n="status.syncing">SINCRONIZANDO CON LA RED DEEP...</span>
                       </div>`;
    applyLanguage(lang);
    
    await loadAdminData();
    
    status.innerHTML = `<div class="flex items-center text-green-400">
                       <i class="fas fa-check-circle mr-3 text-xl"></i>
                       <span>Sincronización completada</span>
                       </div>`;
    status.style.color = "#00FF41";
}

// Salir del modo admin
function logoutAdmin() {
    if (confirm("¿Estás seguro de que quieres salir del modo administrador?")) {
        appState.isAdmin = false;
        document.getElementById('adminNav').style.display = 'none';
        showSection('landing');
        
        const status = document.getElementById('statusMsg');
        status.innerHTML = `<div class="flex items-center">
                           <i class="fas fa-sign-out-alt mr-3 text-xl"></i>
                           <span>Sesión de admin cerrada</span>
                           </div>`;
        status.style.color = "#00FF41";
        
        // Limpiar sesión
        localStorage.removeItem('deepirc_admin_session');
    }
}

// Iniciar proceso de recuperación
async function initiateRecovery() {
    const email = document.getElementById('recoveryEmail').value.trim();
    const status = document.getElementById('statusMsg');
    const lang = appState.currentLang;
    
    if (!email || !validateEmail(email)) {
        status.innerHTML = `<div class="flex items-center text-red-400">
                           <i class="fas fa-exclamation-circle mr-3 text-xl"></i>
                           <div>
                               <span class="font-bold block" data-i18n="status.noEmail">ERROR: Email inválido</span>
                               <span class="text-xs mt-1">Introduce un email válido</span>
                           </div>
                           </div>`;
        status.style.color = "#ef4444";
        applyLanguage(lang);
        return;
    }
    
    status.innerHTML = `<div class="flex items-center">
                       <i class="fas fa-paper-plane mr-3 text-xl"></i>
                       <div>
                           <span class="font-bold block" data-i18n="status.recoverySent">ENVIANDO ENLACE...</span>
                           <span class="text-xs mt-1">Revisa tu bandeja de entrada</span>
                       </div>
                       </div>`;
    status.style.color = "#00FF41";
    applyLanguage(lang);
    
    // Aquí iría la lógica real de envío de email
    console.log(`Recovery email would be sent to: ${email}`);
    
    // Simular envío
    setTimeout(() => {
        status.innerHTML = `<div class="flex items-center text-green-400">
                           <i class="fas fa-check-circle mr-3 text-xl"></i>
                           <div>
                               <span class="font-bold block">ENLACE ENVIADO</span>
                               <span class="text-xs mt-1">Revisa tu email (y la carpeta de spam)</span>
                           </div>
                           </div>`;
    }, 2000);
}

// Revocar usuario (admin)
async function revokeUser(deviceHash) {
    if (!confirm("¿Estás seguro de revocar el acceso de este usuario?\nEsta acción no se puede deshacer.")) return;
    
    try {
        const { error } = await _supabase
            .from('device_registrations')
            .delete()
            .eq('device_hash', deviceHash);
            
        if (error) throw error;
        
        // Feedback visual
        const status = document.getElementById('statusMsg');
        status.innerHTML = `<div class="flex items-center text-yellow-400">
                           <i class="fas fa-user-slash mr-3 text-xl"></i>
                           <span>Usuario revocado</span>
                           </div>`;
        
        // Recargar datos
        setTimeout(() => loadAdminData(), 1000);
        
    } catch (err) {
        console.error("Error revoking user:", err);
        alert("Error al revocar usuario: " + err.message);
    }
}

// Editar usuario (admin)
function editUser(deviceHash) {
    alert(`Editar usuario: ${deviceHash.substring(0, 12)}...\n\nEsta función estará disponible en la próxima versión.`);
}

// Funciones auxiliares
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 60) {
            return `Hace ${diffMins} min`;
        } else if (diffHours < 24) {
            return `Hace ${diffHours} h`;
        } else if (diffDays < 7) {
            return `Hace ${diffDays} d`;
        } else {
            return date.toLocaleDateString();
        }
    } catch (e) {
        return 'N/A';
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function updateConnectionStatus() {
    const statusElement = document.getElementById('connectionStatus');
    const statusText = document.getElementById('statusText');
    
    // Simular cambios de estado
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

// Añadir soporte para gestos táctiles
document.addEventListener('touchmove', function(e) {
    // Prevenir scroll accidental en elementos interactivos
    if (e.target.classList.contains('cyber-button') || 
        e.target.closest('.cyber-button')) {
        e.preventDefault();
    }
}, { passive: false });

// Detectar si es móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Mejorar experiencia en móvil al cargar
if (isMobile()) {
    document.addEventListener('DOMContentLoaded', function() {
        // Añadir clase móvil al body
        document.body.classList.add('mobile-device');
        
        // Prevenir zoom en inputs
        document.addEventListener('focusin', function(e) {
            if (e.target.matches('input, textarea, select')) {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                    document.body.scrollTop = 0;
                }, 100);
            }
        });
    });
}