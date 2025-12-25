// Dentro de cada idioma (es, en, etc.), añadir:

"recovery": {
    "title": ">> RECLAMAR_IDENTIDAD_ELITE",
    "secure": "CANAL_SEGURO_ACTIVO",
    "step1": "VERIFICAR ID",
    "step2": "CONFIRMAR EMAIL",
    "step3": "VINCULAR",
    
    "verifyTitle": "VERIFICACIÓN DE HUELLA DIGITAL",
    "verifyDesc": "Proporciona tu nick y contraseña maestra para iniciar el proceso de recuperación. El sistema buscará tu huella en la red y enviará un código de verificación a tu email encriptado.",
    
    "nickLabel": "NICK_DE_USUARIO",
    "nickHint": "El nick que utilizabas en DeepIRC",
    "passLabel": "CONTRASEÑA_MAESTRA",
    "passHint": "La contraseña que estableciste durante el registro inicial",
    "searchButton": "BUSCAR HUELLA EN LA RED",
    
    "emailTitle": "VERIFICACIÓN POR EMAIL",
    "emailDesc": "Se ha enviado un código de verificación al email asociado a tu cuenta. Revisa tu bandeja de entrada (y la carpeta de spam) e introduce el código a continuación.",
    
    "codeLabel": "CÓDIGO DE VERIFICACIÓN",
    "codeHint": "Código de 6 caracteres enviado por email",
    "resend": "REENVIAR CÓDIGO",
    "codeExpires": "EL CÓDIGO CADUCA EN:",
    "confirmButton": "VERIFICAR Y CONTINUAR",
    
    "deviceTitle": "VINCULAR NUEVO DISPOSITIVO",
    "deviceDesc": "¡Identidad verificada con éxito! Ahora puedes vincular tu nuevo dispositivo. Copia el token generado o escanea el código QR desde la aplicación DeepIRC.",
    
    "tokenLabel": "TOKEN DE VINCULACIÓN",
    "tokenHint": "Copia este token y pégalo en la aplicación DeepIRC > Vinculación",
    "qrHint": "Escanea este código QR desde la aplicación móvil",
    
    "instructionsTitle": "INSTRUCCIONES:",
    "instruction1": "Abre la aplicación DeepIRC en tu nuevo dispositivo",
    "instruction2": "Ve a Configuración > Recuperar Cuenta",
    "instruction3": "Introduce el token o escanea el código QR",
    "instruction4": "Tu identidad se transferirá automáticamente",
    
    "restartButton": "NUEVA RECUPERACIÓN",
    "homeButton": "VOLVER AL INICIO",
    
    "securityTitle": "IMPORTANTE: SEGURIDAD",
    "security1": "• Este proceso solo puede realizarse una vez cada 24 horas por cuenta",
    "security2": "• Los tokens de recuperación expiran después de 15 minutos",
    "security3": "• Notificaremos a todos los dispositivos vinculados sobre esta recuperación",
    "security4": "• Si no reconoces esta actividad, contacta con soporte inmediatamente",
    
    "faqTitle": "PREGUNTAS FRECUENTES",
    "faq1q": "¿No recibes el email de verificación?",
    "faq1a": "Revisa tu carpeta de spam. Si aún no lo encuentras, espera 5 minutos y utiliza la opción 'Reenviar código'.",
    "faq2q": "¿Olvidaste tu contraseña maestra?",
    "faq2a": "Contacta con soporte a través de support@deepirc.net con la mayor información posible sobre tu cuenta.",
    "faq3q": "¿El token no funciona en la app?",
    "faq3a": "Asegúrate de que la aplicación esté actualizada a la última versión y que tengas conexión a internet.",
    
    "status": {
        "searching": "BUSCANDO HUELLA EN LA RED...",
        "emailSent": "EMAIL ENVIADO. Revisa tu bandeja de entrada.",
        "verifying": "VERIFICANDO CÓDIGO DE SEGURIDAD...",
        "success": "¡IDENTIDAD RECUPERADA CON ÉXITO!",
        "resending": "REENVIANDO CÓDIGO...",
        "resent": "CÓDIGO REENVIADO. Revisa tu email.",
        "awaiting": "ESPERANDO VERIFICACIÓN..."
    },
    
    "errors": {
        "nickShort": "ERROR: El nick debe tener al menos 3 caracteres.",
        "passShort": "ERROR: La contraseña debe tener al menos 8 caracteres.",
        "notFound": "ERROR: No se encontró ninguna cuenta con esas credenciales.",
        "invalidCode": "ERROR: Formato de código inválido. Usa el formato: XXXX-XXXX-XXXX",
        "wrongCode": "ERROR: Código incorrecto. Por favor, verifica e intenta de nuevo.",
        "codeExpired": "CÓDIGO EXPIRADO. Por favor, solicita uno nuevo.",
        "generic": "ERROR: Ocurrió un error inesperado. Intenta de nuevo."
    },
    
    "copied": "¡COPIADO!",
    "confirmRestart": "¿Estás seguro de que quieres reiniciar el proceso? Se perderán los datos actuales.",
    
    "footer": {
        "encrypted": "CANAL CIFRADO: AES-256-GCM",
        "support": "Soporte",
        "disclaimer": "Sistema de recuperación protegido por el Pacto de Honor DeepIRC. Todas las solicitudes son auditadas."
    }
},

// Añadir también en las secciones existentes:
"nav": {
    "back": "VOLVER"
    // ... otras traducciones existentes
}