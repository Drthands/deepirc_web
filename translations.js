const translations = {
    es: {
        // Navegación
        "nav.home": "INICIO",
        "nav.help": "MANUAL_OPERACIONES",
        "nav.link": "VINCULACIÓN",
        "nav.pact": "PACTO",
        "nav.admin": "ADMIN",
        "nav.recovery": "RECUPERAR",
        
        // Landing
        "landing.description": "DeepIRC no es solo un cliente. Es un túnel hacia la red IRC con enrutamiento Tor nativo, cifrado OTR y aislamiento total de metadatos.",
        
        // Características
        "features.anon.title": "ANONIMATO TOTAL",
        "features.anon.desc": "Nicks efímeros y rotación automática de identidades.",
        "features.encrypt.title": "CIFRADO E2EE",
        "features.encrypt.desc": "Cifrado de extremo a extremo con llaves temporales.",
        "features.logs.title": "SIN REGISTROS",
        "features.logs.desc": "Autodestrucción de logs y borrado forense automático.",
        
        // Manual de Operaciones
        "help.title": ">> MANUAL_DE_OPERACIONES",
        "help.items": [
            {
                "title": "[01] MODO PARANOICO",
                "desc": "Activa el 'App Isolation' en Ajustes. La app cortará toda conexión automática a servidores de ayuda para evitar rastreos de IP accidentales."
            },
            {
                "title": "[02] RUTA TOR (SOCKS5)",
                "desc": "Configura 127.0.0.1:9050. DeepIRC enviará tus paquetes a través de la red de cebolla. Requiere Orbot activo."
            },
            {
                "title": "[03] NICK EVOLUTIVO",
                "desc": "Identidades efímeras. El sistema generará nicks aleatorios en cada conexión para que nadie pueda trazar un perfil histórico de tu actividad."
            },
            {
                "title": "[04] MENSAJES EFÍMEROS",
                "desc": "Autodestrucción local. Los logs se borran de tu dispositivo tras el tiempo configurado. No queda rastro forense."
            }
        ],
        
        // Vinculación
        "linking.title": ">> VINCULACIÓN_DE_CUENTA",
        "linking.description": "Introduce el código de verificación proporcionado por la aplicación para acceder a tu panel de contrato y funciones premium.",
        "linking.process": "PROCESAR",
        "linking.awaiting": "ESPERANDO_TOKEN...",
        "linking.lostToken": "¿PERDISTE TU TOKEN?",
        "linking.recoveryInfo": "Si has perdido tu dispositivo o token de acceso, visita la sección de recuperación.",
        "linking.goRecovery": "IR A RECUPERACIÓN",
        
        // Contrato
        "contract.title": ">> PACTO_DE_CONFIANZA_v2.0",
        "contract.items": [
            {
                "title": "[01] TUS DATOS SON TUYOS:",
                "desc": "DeepIRC no recopila nada sobre ti que no sea estrictamente necesario para que la app funcione (como tus servidores o nicks). A mí no me interesan tus datos, no vivo de ellos, ni se los vendería a nadie aunque me pagasen con el servidor más rápido del mundo. Punto."
            },
            {
                "title": "[02] CONFIANZA MUTUA:",
                "desc": "Esto es un pacto. Yo confío en que no vas a intentar romper el sistema y tú confías en mi código. Si en algún momento dejas de confiar en mí o en lo que hace esta app, lo mejor que puedes hacer es borrarla. Sin rencores."
            },
            {
                "title": "[03] USO CIVILIZADO:",
                "desc": "Eres responsable de lo que digas y hagas en las redes IRC. Respeta las normas de los servidores a los que te conectes y mantén un comportamiento cívico. No uses DeepIRC para hacer el mal; si detecto un uso fraudulento o dañino, me reservo el derecho de tomar las medidas que crea oportunas (y créeme, tengo herramientas para ello)."
            },
            {
                "title": "[04] APORTACIONES:",
                "desc": "Si decides poner dinero para apoyar este proyecto, que sepas que es una donación para el mantenimiento y el café del desarrollo. No estás 'comprando' la app; la propiedad intelectual sigue siendo mía, pero te agradezco infinito que me ayudes a mantener la máquina funcionando."
            },
            {
                "title": "[05] SIN GARANTÍAS:",
                "desc": "Este software se proporciona 'tal cual'. No garantizo que funcione perfectamente en todas las situaciones, ni que sea inmune a vulnerabilidades. La seguridad total no existe. Úsalo bajo tu propia responsabilidad."
            }
        ],
        "contract.acceptTitle": "ACEPTACIÓN DEL PACTO",
        "contract.acceptText": "Al marcar esta casilla, confirmas que has leído, comprendido y aceptas todos los términos del Pacto de Honor DeepIRC. Esta acción es irreversible y constituye un acuerdo vinculante entre tú y el sistema.",
        
        // Admin
        "admin.title": "!! SISTEMA_ADMINISTRACIÓN_ROOT !!",
        "admin.subtitle": "Acceso restringido a operadores autorizados",
        "admin.sync": "SINCRONIZAR",
        "admin.logout": "SALIR",
        "admin.table.uuid": "UUID_APP",
        "admin.table.nick": "NICK_ASOCIADO",
        "admin.table.email": "EMAIL",
        "admin.table.status": "ESTADO",
        "admin.table.lastAccess": "ÚLTIMO_ACCESO",
        "admin.table.actions": "ACCIONES",
        "admin.stats.total": "USUARIOS TOTALES",
        "admin.stats.active": "ACTIVOS (24H)",
        "admin.stats.premium": "PREMIUM",
        
        // Recuperación
        "recovery.title": ">> RECUPERACIÓN_DE_ACCESO",
        "recovery.emailTitle": "RECUPERACIÓN POR EMAIL",
        "recovery.emailDesc": "Si proporcionaste un email durante el registro, podemos enviarte un enlace de recuperación.",
        "recovery.emailPlaceholder": "tu@email.com",
        "recovery.sendRecovery": "ENVIAR ENLACE",
        "recovery.supportTitle": "SOPORTE DIRECTO",
        "recovery.supportDesc": "Para casos complejos o si no tienes acceso al email registrado.",
        "recovery.contact": "CONTACTO DE SOPORTE",
        "recovery.responseTime": "Respuesta en menos de 48 horas",
        "recovery.faqTitle": "PREGUNTAS FRECUENTES",
        "recovery.faqItems": [
            {
                "q": "¿Cuánto tarda el proceso de recuperación?",
                "a": "El enlace de recuperación se envía inmediatamente. Si no lo recibes en 5 minutos, revisa la carpeta de spam."
            },
            {
                "q": "¿Qué información necesito para recuperar mi cuenta?",
                "a": "Necesitas el email registrado o algún dato de tu dispositivo (UUID, nick, etc.)."
            },
            {
                "q": "¿Puedo recuperar mi cuenta sin email?",
                "a": "Sí, contacta con soporte directo con la mayor información posible sobre tu cuenta."
            }
        ],
        
        // Footer
        "footer.copyright": "© 2024 DeepIRC Project. Todos los derechos reservados.",
        "footer.version": "v2.0.1",
        "footer.privacy": "Privacidad",
        "footer.terms": "Términos",
        "footer.help": "Ayuda",
        "footer.contact": "Contacto",
        "footer.disclaimer": "Este sistema está protegido bajo el Pacto de Honor DeepIRC. El uso no autorizado está prohibido.",
        
        // Mensajes de estado
        "status.pactError": "ERROR: Debes aceptar el Pacto de Honor para proceder.",
        "status.rootAccess": "ACCESO ROOT CONCEDIDO. BIENVENIDO, OPERADOR.",
        "status.invalidToken": "ERROR: El token no es válido o está mal formateado.",
        "status.syncing": "SINCRONIZANDO CON LA RED DEEP...",
        "status.linked": "VINCULACIÓN EXITOSA. Puedes volver a la App.",
        "status.recoverySent": "ENLACE DE RECUPERACIÓN ENVIADO. Revisa tu email.",
        "status.noEmail": "ERROR: Email no válido o no registrado."
    },
    
    en: {
        // Navigation
        "nav.home": "HOME",
        "nav.help": "OPERATIONS_MANUAL",
        "nav.link": "LINKING",
        "nav.pact": "PACT",
        "nav.admin": "ADMIN",
        "nav.recovery": "RECOVERY",
        
        // Landing
        "landing.description": "DeepIRC is not just a client. It's a tunnel to the IRC network with native Tor routing, OTR encryption and complete metadata isolation.",
        
        // Features
        "features.anon.title": "TOTAL ANONYMITY",
        "features.anon.desc": "Ephemeral nicks and automatic identity rotation.",
        "features.encrypt.title": "E2EE ENCRYPTION",
        "features.encrypt.desc": "End-to-end encryption with temporary keys.",
        "features.logs.title": "NO LOGS",
        "features.logs.desc": "Log self-destruction and automatic forensic deletion.",
        
        // Operations Manual
        "help.title": ">> OPERATIONS_MANUAL",
        "help.items": [
            {
                "title": "[01] PARANOID MODE",
                "desc": "Enable 'App Isolation' in Settings. The app will cut all automatic connections to help servers to avoid accidental IP tracking."
            },
            {
                "title": "[02] TOR ROUTE (SOCKS5)",
                "desc": "Configure 127.0.0.1:9050. DeepIRC will send your packets through the onion network. Requires active Orbot."
            },
            {
                "title": "[03] EVOLVING NICK",
                "desc": "Ephemeral identities. The system will generate random nicks on each connection so no one can trace a historical profile of your activity."
            },
            {
                "title": "[04] EPHEMERAL MESSAGES",
                "desc": "Local self-destruction. Logs are deleted from your device after the configured time. No forensic trace remains."
            }
        ],
        
        // Linking
        "linking.title": ">> ACCOUNT_LINKING",
        "linking.description": "Enter the verification code provided by the application to access your contract panel and premium features.",
        "linking.process": "PROCESS",
        "linking.awaiting": "AWAITING_TOKEN...",
        "linking.lostToken": "LOST YOUR TOKEN?",
        "linking.recoveryInfo": "If you lost your device or access token, visit the recovery section.",
        "linking.goRecovery": "GO TO RECOVERY",
        
        // Contract
        "contract.title": ">> TRUST_PACT_v2.0",
        "contract.items": [
            {
                "title": "[01] YOUR DATA IS YOURS:",
                "desc": "DeepIRC doesn't collect anything about you that isn't strictly necessary for the app to function (like your servers or nicks). I'm not interested in your data, I don't live off it, and I wouldn't sell it to anyone even if they paid me with the fastest server in the world. Period."
            },
            {
                "title": "[02] MUTUAL TRUST:",
                "desc": "This is a pact. I trust that you won't try to break the system and you trust my code. If at any point you stop trusting me or what this app does, the best thing you can do is delete it. No hard feelings."
            },
            {
                "title": "[03] CIVILIZED USE:",
                "desc": "You are responsible for what you say and do on IRC networks. Respect the rules of the servers you connect to and maintain civic behavior. Don't use DeepIRC to do harm; if I detect fraudulent or harmful use, I reserve the right to take whatever measures I deem appropriate (and believe me, I have tools for that)."
            },
            {
                "title": "[04] CONTRIBUTIONS:",
                "desc": "If you decide to put money into supporting this project, know that it's a donation for maintenance and development coffee. You're not 'buying' the app; the intellectual property remains mine, but I infinitely appreciate you helping me keep the machine running."
            },
            {
                "title": "[05] NO WARRANTIES:",
                "desc": "This software is provided 'as is'. I don't guarantee that it will work perfectly in all situations, or that it's immune to vulnerabilities. Total security doesn't exist. Use it at your own risk."
            }
        ],
        "contract.acceptTitle": "PACT ACCEPTANCE",
        "contract.acceptText": "By checking this box, you confirm that you have read, understood and accept all terms of the DeepIRC Honor Pact. This action is irreversible and constitutes a binding agreement between you and the system.",
        
        // Admin
        "admin.title": "!! ROOT_ADMINISTRATION_SYSTEM !!",
        "admin.subtitle": "Restricted access to authorized operators",
        "admin.sync": "SYNC",
        "admin.logout": "LOGOUT",
        "admin.table.uuid": "APP_UUID",
        "admin.table.nick": "ASSOCIATED_NICK",
        "admin.table.email": "EMAIL",
        "admin.table.status": "STATUS",
        "admin.table.lastAccess": "LAST_ACCESS",
        "admin.table.actions": "ACTIONS",
        "admin.stats.total": "TOTAL USERS",
        "admin.stats.active": "ACTIVE (24H)",
        "admin.stats.premium": "PREMIUM",
        
        // Recovery
        "recovery.title": ">> ACCOUNT_RECOVERY",
        "recovery.emailTitle": "EMAIL RECOVERY",
        "recovery.emailDesc": "If you provided an email during registration, we can send you a recovery link.",
        "recovery.emailPlaceholder": "your@email.com",
        "recovery.sendRecovery": "SEND LINK",
        "recovery.supportTitle": "DIRECT SUPPORT",
        "recovery.supportDesc": "For complex cases or if you don't have access to the registered email.",
        "recovery.contact": "SUPPORT CONTACT",
        "recovery.responseTime": "Response in less than 48 hours",
        "recovery.faqTitle": "FREQUENTLY ASKED QUESTIONS",
        "recovery.faqItems": [
            {
                "q": "How long does the recovery process take?",
                "a": "The recovery link is sent immediately. If you don't receive it within 5 minutes, check your spam folder."
            },
            {
                "q": "What information do I need to recover my account?",
                "a": "You need the registered email or some device data (UUID, nick, etc.)."
            },
            {
                "q": "Can I recover my account without email?",
                "a": "Yes, contact direct support with as much information as possible about your account."
            }
        ],
        
        // Footer
        "footer.copyright": "© 2024 DeepIRC Project. All rights reserved.",
        "footer.version": "v2.0.1",
        "footer.privacy": "Privacy",
        "footer.terms": "Terms",
        "footer.help": "Help",
        "footer.contact": "Contact",
        "footer.disclaimer": "This system is protected under the DeepIRC Honor Pact. Unauthorized use is prohibited.",
        
        // Status messages
        "status.pactError": "ERROR: You must accept the Honor Pact to proceed.",
        "status.rootAccess": "ROOT ACCESS GRANTED. WELCOME, OPERATOR.",
        "status.invalidToken": "ERROR: Invalid or malformed token.",
        "status.syncing": "SYNCING WITH DEEP NETWORK...",
        "status.linked": "LINKING SUCCESSFUL. You can return to the App.",
        "status.recoverySent": "RECOVERY LINK SENT. Check your email.",
        "status.noEmail": "ERROR: Invalid or unregistered email."
    }
    
    // Se pueden añadir más idiomas siguiendo el mismo patrón:
    // fr: {...}, pt: {...}, it: {...}, de: {...}, etc.
};