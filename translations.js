const translations = {
    es: {
        // Navegación
        "nav.home": "INICIO",
        "nav.help": "MANUAL_OPERACIONES",
        "nav.link": "VINCULACIÓN",
        "nav.pact": "PACTO",
        "nav.admin": "ADMIN",
        "nav.recovery": "RECUPERAR",
        "nav.back": "VOLVER",
        
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
        "recovery.title": ">> RECLAMAR_IDENTIDAD_ELITE",
        "recovery.secure": "CANAL_SEGURO_ACTIVO",
        "recovery.step1": "VERIFICAR ID",
        "recovery.step2": "CONFIRMAR EMAIL",
        "recovery.step3": "VINCULAR",
        "recovery.verifyTitle": "VERIFICACIÓN DE HUELLA DIGITAL",
        "recovery.verifyDesc": "Proporciona tu nick y contraseña maestra para iniciar el proceso de recuperación. El sistema buscará tu huella en la red y enviará un código de verificación a tu email encriptado.",
        "recovery.nickLabel": "NICK_DE_USUARIO",
        "recovery.nickHint": "El nick que utilizabas en DeepIRC",
        "recovery.passLabel": "CONTRASEÑA_MAESTRA",
        "recovery.passHint": "La contraseña que estableciste durante el registro inicial",
        "recovery.searchButton": "BUSCAR HUELLA EN LA RED",
        "recovery.emailTitle": "VERIFICACIÓN POR EMAIL",
        "recovery.emailDesc": "Se ha enviado un código de verificación al email asociado a tu cuenta. Revisa tu bandeja de entrada (y la carpeta de spam) e introduce el código a continuación.",
        "recovery.codeLabel": "CÓDIGO DE VERIFICACIÓN",
        "recovery.codeHint": "Código de 6 caracteres enviado por email",
        "recovery.resend": "REENVIAR CÓDIGO",
        "recovery.codeExpires": "EL CÓDIGO CADUCA EN:",
        "recovery.confirmButton": "VERIFICAR Y CONTINUAR",
        "recovery.deviceTitle": "VINCULAR NUEVO DISPOSITIVO",
        "recovery.deviceDesc": "¡Identidad verificada con éxito! Ahora puedes vincular tu nuevo dispositivo. Copia el token generado o escanea el código QR desde la aplicación DeepIRC.",
        "recovery.tokenLabel": "TOKEN DE VINCULACIÓN",
        "recovery.tokenHint": "Copia este token y pégalo en la aplicación DeepIRC > Vinculación",
        "recovery.qrHint": "Escanea este código QR desde la aplicación móvil",
        "recovery.instructionsTitle": "INSTRUCCIONES:",
        "recovery.instruction1": "Abre la aplicación DeepIRC en tu nuevo dispositivo",
        "recovery.instruction2": "Ve a Configuración > Recuperar Cuenta",
        "recovery.instruction3": "Introduce el token o escanea el código QR",
        "recovery.instruction4": "Tu identidad se transferirá automáticamente",
        "recovery.restartButton": "NUEVA RECUPERACIÓN",
        "recovery.homeButton": "VOLVER AL INICIO",
        "recovery.securityTitle": "IMPORTANTE: SEGURIDAD",
        "recovery.security1": "• Este proceso solo puede realizarse una vez cada 24 horas por cuenta",
        "recovery.security2": "• Los tokens de recuperación expiran después de 15 minutos",
        "recovery.security3": "• Notificaremos a todos los dispositivos vinculados sobre esta recuperación",
        "recovery.security4": "• Si no reconoces esta actividad, contacta con soporte inmediatamente",
        "recovery.faqTitle": "PREGUNTAS FRECUENTES",
        "recovery.faq1q": "¿No recibes el email de verificación?",
        "recovery.faq1a": "Revisa tu carpeta de spam. Si aún no lo encuentras, espera 5 minutos y utiliza la opción 'Reenviar código'.",
        "recovery.faq2q": "¿Olvidaste tu contraseña maestra?",
        "recovery.faq2a": "Contacta con soporte a través de support@deepirc.net con la mayor información posible sobre tu cuenta.",
        "recovery.faq3q": "¿El token no funciona en la app?",
        "recovery.faq3a": "Asegúrate de que la aplicación esté actualizada a la última versión y que tengas conexión a internet.",
        "recovery.status.searching": "BUSCANDO HUELLA EN LA RED...",
        "recovery.status.emailSent": "EMAIL ENVIADO. Revisa tu bandeja de entrada.",
        "recovery.status.verifying": "VERIFICANDO CÓDIGO DE SEGURIDAD...",
        "recovery.status.success": "¡IDENTIDAD RECUPERADA CON ÉXITO!",
        "recovery.status.resending": "REENVIANDO CÓDIGO...",
        "recovery.status.resent": "CÓDIGO REENVIADO. Revisa tu email.",
        "recovery.status.awaiting": "ESPERANDO VERIFICACIÓN...",
        "recovery.errors.nickShort": "ERROR: El nick debe tener al menos 3 caracteres.",
        "recovery.errors.passShort": "ERROR: La contraseña debe tener al menos 8 caracteres.",
        "recovery.errors.notFound": "ERROR: No se encontró ninguna cuenta con esas credenciales.",
        "recovery.errors.invalidCode": "ERROR: Formato de código inválido. Usa el formato: XXXX-XXXX-XXXX",
        "recovery.errors.wrongCode": "ERROR: Código incorrecto. Por favor, verifica e intenta de nuevo.",
        "recovery.errors.codeExpired": "CÓDIGO EXPIRADO. Por favor, solicita uno nuevo.",
        "recovery.errors.generic": "ERROR: Ocurrió un error inesperado. Intenta de nuevo.",
        "recovery.copied": "¡COPIADO!",
        "recovery.confirmRestart": "¿Estás seguro de que quieres reiniciar el proceso? Se perderán los datos actuales.",
        "recovery.footer.encrypted": "CANAL CIFRADO: AES-256-GCM",
        "recovery.footer.support": "Soporte",
        "recovery.footer.disclaimer": "Sistema de recuperación protegido por el Pacto de Honor DeepIRC. Todas las solicitudes son auditadas.",
        
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
        "nav.back": "BACK",
        
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
        "recovery.title": ">> ELITE_IDENTITY_RECOVERY",
        "recovery.secure": "SECURE_CHANNEL_ACTIVE",
        "recovery.step1": "VERIFY ID",
        "recovery.step2": "CONFIRM EMAIL",
        "recovery.step3": "LINK DEVICE",
        "recovery.verifyTitle": "DIGITAL FINGERPRINT VERIFICATION",
        "recovery.verifyDesc": "Provide your nick and master password to start the recovery process. The system will search for your fingerprint on the network and send a verification code to your encrypted email.",
        "recovery.nickLabel": "USER_NICK",
        "recovery.nickHint": "The nick you used on DeepIRC",
        "recovery.passLabel": "MASTER_PASSWORD",
        "recovery.passHint": "The password you set during initial registration",
        "recovery.searchButton": "SEARCH NETWORK FINGERPRINT",
        "recovery.emailTitle": "EMAIL VERIFICATION",
        "recovery.emailDesc": "A verification code has been sent to the email associated with your account. Check your inbox (and spam folder) and enter the code below.",
        "recovery.codeLabel": "VERIFICATION CODE",
        "recovery.codeHint": "6-character code sent by email",
        "recovery.resend": "RESEND CODE",
        "recovery.codeExpires": "CODE EXPIRES IN:",
        "recovery.confirmButton": "VERIFY AND CONTINUE",
        "recovery.deviceTitle": "LINK NEW DEVICE",
        "recovery.deviceDesc": "Identity successfully verified! You can now link your new device. Copy the generated token or scan the QR code from the DeepIRC app.",
        "recovery.tokenLabel": "LINKING TOKEN",
        "recovery.tokenHint": "Copy this token and paste it in DeepIRC app > Linking",
        "recovery.qrHint": "Scan this QR code from the mobile app",
        "recovery.instructionsTitle": "INSTRUCTIONS:",
        "recovery.instruction1": "Open the DeepIRC app on your new device",
        "recovery.instruction2": "Go to Settings > Recover Account",
        "recovery.instruction3": "Enter the token or scan the QR code",
        "recovery.instruction4": "Your identity will be transferred automatically",
        "recovery.restartButton": "NEW RECOVERY",
        "recovery.homeButton": "RETURN TO HOME",
        "recovery.securityTitle": "IMPORTANT: SECURITY",
        "recovery.security1": "• This process can only be performed once every 24 hours per account",
        "recovery.security2": "• Recovery tokens expire after 15 minutes",
        "recovery.security3": "• We will notify all linked devices about this recovery",
        "recovery.security4": "• If you don't recognize this activity, contact support immediately",
        "recovery.faqTitle": "FREQUENTLY ASKED QUESTIONS",
        "recovery.faq1q": "Not receiving verification email?",
        "recovery.faq1a": "Check your spam folder. If you still can't find it, wait 5 minutes and use the 'Resend code' option.",
        "recovery.faq2q": "Forgot your master password?",
        "recovery.faq2a": "Contact support at support@deepirc.net with as much information as possible about your account.",
        "recovery.faq3q": "Token not working in the app?",
        "recovery.faq3a": "Make sure the app is updated to the latest version and that you have internet connection.",
        "recovery.status.searching": "SEARCHING NETWORK FINGERPRINT...",
        "recovery.status.emailSent": "EMAIL SENT. Check your inbox.",
        "recovery.status.verifying": "VERIFYING SECURITY CODE...",
        "recovery.status.success": "IDENTITY SUCCESSFULLY RECOVERED!",
        "recovery.status.resending": "RESENDING CODE...",
        "recovery.status.resent": "CODE RESENT. Check your email.",
        "recovery.status.awaiting": "AWAITING VERIFICATION...",
        "recovery.errors.nickShort": "ERROR: Nick must be at least 3 characters.",
        "recovery.errors.passShort": "ERROR: Password must be at least 8 characters.",
        "recovery.errors.notFound": "ERROR: No account found with those credentials.",
        "recovery.errors.invalidCode": "ERROR: Invalid code format. Use format: XXXX-XXXX-XXXX",
        "recovery.errors.wrongCode": "ERROR: Incorrect code. Please verify and try again.",
        "recovery.errors.codeExpired": "CODE EXPIRED. Please request a new one.",
        "recovery.errors.generic": "ERROR: An unexpected error occurred. Please try again.",
        "recovery.copied": "COPIED!",
        "recovery.confirmRestart": "Are you sure you want to restart the process? Current data will be lost.",
        "recovery.footer.encrypted": "ENCRYPTED CHANNEL: AES-256-GCM",
        "recovery.footer.support": "Support",
        "recovery.footer.disclaimer": "Recovery system protected by DeepIRC Honor Pact. All requests are audited.",
        
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
    },
    
    fr: {
        // Navigation
        "nav.home": "ACCUEIL",
        "nav.help": "MANUEL_OPÉRATIONS",
        "nav.link": "LIEN",
        "nav.pact": "PACTE",
        "nav.admin": "ADMIN",
        "nav.recovery": "RÉCUPÉRATION",
        "nav.back": "RETOUR",
        
        // Landing
        "landing.description": "DeepIRC n'est pas juste un client. C'est un tunnel vers le réseau IRC avec routage Tor natif, chiffrement OTR et isolement total des métadonnées.",
        
        // Features
        "features.anon.title": "ANONYMAT TOTAL",
        "features.anon.desc": "Pseudonymes éphémères et rotation automatique des identités.",
        "features.encrypt.title": "CHIFFREMENT E2EE",
        "features.encrypt.desc": "Chiffrement de bout en bout avec clés temporaires.",
        "features.logs.title": "AUCUN JOURNAL",
        "features.logs.desc": "Auto-destruction des logs et effacement forensique automatique.",
        
        // Operations Manual
        "help.title": ">> MANUEL_D'OPÉRATIONS",
        "help.items": [
            {
                "title": "[01] MODE PARANOÏAQUE",
                "desc": "Activez 'Isolation d'App' dans Paramètres. L'app coupera toutes les connexions automatiques aux serveurs d'aide pour éviter le traçage accidentel d'IP."
            },
            {
                "title": "[02] ROUTE TOR (SOCKS5)",
                "desc": "Configurez 127.0.0.1:9050. DeepIRC enverra vos paquets à travers le réseau oignon. Requiert Orbot actif."
            },
            {
                "title": "[03] PSEUDO ÉVOLUTIF",
                "desc": "Identités éphémères. Le système générera des pseudos aléatoires à chaque connexion pour empêcher le traçage historique de votre activité."
            },
            {
                "title": "[04] MESSAGES ÉPHÉMÈRES",
                "desc": "Auto-destruction locale. Les journaux sont effacés de votre appareil après le temps configuré. Aucune trace forensique."
            }
        ],
        
        // Linking
        "linking.title": ">> LIEN_DE_COMPTE",
        "linking.description": "Entrez le code de vérification fourni par l'application pour accéder à votre panneau de contrat et aux fonctionnalités premium.",
        "linking.process": "TRAITER",
        "linking.awaiting": "EN_ATTENTE_TOKEN...",
        "linking.lostToken": "PERDU VOTRE TOKEN?",
        "linking.recoveryInfo": "Si vous avez perdu votre appareil ou token d'accès, visitez la section récupération.",
        "linking.goRecovery": "ALLER À RÉCUPÉRATION",
        
        // Contract
        "contract.title": ">> PACTE_DE_CONFIANCE_v2.0",
        "contract.items": [
            {
                "title": "[01] VOS DONNÉES VOUS APPARTIENNENT:",
                "desc": "DeepIRC ne collecte rien sur vous qui ne soit strictement nécessaire au fonctionnement de l'app (comme vos serveurs ou pseudos). Je ne m'intéresse pas à vos données, je n'en vis pas, et je ne les vendrais à personne même si on me payait avec le serveur le plus rapide du monde. Point."
            },
            {
                "title": "[02] CONFIANCE MUTUELLE:",
                "desc": "C'est un pacte. Je fais confiance que vous n'essaierez pas de casser le système et vous faites confiance à mon code. Si à un moment vous arrêtez de me faire confiance ou à ce que cette app fait, la meilleure chose est de la supprimer. Sans rancune."
            },
            {
                "title": "[03] USAGE CIVILISÉ:",
                "desc": "Vous êtes responsable de ce que vous dites et faites sur les réseaux IRC. Respectez les règles des serveurs auxquels vous vous connectez et maintenez un comportement civilisé. N'utilisez pas DeepIRC pour faire le mal; si je détecte un usage frauduleux ou nuisible, je me réserve le droit de prendre les mesures que je juge appropriées (et croyez-moi, j'ai des outils pour cela)."
            },
            {
                "title": "[04] CONTRIBUTIONS:",
                "desc": "Si vous décidez de mettre de l'argent pour soutenir ce projet, sachez que c'est un don pour la maintenance et le café du développement. Vous n'achetez pas l'app; la propriété intellectuelle reste la mienne, mais j'apprécie infiniment que vous m'aidiez à garder la machine en marche."
            },
            {
                "title": "[05] SANS GARANTIE:",
                "desc": "Ce logiciel est fourni 'tel quel'. Je ne garantis pas qu'il fonctionnera parfaitement dans toutes les situations, ni qu'il soit immunisé contre les vulnérabilités. La sécurité totale n'existe pas. Utilisez-le à vos risques et périls."
            }
        ],
        "contract.acceptTitle": "ACCEPTATION DU PACTE",
        "contract.acceptText": "En cochant cette case, vous confirmez avoir lu, compris et accepté tous les termes du Pacte d'Honneur DeepIRC. Cette action est irréversible et constitue un accord contraignant entre vous et le système.",
        
        // Admin
        "admin.title": "!! SYSTÈME_ADMINISTRATION_ROOT !!",
        "admin.subtitle": "Accès restreint aux opérateurs autorisés",
        "admin.sync": "SYNCHRONISER",
        "admin.logout": "DÉCONNEXION",
        "admin.table.uuid": "UUID_APP",
        "admin.table.nick": "PSEUDO_ASSOCIÉ",
        "admin.table.email": "EMAIL",
        "admin.table.status": "STATUT",
        "admin.table.lastAccess": "DERNIER_ACCÈS",
        "admin.table.actions": "ACTIONS",
        "admin.stats.total": "UTILISATEURS TOTAUX",
        "admin.stats.active": "ACTIFS (24H)",
        "admin.stats.premium": "PREMIUM",
        
        // Recovery
        "recovery.title": ">> RÉCUPÉRATION_IDENTITÉ_ÉLITE",
        "recovery.secure": "CANAL_SÉCURISÉ_ACTIF",
        "recovery.step1": "VÉRIFIER ID",
        "recovery.step2": "CONFIRMER EMAIL",
        "recovery.step3": "LIER",
        "recovery.verifyTitle": "VÉRIFICATION EMPREINTE NUMÉRIQUE",
        "recovery.verifyDesc": "Fournissez votre pseudo et mot de passe maître pour démarrer le processus de récupération. Le système recherchera votre empreinte sur le réseau et enverra un code de vérification à votre email chiffré.",
        "recovery.nickLabel": "PSEUDO_UTILISATEUR",
        "recovery.nickHint": "Le pseudo que vous utilisiez sur DeepIRC",
        "recovery.passLabel": "MOT_DE_PASSE_MAÎTRE",
        "recovery.passHint": "Le mot de passe que vous avez défini lors de l'inscription initiale",
        "recovery.searchButton": "RECHERCHER EMPREINTE RÉSEAU",
        "recovery.emailTitle": "VÉRIFICATION PAR EMAIL",
        "recovery.emailDesc": "Un code de vérification a été envoyé à l'email associé à votre compte. Vérifiez votre boîte de réception (et dossier spam) et entrez le code ci-dessous.",
        "recovery.codeLabel": "CODE DE VÉRIFICATION",
        "recovery.codeHint": "Code à 6 caractères envoyé par email",
        "recovery.resend": "RENVOYER CODE",
        "recovery.codeExpires": "LE CODE EXPIRE DANS:",
        "recovery.confirmButton": "VÉRIFIER ET CONTINUER",
        "recovery.deviceTitle": "LIER NOUVEL APPAREIL",
        "recovery.deviceDesc": "Identité vérifiée avec succès! Vous pouvez maintenant lier votre nouvel appareil. Copiez le token généré ou scannez le code QR depuis l'application DeepIRC.",
        "recovery.tokenLabel": "TOKEN DE LIAISON",
        "recovery.tokenHint": "Copiez ce token et collez-le dans l'app DeepIRC > Liaison",
        "recovery.qrHint": "Scannez ce code QR depuis l'application mobile",
        "recovery.instructionsTitle": "INSTRUCTIONS:",
        "recovery.instruction1": "Ouvrez l'application DeepIRC sur votre nouvel appareil",
        "recovery.instruction2": "Allez dans Paramètres > Récupérer Compte",
        "recovery.instruction3": "Entrez le token ou scannez le code QR",
        "recovery.instruction4": "Votre identité sera transférée automatiquement",
        "recovery.restartButton": "NOUVELLE RÉCUPÉRATION",
        "recovery.homeButton": "RETOUR À L'ACCUEIL",
        "recovery.securityTitle": "IMPORTANT: SÉCURITÉ",
        "recovery.security1": "• Ce processus ne peut être effectué qu'une fois toutes les 24 heures par compte",
        "recovery.security2": "• Les tokens de récupération expirent après 15 minutes",
        "recovery.security3": "• Nous notifierons tous les appareils liés de cette récupération",
        "recovery.security4": "• Si vous ne reconnaissez pas cette activité, contactez le support immédiatement",
        "recovery.faqTitle": "QUESTIONS FRÉQUENTES",
        "recovery.faq1q": "Vous ne recevez pas l'email de vérification?",
        "recovery.faq1a": "Vérifiez votre dossier spam. Si vous ne le trouvez toujours pas, attendez 5 minutes et utilisez l'option 'Renvoyer le code'.",
        "recovery.faq2q": "Mot de passe oublié?",
        "recovery.faq2a": "Contactez le support à support@deepirc.net avec toute l'information disponible de votre acompte.",
        "recovery.faq3q": "¿Le token ne marche pas à l'app?",
        "recovery.faq3a": "Asegúrate de que la aplicación esté actualizada a la última versión y que tengas conexión a internet.",
        "recovery.status.searching": "BUSCANDO HUELLA EN LA RED...",
        "recovery.status.emailSent": "EMAIL ENVIADO. Revisa tu bandeja de entrada.",
        "recovery.status.verifying": "VERIFICANDO CÓDIGO DE SEGURIDAD...",
        "recovery.status.success": "¡IDENTIDAD RECUPERADA CON ÉXITO!",
        "recovery.status.resending": "REENVIANDO CÓDIGO...",
        "recovery.status.resent": "CÓDIGO REENVIADO. Revisa tu email.",
        "recovery.status.awaiting": "ESPERANDO VERIFICACIÓN...",
        "recovery.errors.nickShort": "ERROR: El nick debe tener al menos 3 caracteres.",
        "recovery.errors.passShort": "ERROR: La contraseña debe tener al menos 8 caracteres.",
        "recovery.errors.notFound": "ERROR: No se encontró ninguna cuenta con esas credenciales.",
        "recovery.errors.invalidCode": "ERROR: Formato de código inválido. Usa el formato: XXXX-XXXX-XXXX",
        "recovery.errors.wrongCode": "ERROR: Código incorrecto. Por favor, verifica e intenta de nuevo.",
        "recovery.errors.codeExpired": "CÓDIGO EXPIRADO. Por favor, solicita uno nuevo.",
        "recovery.errors.generic": "ERROR: Ocurrió un error inesperado. Intenta de nuevo.",
        "recovery.copied": "¡COPIADO!",
        "recovery.confirmRestart": "¿Estás seguro de que quieres reiniciar el proceso? Se perderán los datos actuales.",
        "recovery.footer.encrypted": "CANAL CIFRADO: AES-256-GCM",
        "recovery.footer.support": "Soporte",
        "recovery.footer.disclaimer": "Sistema de recuperación protegido por el Pacto de Honor DeepIRC. Todas las solicitudes son auditadas.",
        
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
