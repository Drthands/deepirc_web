// debug.js - Para diagnosticar problemas
document.addEventListener('DOMContentLoaded', function() {
    console.log("=== DEBUG MODE ===");
    
    // Verificar navegación
    const navLinks = document.querySelectorAll('.nav-link');
    console.log("Enlaces de navegación encontrados:", navLinks.length);
    
    navLinks.forEach((link, index) => {
        console.log(`Link ${index}:`, {
            href: link.getAttribute('href'),
            onclick: link.getAttribute('onclick'),
            style: link.getAttribute('style'),
            class: link.getAttribute('class')
        });
        
        // Añadir listener directo
        link.addEventListener('click', function(e) {
            console.log("CLIC DETECTADO en:", this.getAttribute('href'));
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, true); // Usar capture phase
    });
    
    // Verificar si hay CSS que esté bloqueando clics
    const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
    console.log("Estilos cargados:", styles.length);
});