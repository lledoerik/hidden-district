// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a nav link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
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

    if (currentScrollY <= 10) {
        // En lo alto de la página: siempre visible
        navbar.style.transform = 'translateY(0)';
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else if (currentScrollY > lastScrollY + 8) {
        // Scrollando hacia abajo: ocultar
        navbar.style.transform = 'translateY(-100%)';
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else if (currentScrollY < lastScrollY - 8) {
        // Scrollando hacia arriba: mostrar
        navbar.style.transform = 'translateY(0)';
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    }

    lastScrollY = currentScrollY;
}, { passive: true });

// Form submission handler with Formspree
const privadosForm = document.getElementById('privados-form');
if (privadosForm) {
    privadosForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = new FormData(privadosForm);

        try {
            const response = await fetch(privadosForm.action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert('¡Gracias por tu solicitud! Nos pondremos en contacto contigo pronto.');
                privadosForm.reset();
            } else {
                alert('Oops! Hubo un problema al enviar tu reserva.');
            }
        } catch (error) {
            alert('Oops! Ocurrió un error al intentar contactar con el servidor.');
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

console.log('Hidden District - Web cargada correctament ✓');