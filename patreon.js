// patreon.js - Versión completa con efectos
console.log('patreon.js cargado - Versión mejorada');

// Función principal para cargar la sección de Patreon
function loadPatreonSection() {
    const patreonSection = document.getElementById('patreon');
    if (!patreonSection) return;
    
    // Limpiar contenido existente
    patreonSection.innerHTML = '';
    
    // Crear contenedor principal
    const container = document.createElement('div');
    container.className = 'patreon-container';
    container.id = 'patreonContainer';
    
    // Contenido HTML
    container.innerHTML = `
        <!-- Header con título y botón -->
        <div class="flex flex-col md:flex-row items-center justify-between mb-8 pb-4 border-b border-green-900/30">
            <div class="flex items-center mb-4 md:mb-0">
                <i class="fab fa-patreon text-purple-400 text-3xl mr-3 animate-pulse"></i>
                <h2 class="text-2xl md:text-3xl font-bold glitch" data-text="DEEP_IRC_PATREON">
                    DEEP_IRC_PATREON
                </h2>
            </div>
            <a href="https://www.patreon.com/deepirc" 
               target="_blank" 
               rel="noopener noreferrer"
               class="cyber-button bg-gradient-to-r from-purple-600 to-pink-600 border-purple-500 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all px-6 py-3">
                <i class="fab fa-patreon mr-2"></i>
                ACCEDER A PATREON
            </a>
        </div>
        
        <!-- Hero section -->
        <div class="relative mb-10 p-6 md:p-8 rounded-xl overflow-hidden bg-gradient-to-br from-black via-purple-900/10 to-green-900/10 border border-green-500/20" id="matrixHero">
            <!-- Fondo de efecto matrix -->
            <div class="absolute inset-0 matrix-particles"></div>
            
            <!-- Contenido principal -->
            <div class="relative z-10 text-center">
                <!-- Icono animado -->
                <div class="inline-block p-1 rounded-full bg-gradient-to-r from-green-500 via-purple-500 to-pink-500 animate-gradient mb-6">
                    <div class="bg-black rounded-full p-4">
                        <i class="fab fa-patreon text-4xl text-purple-400"></i>
                    </div>
                </div>
                
                <!-- Título con efecto de escritura -->
                <h2 class="text-3xl md:text-4xl font-bold mb-4 typing-text">
                    <span class="text-white bg-clip-text bg-gradient-to-r from-green-400 to-purple-400">
                        APOYA LA PRIVACIDAD
                    </span>
                </h2>
                
                <!-- Descripción -->
                <p class="text-green-300/80 max-w-2xl mx-auto mb-8 text-lg">
                    Tu apoyo literalmente hace posible que DeepIRC exista. Cada contribución ayuda a mantener los servidores, desarrollar nuevas características y garantizar tu privacidad.
                </p>
                
                <!-- Contadores -->
                <div class="inline-flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-10 p-6 bg-black/50 rounded-xl border-2 border-green-900/50 backdrop-blur-sm">
                    <div class="text-center">
                        <div class="text-4xl font-bold text-purple-400 digital-font" id="patronCount">0</div>
                        <div class="text-sm text-green-600 mt-2 font-mono">PATROCINADORES</div>
                    </div>
                    <div class="hidden md:block h-16 w-1 bg-gradient-to-b from-green-500 via-purple-500 to-pink-500"></div>
                    <div class="text-center">
                        <div class="text-4xl font-bold text-green-400 digital-font" id="monthlyAmount">$0</div>
                        <div class="text-sm text-green-600 mt-2 font-mono">MENSUAL</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Grid de niveles -->
        <div class="mb-12">
            <h3 class="text-xl font-bold mb-6 flex items-center text-green-300">
                <i class="fas fa-crown text-purple-400 mr-3"></i>
                BENEFICIOS EXCLUSIVOS
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Nivel Hacker -->
                <div class="cyber-card tier-card hacker-tier" data-tier="hacker">
                    <div class="tier-badge hacker-badge">HACKER</div>
                    
                    <div class="tier-content">
                        <div class="tier-icon mb-4">
                            <i class="fas fa-user-secret text-4xl text-green-400"></i>
                        </div>
                        <div class="tier-price mb-4">
                            <span class="text-3xl font-bold text-green-300">$3</span>
                            <span class="text-green-600">/mes</span>
                        </div>
                        
                        <ul class="tier-features space-y-3 mb-6">
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-400 mr-2 mt-1"></i>
                                <span>Badge "Hacker" en Discord</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-400 mr-2 mt-1"></i>
                                <span>Acceso a builds beta</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-400 mr-2 mt-1"></i>
                                <span>Mención en créditos</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-400 mr-2 mt-1"></i>
                                <span>Actualizaciones exclusivas</span>
                            </li>
                        </ul>
                        
                        <a href="https://www.patreon.com/join/deepirc/checkout?rid=3" 
                           target="_blank"
                           class="cyber-button tier-button hacker-button w-full text-center">
                            <i class="fab fa-patreon mr-2"></i>
                            UNIRME COMO HACKER
                        </a>
                    </div>
                </div>
                
                <!-- Nivel Operador -->
                <div class="cyber-card tier-card operator-tier popular" data-tier="operator">
                    <div class="popular-badge">
                        <i class="fas fa-bolt"></i> POPULAR
                    </div>
                    <div class="tier-badge operator-badge">OPERADOR</div>
                    
                    <div class="tier-content">
                        <div class="tier-icon mb-4">
                            <i class="fas fa-shield-alt text-4xl text-purple-400"></i>
                        </div>
                        <div class="tier-price mb-4">
                            <span class="text-3xl font-bold text-purple-300">$7</span>
                            <span class="text-purple-600">/mes</span>
                        </div>
                        
                        <ul class="tier-features space-y-3 mb-6">
                            <li class="flex items-start">
                                <i class="fas fa-check text-purple-400 mr-2 mt-1"></i>
                                <span><strong>Todos los beneficios Hacker</strong></span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-purple-400 mr-2 mt-1"></i>
                                <span>Badge "Operador" en la app</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-purple-400 mr-2 mt-1"></i>
                                <span>Acceso al canal VIP en IRC</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-purple-400 mr-2 mt-1"></i>
                                <span>Soporte prioritario</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-purple-400 mr-2 mt-1"></i>
                                <span>Voto en nuevas características</span>
                            </li>
                        </ul>
                        
                        <a href="https://www.patreon.com/join/deepirc/checkout?rid=7" 
                           target="_blank"
                           class="cyber-button tier-button operator-button w-full text-center">
                            <i class="fab fa-patreon mr-2"></i>
                            UNIRME COMO OPERADOR
                        </a>
                    </div>
                </div>
                
                <!-- Nivel Fundador -->
                <div class="cyber-card tier-card founder-tier" data-tier="founder">
                    <div class="tier-badge founder-badge">FUNDADOR</div>
                    
                    <div class="tier-content">
                        <div class="tier-icon mb-4">
                            <i class="fas fa-crown text-4xl text-yellow-400"></i>
                        </div>
                        <div class="tier-price mb-4">
                            <span class="text-3xl font-bold text-yellow-300">$15</span>
                            <span class="text-yellow-600">/mes</span>
                        </div>
                        
                        <ul class="tier-features space-y-3 mb-6">
                            <li class="flex items-start">
                                <i class="fas fa-check text-yellow-400 mr-2 mt-1"></i>
                                <span><strong>Todos los beneficios Operador</strong></span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-yellow-400 mr-2 mt-1"></i>
                                <span>Badge "Fundador" exclusivo</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-yellow-400 mr-2 mt-1"></i>
                                <span>Acceso a estadísticas internas</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-yellow-400 mr-2 mt-1"></i>
                                <span>Sesiones 1:1 con el desarrollador</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-yellow-400 mr-2 mt-1"></i>
                                <span>Tu nombre en créditos principales</span>
                            </li>
                        </ul>
                        
                        <a href="https://www.patreon.com/join/deepirc/checkout?rid=15" 
                           target="_blank"
                           class="cyber-button tier-button founder-button w-full text-center">
                            <i class="fab fa-patreon mr-2"></i>
                            UNIRME COMO FUNDADOR
                        </a>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Sección de distribución de fondos -->
        <div class="mb-10">
            <div class="cyber-card p-6 bg-black/30 border border-green-500/20 rounded-xl">
                <h4 class="text-xl font-bold mb-6 flex items-center text-green-300">
                    <i class="fas fa-chart-pie text-green-400 mr-3"></i>
                    ¿A DÓNDE VA TU APOYO?
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Gráfico simple -->
                    <div class="budget-chart-container">
                        <div class="relative h-64 w-64 mx-auto">
                            <canvas id="budgetChart" width="256" height="256"></canvas>
                        </div>
                    </div>
                    
                    <!-- Leyenda -->
                    <div class="budget-legend space-y-4">
                        <div class="legend-item flex items-center">
                            <div class="legend-color w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                            <div>
                                <div class="legend-title font-bold text-green-300">INFRAESTRUCTURA (40%)</div>
                                <div class="legend-desc text-sm text-green-400/70">Servidores seguros, VPN, proxies, SSL</div>
                            </div>
                        </div>
                        <div class="legend-item flex items-center">
                            <div class="legend-color w-4 h-4 rounded-full bg-purple-500 mr-3"></div>
                            <div>
                                <div class="legend-title font-bold text-purple-300">DESARROLLO (35%)</div>
                                <div class="legend-desc text-sm text-purple-400/70">Nuevas características, corrección de bugs</div>
                            </div>
                        </div>
                        <div class="legend-item flex items-center">
                            <div class="legend-color w-4 h-4 rounded-full bg-blue-500 mr-3"></div>
                            <div>
                                <div class="legend-title font-bold text-blue-300">RENDIMIENTO (15%)</div>
                                <div class="legend-desc text-sm text-blue-400/70">Optimización, CDN, infraestructura</div>
                            </div>
                        </div>
                        <div class="legend-item flex items-center">
                            <div class="legend-color w-4 h-4 rounded-full bg-yellow-500 mr-3"></div>
                            <div>
                                <div class="legend-title font-bold text-yellow-300">RECURSOS (10%)</div>
                                <div class="legend-desc text-sm text-yellow-400/70">Café, energía, gastos operativos</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Mensaje personal -->
        <div class="mb-10 p-6 bg-gradient-to-br from-green-950/20 to-purple-950/20 border border-green-500/30 rounded-xl crt-effect">
            <div class="flex flex-col md:flex-row items-center">
                <div class="md:mr-6 mb-4 md:mb-0">
                    <div class="relative">
                        <div class="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-purple-500 animate-spin-slow"></div>
                        <div class="relative bg-black rounded-full p-4">
                            <i class="fas fa-code text-3xl text-green-400"></i>
                        </div>
                    </div>
                </div>
                <div class="flex-1">
                    <h4 class="text-xl font-bold mb-3 text-green-300">UN MENSAJE PERSONAL</h4>
                    <p class="text-green-300/80 mb-3 leading-relaxed">
                        Hola, soy el desarrollador de DeepIRC. Cada contribución, por pequeña que sea, 
                        me ayuda a dedicar más tiempo a este proyecto, mantener los servidores funcionando 
                        y desarrollar nuevas características de seguridad que protegen tu privacidad.
                    </p>
                    <p class="text-green-400 flex items-center font-bold">
                        <i class="fas fa-heart text-red-400 mr-2 animate-pulse"></i>
                        ¡Gracias por considerar apoyar este proyecto!
                    </p>
                </div>
            </div>
        </div>
        
        <!-- CTA final -->
        <div class="text-center">
            <div class="neon-border p-1 rounded-xl inline-block mb-6">
                <a href="https://www.patreon.com/deepirc" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="cyber-button bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 border-0 text-lg px-8 py-4 hover:from-purple-800 hover:via-pink-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-300 animate-glow">
                    <i class="fab fa-patreon mr-3"></i>
                    VER PÁGINA COMPLETA DE PATREON
                </a>
            </div>
            <p class="text-sm text-green-600">
                <i class="fas fa-lock mr-2"></i>
                Todos los pagos son procesados de forma segura por Patreon
            </p>
        </div>
    `;
    
    patreonSection.appendChild(container);
    
    // Inicializar efectos
    setTimeout(initPatreonEffects, 100);
}

// Función para inicializar efectos de Patreon
function initPatreonEffects() {
    console.log('Inicializando efectos de Patreon...');
    
    // 1. Contadores animados
    animateCounter('patronCount', 142, '$');
    animateCounter('monthlyAmount', 427, '');
    
    // 2. Efectos en tarjetas de niveles
    const tierCards = document.querySelectorAll('.tier-card');
    tierCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('tier-hover');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('tier-hover');
        });
    });
    
    // 3. Crear gráfico de pastel
    createBudgetChart();
    
    // 4. Efecto de escritura en el título
    typeWriterEffect();
    
    // 5. Efecto de partículas en el hero
    createParticles();
}

// Función auxiliar para animar contadores
function animateCounter(elementId, target, prefix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let current = 0;
    const duration = 2000; // 2 segundos
    const increment = target / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = prefix + target;
            clearInterval(timer);
            
            // Efecto al finalizar
            element.classList.add('counter-complete');
        } else {
            element.textContent = prefix + Math.floor(current);
        }
    }, 16);
}

// Función para crear gráfico de pastel
function createBudgetChart() {
    const canvas = document.getElementById('budgetChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = [40, 35, 15, 10];
    const colors = ['#00ff41', '#a855f7', '#3b82f6', '#f59e0b'];
    const labels = ['Infraestructura', 'Desarrollo', 'Rendimiento', 'Recursos'];
    
    let startAngle = 0;
    
    // Dibujar gráfico
    data.forEach((value, index) => {
        const sliceAngle = (value / 100) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.fillStyle = colors[index];
        ctx.moveTo(128, 128);
        ctx.arc(128, 128, 100, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        
        startAngle += sliceAngle;
    });
    
    // Añadir borde
    ctx.beginPath();
    ctx.arc(128, 128, 100, 0, 2 * Math.PI);
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Función para efecto de escritura
function typeWriterEffect() {
    const typingElement = document.querySelector('.typing-text span');
    if (!typingElement) return;
    
    const text = typingElement.textContent;
    typingElement.textContent = '';
    
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 50);
}

// Función para crear partículas simples
function createParticles() {
    const hero = document.getElementById('matrixHero');
    if (!hero) return;
    
    // Limpiar partículas existentes
    const particlesContainer = hero.querySelector('.matrix-particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'matrix-particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 20px;
            background: linear-gradient(to bottom, transparent, #00ff41);
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.3 + 0.1};
            animation: matrix-fall ${Math.random() * 3 + 2}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Crear estilos CSS dinámicos para los efectos
function addPatreonStyles() {
    const styles = `
        /* Estilos para efectos de Patreon */
        .patreon-container {
            animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .typing-text {
            overflow: hidden;
            border-right: 2px solid #00ff41;
            white-space: nowrap;
            animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
        }
        
        @keyframes typing {
            from { width: 0 }
            to { width: 100% }
        }
        
        @keyframes blink-caret {
            from, to { border-color: transparent }
            50% { border-color: #00ff41 }
        }
        
        .digital-font {
            font-family: 'Courier New', monospace;
            text-shadow: 0 0 10px currentColor;
        }
        
        .counter-complete {
            animation: pulse 1s ease-in-out;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .tier-card {
            transition: all 0.3s ease;
        }
        
        .tier-hover {
            transform: translateY(-10px) scale(1.05);
            box-shadow: 0 10px 30px rgba(0, 255, 65, 0.3);
        }
        
        .popular-badge {
            position: absolute;
            top: -10px;
            right: 20px;
            background: linear-gradient(45deg, #ff00ff, #00ffff);
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: bold;
            animation: glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
            from { box-shadow: 0 0 5px #ff00ff; }
            to { box-shadow: 0 0 20px #00ffff; }
        }
        
        .neon-border {
            background: linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff);
            background-size: 200% 200%;
            animation: gradient-shift 3s ease infinite;
        }
        
        @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        
        .crt-effect {
            position: relative;
            overflow: hidden;
        }
        
        .crt-effect::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                        linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 2px, 3px 100%;
            pointer-events: none;
            z-index: 2;
        }
        
        @keyframes matrix-fall {
            0% {
                transform: translateY(-100px);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(100px);
                opacity: 0;
            }
        }
        
        .tier-badge {
            position: absolute;
            top: -12px;
            left: 20px;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .hacker-badge {
            background: linear-gradient(45deg, #00ff41, #00cc33);
            color: black;
        }
        
        .operator-badge {
            background: linear-gradient(45deg, #a855f7, #7c3aed);
            color: white;
        }
        
        .founder-badge {
            background: linear-gradient(45deg, #f59e0b, #d97706);
            color: black;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Añadir estilos cuando se cargue el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addPatreonStyles);
} else {
    addPatreonStyles();
}

// Exportar funciones globalmente
window.loadPatreonSection = loadPatreonSection;
window.initPatreonEffects = initPatreonEffects;
console.log('Funciones de Patreon exportadas globalmente');