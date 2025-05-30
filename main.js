document.addEventListener('DOMContentLoaded', function() {
    // Menú responsive
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('.navbar ul');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Modo oscuro persistente
    const toggleDarkMode = document.querySelector('.dark-mode-toggle');
    const body = document.body;
    
    // Verificar y aplicar modo oscuro guardado
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        if (toggleDarkMode && toggleDarkMode.type === 'checkbox') {
            toggleDarkMode.checked = true;
        }
    }
    
    // Configurar el toggle del modo oscuro
    if (toggleDarkMode) {
        toggleDarkMode.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
        });
    }
    
    // Pantalla completa persistente
    const fullscreenBtn = document.getElementById("fullscreen-btn");
    
    // Verificar estado de pantalla completa al cargar
    function checkFullscreenState() {
        if (document.fullscreenElement && fullscreenBtn) {
            fullscreenBtn.textContent = 'Salir de pantalla completa';
            fullscreenBtn.classList.add('fullscreen-active');
        }
    }
    
    // Función para alternar pantalla completa
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error al activar pantalla completa: ${err.message}`);
            });
            localStorage.setItem('fullscreenMode', 'enabled');
            if (fullscreenBtn) {
                fullscreenBtn.textContent = 'Salir de pantalla completa';
                fullscreenBtn.classList.add('fullscreen-active');
            }
        } else {
            document.exitFullscreen();
            localStorage.setItem('fullscreenMode', 'disabled');
            if (fullscreenBtn) {
                fullscreenBtn.textContent = 'Pantalla completa';
                fullscreenBtn.classList.remove('fullscreen-active');
            }
        }
    }
    
    // Configurar botón de pantalla completa
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener("click", toggleFullscreen);
        
        // Verificar si debería estar en pantalla completa al cargar
        if (localStorage.getItem('fullscreenMode') === 'enabled') {
            toggleFullscreen();
        }
    }
    
    // Event listener para cambios en el estado de pantalla completa
    document.addEventListener('fullscreenchange', checkFullscreenState);
    
    // Slider automático (versión mejorada)
    let slides = document.querySelectorAll(".slide");
    let currentIndex = 0;
    let slideInterval;
    
    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove("active");
            void slide.offsetWidth; // Trigger reflow
        });
        slides[index].classList.add("active");
        resetInterval();
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }
    
    function startInterval() {
        if (slides.length > 0) {
            slideInterval = setInterval(nextSlide, 5000);
        }
    }
    
    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }
    
    // Controles del slider (prev/next)
    const prevBtn = document.querySelector('.slider-controls .prev');
    const nextBtn = document.querySelector('.slider-controls .next');
    
    if (prevBtn && nextBtn && slides.length > 0) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        showSlide(currentIndex);
        startInterval();
    }
    
    // Scroll suave al hacer clic en enlaces
    document.querySelectorAll("a[href^='#']").forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute("href"));
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
    
    // Alerta al enviar formulario
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            alert("Gracias por tu consulta. Te responderemos pronto.");
            this.reset();
        });
    }
    
    // Pausar animación al hacer hover
    const suppliersTrack = document.querySelector('.suppliers-track');
    if (suppliersTrack) {
        suppliersTrack.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        suppliersTrack.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    }
    
    // Verificar estados al cargar
    checkFullscreenState();
});

// Hacer las filas clickeables (para futura expansión)
document.querySelectorAll('.pricing-table tbody tr').forEach(row => {
    row.addEventListener('click', function() {
        // Remover selección previa
        document.querySelectorAll('.pricing-table tr.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Seleccionar fila actual
        this.classList.add('selected');
        
        // Efecto visual (opcional)
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
        
        // Aquí puedes agregar lógica para mostrar detalles
        console.log('Producto seleccionado:', this.cells[0].textContent);
    });
});

// Ordenamiento por columnas (opcional)
document.querySelectorAll('.pricing-table th').forEach(header => {
    header.addEventListener('click', function() {
        const table = this.closest('table');
        const index = Array.from(this.parentNode.children).indexOf(this);
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        
        rows.sort((a, b) => {
            const aText = a.children[index].textContent;
            const bText = b.children[index].textContent;
            return aText.localeCompare(bText);
        });
        
        table.querySelector('tbody').append(...rows);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const darkSections = document.querySelectorAll(
        '.header, .footer, .slide-content, .product-card-back, .map-btn' // Agrega aquí todas las clases de elementos con fondos oscuros
    );

    // Función para establecer el cursor
    function setCursor(isWhite) {
        if (isWhite) {
            body.classList.add('cursor-white');
        } else {
            body.classList.remove('cursor-white');
        }
    }

    // Listener para el movimiento del ratón en todo el documento
    document.addEventListener('mousemove', (e) => {
        let isOverDarkElement = false;

        // Itera sobre los elementos con fondo oscuro
        darkSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Verifica si el cursor está dentro de las coordenadas del elemento
            if (e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
                isOverDarkElement = true;
            }
        });

        // Si el cursor está sobre un elemento oscuro o el modo oscuro está activo en el body
        // y el body en sí es oscuro, el cursor debe ser blanco.
        // Aquí asumimos que el body.dark también tiene un cursor blanco por CSS directo en body.dark.
        // Si el body es oscuro (modo oscuro), el cursor siempre debe ser blanco.
        if (body.classList.contains('dark') || body.classList.contains('dark-mode')) {
            setCursor(true);
        } else if (isOverDarkElement) {
            setCursor(true);
        } else {
            setCursor(false);
        }
    });

    // También considera el modo oscuro global para el cursor
    // Esto es útil si el modo oscuro cambia y no hay movimiento de ratón
    const darkModeToggle = document.querySelector('.dark-mode-toggle'); // Asume que tienes un botón de toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            // Un pequeño retraso para que la clase 'dark' se aplique o elimine
            setTimeout(() => {
                if (body.classList.contains('dark') || body.classList.contains('dark-mode')) {
                    setCursor(true);
                } else {
                    setCursor(false);
                }
            }, 50);
        });
    }

    // Asegúrate de que el cursor se establezca correctamente al cargar la página
    // si el body ya está en modo oscuro (por ejemplo, si se guarda la preferencia)
    if (body.classList.contains('dark') || body.classList.contains('dark-mode')) {
        setCursor(true);
    }
});