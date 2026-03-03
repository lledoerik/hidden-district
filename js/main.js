/**
 * main.js — Hidden District
 * Carga el contenido desde content.json e inyecta los datos en el HTML.
 */

// ─── Plantillas ────────────────────────────────────────────────────────────────

/**
 * Genera el HTML de una tarjeta de cóctel o tapa.
 * @param {Object} item - { nombre, ingredientes, precio, imagen }
 */
function plantillaTarjetaMenu(item) {
    const estiloImagen = item.imagen
        ? `background-image: url('${item.imagen}');`
        : '';

    return `
        <div class="cocktail-card">
            <div class="cocktail-image" style="${estiloImagen}"></div>
            <div class="cocktail-info">
                <h3>${item.nombre}</h3>
                <p class="ingredients">${item.ingredientes}</p>
                <p class="price">${item.precio}</p>
            </div>
        </div>
    `;
}

/**
 * Genera el HTML de una tarjeta de evento.
 * @param {Object} evento - { dia, mes, titulo, descripcion, hora, tipo }
 */
function plantillaTarjetaEvento(evento) {
    return `
        <div class="evento-card">
            <div class="evento-date">
                <span class="day">${evento.dia}</span>
                <span class="month">${evento.mes}</span>
            </div>
            <div class="evento-content">
                <h3>${evento.titulo}</h3>
                <p class="evento-description">${evento.descripcion}</p>
                <div class="evento-details">
                    <span><i class="icon-clock"></i> ${evento.hora}</span>
                    <span><i class="icon-music"></i> ${evento.tipo}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Genera el HTML de una fila de horario.
 * @param {Object} horario - { dia, horas, cerrado }
 */
function plantillaHorario(horario) {
    const claseCerrado = horario.cerrado ? 'tancat' : '';
    return `
        <div class="horari-row ${claseCerrado}">
            <span class="dia">${horario.dia}</span>
            <span class="hores">${horario.horas}</span>
        </div>
    `;
}

/**
 * Genera el HTML de un enlace a red social.
 * @param {string} nombre - Nombre de la red social
 * @param {string} url    - URL del perfil
 */
function plantillaRedSocial(nombre, url) {
    return `<a href="${url}" class="social-icon" target="_blank" rel="noopener noreferrer">${nombre}</a>`;
}

// ─── Función principal ─────────────────────────────────────────────────────────

/**
 * Carga el fichero content.json e inyecta todos los datos en el DOM.
 */
async function cargarContenido() {
    try {
        const respuesta = await fetch('./content.json');
        if (!respuesta.ok) throw new Error(`Error al cargar content.json: ${respuesta.status}`);
        const datos = await respuesta.json();

        // ── Hero ──────────────────────────────────────────────────────────────
        document.getElementById('hero-tagline').textContent = datos.hero.tagline;

        // ── El Distrito ───────────────────────────────────────────────────────
        document.getElementById('distrito-titulo').textContent   = datos.distrito.titulo;
        document.getElementById('distrito-intro').textContent    = datos.distrito.intro;
        document.getElementById('distrito-parrafo1').textContent = datos.distrito.parrafo1;
        document.getElementById('distrito-parrafo2').textContent = datos.distrito.parrafo2;

        // ── Cócteles ──────────────────────────────────────────────────────────
        document.getElementById('cocteles-titulo').textContent    = datos.cocteles.titulo;
        document.getElementById('cocteles-subtitulo').textContent = datos.cocteles.subtitulo;

        const gridCocteles = document.getElementById('cocktail-grid');
        gridCocteles.innerHTML = datos.cocteles.items
            .map(plantillaTarjetaMenu)
            .join('');

        // ── Tapas ─────────────────────────────────────────────────────────────
        const gridTapas = document.getElementById('tapas-grid');
        gridTapas.innerHTML = datos.tapas.items
            .map(plantillaTarjetaMenu)
            .join('');

        // ── Eventos ───────────────────────────────────────────────────────────
        document.getElementById('eventos-titulo').textContent    = datos.eventos.titulo;
        document.getElementById('eventos-subtitulo').textContent = datos.eventos.subtitulo;

        const gridEventos = document.getElementById('eventos-grid');
        gridEventos.innerHTML = datos.eventos.items
            .map(plantillaTarjetaEvento)
            .join('');

        // ── Eventos Privados ──────────────────────────────────────────────────
        document.getElementById('privados-titulo').textContent          = datos.eventosPrivados.titulo;
        document.getElementById('privados-subtitulo').textContent       = datos.eventosPrivados.subtitulo;
        document.getElementById('privados-titulo-principal').textContent = datos.eventosPrivados.tituloPrincipal;
        document.getElementById('privados-descripcion').textContent     = datos.eventosPrivados.descripcion;
        document.getElementById('privados-precio').textContent          = `Reserva por tan solo ${datos.eventosPrivados.precio}`;

        const listaCaracteristicas = document.getElementById('privados-caracteristicas');
        listaCaracteristicas.innerHTML = datos.eventosPrivados.caracteristicas
            .map(item => `<li>✓ ${item}</li>`)
            .join('');

        // ── Contacto ──────────────────────────────────────────────────────────
        document.getElementById('contacto-titulo').textContent    = datos.contacto.titulo;
        // Horarios
        const gridHorario = document.getElementById('horario-grid');
        gridHorario.innerHTML = datos.contacto.horarios
            .map(plantillaHorario)
            .join('');

        // Redes sociales
        const contenedorSocial = document.getElementById('social-icons');
        const redes = datos.contacto.redesSociales;
        const nombresRedes = { INSTAGRAM: 'Instagram', CORREO: 'Correo', TELEFONO: 'Teléfono' };
        contenedorSocial.innerHTML = Object.entries(redes)
            .map(([clave, url]) => plantillaRedSocial(nombresRedes[clave] || clave, url))
            .join('');

        // ── Footer ────────────────────────────────────────────────────────────
        document.getElementById('footer-copyright').textContent = datos.footer.copyright;

        console.log('Hidden District — Contenido cargado correctamente ✓');

    } catch (error) {
        console.error('Error al cargar el contenido:', error);
    }
}

// Ejecutar al cargar el DOM
document.addEventListener('DOMContentLoaded', cargarContenido);