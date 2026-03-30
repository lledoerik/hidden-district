// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

function abrirMenu() {
    navMenu.classList.add('active');
    hamburger.classList.add('active');
}

function cerrarMenu() {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
}

hamburger.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
        cerrarMenu();
    } else {
        abrirMenu();
    }
});

// Close menu when a nav link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        cerrarMenu();
    });
});

// Tab Switching for Cocteles/Tapas
const tabButtons = document.querySelectorAll('.tab-button');
const menuContents = document.querySelectorAll('.menu-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        menuContents.forEach(content => content.classList.remove('active'));

        button.classList.add('active');

        const tabName = button.getAttribute('data-tab');
        const targetContent = document.getElementById(`${tabName}-tab`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 0;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar: ocultar al hacer scroll abajo, mostrar al subir
let lastScrollY = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Si el menú está abierto, cerrarlo
    if (navMenu.classList.contains('active')) {
        cerrarMenu();
        return;
    }

    if (currentScrollY <= 10) {
        navbar.style.transform = 'translateY(0)';
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else if (currentScrollY > lastScrollY + 8) {
        navbar.style.transform = 'translateY(-100%)';
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else if (currentScrollY < lastScrollY - 8) {
        navbar.style.transform = 'translateY(0)';
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    }

    lastScrollY = currentScrollY;
}, { passive: true });


// ─── Validació i enviament del formulari ──────────────────────────────────────
const privadosForm = document.getElementById('privados-form');
if (privadosForm) {

    function validarFormulari(data) {
        const errors = [];
        const nombre = data.get('nombre')?.trim();
        const email  = data.get('email')?.trim();
        const tel    = data.get('telefono')?.trim();
        const fecha  = data.get('fecha');
        const aforo  = parseInt(data.get('aforo'), 10);
        const msg    = data.get('mensaje')?.trim();

        if (!nombre || nombre.length < 2)
            errors.push('El nombre debe tener al menos 2 caracteres.');
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            errors.push('El correo electrónico no es válido.');
        if (!tel || !/^[+]?[\d\s\-()]{7,15}$/.test(tel))
            errors.push('El teléfono no es válido.');
        if (!fecha || new Date(fecha) <= new Date())
            errors.push('La fecha debe ser posterior a hoy.');
        if (!aforo || aforo < 1)
            errors.push('El aforo debe ser al menos 1 persona.');
        if (!msg || msg.length < 10)
            errors.push('El mensaje debe tener al menos 10 caracteres.');

        return errors;
    }

    privadosForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data   = new FormData(privadosForm);
        const errors = validarFormulari(data);

        if (errors.length > 0) {
            alert('Por favor, corrige los siguientes errores:\n\n• ' + errors.join('\n• '));
            return;
        }

        const submitBtn = privadosForm.querySelector('button[type="submit"]');
        submitBtn.disabled    = true;
        submitBtn.textContent = 'Enviando...';

        try {
            const response = await fetch(privadosForm.action, {
                method:  'POST',
                body:    data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                alert('¡Gracias por tu solicitud! Nos pondremos en contacto contigo pronto.');
                privadosForm.reset();
            } else {
                alert('Oops! Hubo un problema al enviar tu reserva. Inténtalo de nuevo.');
            }
        } catch {
            alert('Error de conexión. Por favor, inténtalo más tarde.');
        } finally {
            submitBtn.disabled    = false;
            submitBtn.textContent = 'Enviar';
        }
    });
}


// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Active nav link highlight on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, { passive: true });

// Preload images for better performance
window.addEventListener('load', () => {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
});

// Carrusel
class Carousel {
    constructor({ trackId, prevId, nextId }) {
        this.track   = document.getElementById(trackId);
        this.btnPrev = document.getElementById(prevId);
        this.btnNext = document.getElementById(nextId);
        this.index   = 0;

        if (!this.track) return;

        this.btnPrev.addEventListener('click', () => this.mover(-1));
        this.btnNext.addEventListener('click', () => this.mover(1));
        window.addEventListener('resize', () => this.actualizar(), { passive: true });
        this.actualizar();
    }

    get visible() {
        if (window.innerWidth >= 968) return 3;
        if (window.innerWidth >= 600) return 2;
        return 1;
    }

    get total() {
        return this.track.children.length;
    }

    mover(dir) {
        const maxIndex = Math.max(0, this.total - this.visible);
        this.index = Math.min(maxIndex, Math.max(0, this.index + dir));
        this.actualizar();
    }

    actualizar() {
        if (!this.track.children.length) return;
        const card  = this.track.children[0];
        const style = window.getComputedStyle(this.track);
        const gap   = parseFloat(style.gap) || 32;
        const step  = card.offsetWidth + gap;

        this.track.style.transform = `translateX(-${this.index * step}px)`;

        const maxIndex = Math.max(0, this.total - this.visible);
        this.btnPrev.disabled = this.index === 0;
        this.btnNext.disabled = this.index >= maxIndex;
    }
}

// Inicialitzar un cop el DOM i el contingut estan carregats
// (main.js injecta les targetes al DOMContentLoaded; esperem un tick)
document.addEventListener('DOMContentLoaded', () => {
    // Petit delay per donar temps a main.js d'injectar les targetes
    setTimeout(() => {
        window.carouselCocteles = new Carousel({
            trackId: 'cocktail-grid',
            prevId:  'cocteles-prev',
            nextId:  'cocteles-next',
        });
        window.carouselTapas = new Carousel({
            trackId: 'tapas-grid',
            prevId:  'tapas-prev',
            nextId:  'tapas-next',
        });
    }, 100);
});

console.log('Hidden District - Web cargada correctament ✓');