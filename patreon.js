// patreon.js - Gestión de la sección de Patreon

async function loadPatreonContent() {
    const section = document.getElementById('patreon');
    if (!section) return;
    
    section.innerHTML = `
        <div class="cyber-card p-6 md:p-8 border-purple-500/30">
            <div class="flex flex-col md:flex-row items-center justify-between mb-8">
                <div class="mb-6 md:mb-0">
                    <div class="flex items-center mb-4">
                        <i class="fab fa-patreon text-purple-400 text-3xl md:text-4xl mr-4"></i>
                        <h2 class="text-2xl md:text-3xl font-bold text-purple-300">
                            <span data-i18n="patreon.title">APOYA_DEEPIRC</span>
                        </h2>
                    </div>
                    <p class="text-purple-300/80 max-w-2xl" data-i18n="patreon.description">
                        Únete a nuestra comunidad de Patreon y ayuda a mantener y mejorar DeepIRC.
                        Tu apoyo nos permite seguir desarrollando características de seguridad y privacidad.
                    </p>
                </div>
                
                <a href="https://patreon.com/deepirc" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="cyber-button bg-purple-600 border-purple-500 hover:bg-purple-700 px-8 py-4 text-lg">
                    <i class="fab fa-patreon mr-3"></i>
                    <span data-i18n="patreon.join">UNIRSE A PATREON</span>
                </a>
            </div>
            
            <!-- Beneficios -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="cyber-card p-6 border-purple-500/20">
                    <div class="text-3xl text-purple-400 mb-4">
                        <i class="fas fa-crown"></i>
                    </div>
                    <h3 class="text-xl font-bold text-purple-300 mb-3" data-i18n="patreon.tier1.title">BRONCE</h3>
                    <p class="text-purple-300/70 mb-4" data-i18n="patreon.tier1.desc">$3/mes - Apoyo básico</p>
                    <ul class="space-y-2 text-sm">
                        <li class="flex items-center">
                            <i class="fas fa-check text-green-400 mr-2"></i>
                            <span data-i18n="patreon.tier1.benefit1">Nombre en los créditos</span>
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-check text-green-400 mr-2"></i>
                            <span data-i18n="patreon.tier1.benefit2">Acceso a actualizaciones</span>
                        </li>
                    </ul>
                </div>
                
                <div class="cyber-card p-6 border-purple-500/30 bg-purple-900/10">
                    <div class="text-3xl text-purple-400 mb-4">
                        <i class="fas fa-gem"></i>
                    </div>
                    <h3 class="text-xl font-bold text-purple-300 mb-3" data-i18n="patreon.tier2.title">PLATA</h3>
                    <p class="text-purple-300/70 mb-4" data-i18n="patreon.tier2.desc">$7/mes - Soporte prioritario</p>
                    <ul class="space-y-2 text-sm">
                        <li class="flex items-center">
                            <i class="fas fa-check text-green-400 mr-2"></i>
                            <span data-i18n="patreon.tier2.benefit1">Todo en Bronce +</span>
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-check text-green-400 mr-2"></i>
                            <span data-i18n="patreon.tier2.benefit2">Soporte prioritario</span>
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-check text-green-400 mr-2"></i>
                            <span data-i18n="patreon.tier2.benefit3">Beta testing</span>
                        </li>
                    </ul>
                </div>
                
                <div class="cyber-card p-6 border-purple-500/40 bg-gradient-to-br from-purple-900/20 to-black">
                    <div class="text-3xl text-purple-400 mb-4">
                        <i class="fas fa-dragon"></i>
                    </div>
                    <h3 class="text-xl font-bold text-purple-300 mb-3" data-i18n="patreon.tier3.title">ORO</h3>
                    <p class="text-purple-300/70 mb-4" data-i18n="patreon.tier3.desc">$15/mes - Máximo apoyo</p>
                    <ul class="space-y-2 text-sm">
                        <li class="flex items-center">
                            <i class="fas fa-check text-green-400 mr-2"></i>
                            <span data-i18n="patreon.tier3.benefit1">Todo en Plata +</span>
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-check text-green-400 mr-2"></i>
                            <span data-i18n="patreon.tier3.benefit2">Voto en nuevas features</span>
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-check text-green-400 mr-2"></i>
                            <span data-i18n="patreon.tier3.benefit3">Canal IRC exclusivo</span>
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-check text-green-400 mr-2"></i>
                            <span data-i18n="patreon.tier3.benefit4">Sesiones 1-on-1</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <!-- Estadísticas -->
            <div class="cyber-card p-6 mb-8">
                <h3 class="text-xl font-bold text-purple-300 mb-6" data-i18n="patreon.stats">NUESTRA COMUNIDAD</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="text-center p-4 bg-purple-900/20 rounded">
                        <div class="text-2xl font-bold text-purple-400" id="patronCount">150+</div>
                        <div class="text-sm text-purple-300/70" data-i18n="patreon.patrons">PATREONS</div>
                    </div>
                    <div class="text-center p-4 bg-purple-900/20 rounded">
                        <div class="text-2xl font-bold text-purple-400">$850+</div>
                        <div class="text-sm text-purple-300/70" data-i18n="patreon.monthly">AL MES</div>
                    </div>
                    <div class="text-center p-4 bg-purple-900/20 rounded">
                        <div class="text-2xl font-bold text-purple-400">24/7</div>
                        <div class="text-sm text-purple-300/70" data-i18n="patreon.support">SOPORTE</div>
                    </div>
                    <div class="text-center p-4 bg-purple-900/20 rounded">
                        <div class="text-2xl font-bold text-purple-400">50+</div>
                        <div class="text-sm text-purple-300/70" data-i18n="patreon.features">FEATURES</div>
                    </div>
                </div>
            </div>
            
            <!-- FAQ -->
            <div class="cyber-card p-6">
                <h3 class="text-xl font-bold text-purple-300 mb-6" data-i18n="patreon.faq">PREGUNTAS FRECUENTES</h3>
                <div class="space-y-4">
                    <div class="border-b border-purple-900/30 pb-4">
                        <h4 class="font-bold text-purple-300 mb-2" data-i18n="patreon.faq1.q">¿Cómo se usa mi apoyo?</h4>
                        <p class="text-purple-300/70 text-sm" data-i18n="patreon.faq1.a">El 100% va a desarrollo, servidores seguros, y mantenimiento de infraestructura.</p>
                    </div>
                    <div class="border-b border-purple-900/30 pb-4">
                        <h4 class="font-bold text-purple-300 mb-2" data-i18n="patreon.faq2.q">¿Puedo cancelar cuando quiera?</h4>
                        <p class="text-purple-300/70 text-sm" data-i18n="patreon.faq2.a">Sí, puedes cancelar tu suscripción en cualquier momento desde Patreon.</p>
                    </div>
                    <div>
                        <h4 class="font-bold text-purple-300 mb-2" data-i18n="patreon.faq3.q">¿Hay beneficios únicos?</h4>
                        <p class="text-purple-300/70 text-sm" data-i18n="patreon.faq3.a">Sí, cada nivel tiene beneficios exclusivos que mejoran tu experiencia DeepIRC.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Aplicar idioma
    applyLanguage(appState.currentLang);
}