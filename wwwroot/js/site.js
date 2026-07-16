document.addEventListener('DOMContentLoaded', () => {
    
    // Determina si un input o textarea debe convertirse a mayúsculas automáticamente
    const shouldUppercase = (element) => {
        // Excluye elementos con clases o atributos de omisión
        if (element.classList.contains('no-uppercase') || element.hasAttribute('data-no-uppercase')) return false;
 
        const name = (element.getAttribute('name') || element.id || '').toLowerCase();
        const type = (element.getAttribute('type') || '').toLowerCase();
 
        // Excluye tipos de datos específicos que no requieren conversión a mayúsculas
        if (['email', 'tel', 'number', 'date', 'time', 'hidden', 'checkbox', 'radio'].includes(type)) return false;
        if (name.includes('correo') || name.includes('telefono') || name.includes('lat') || name.includes('lng')) return false;
        
        // Aplica a campos de texto generales y textareas
        return element.matches('input[type="text"], input:not([type]), textarea, .text-uppercase-input');
    };
 
    // Aplica la conversión automática a mayúsculas en tiempo real preservando el cursor
    document.querySelectorAll('input, textarea').forEach((element) => {
        if (!shouldUppercase(element)) return;
 
        element.classList.add('text-uppercase-input');
        element.addEventListener('input', () => {
            const start = element.selectionStart;
            const end = element.selectionEnd;
            element.value = element.value.toLocaleUpperCase('es-MX');
            if (start !== null && end !== null) element.setSelectionRange(start, end);
        });
    });
 
    // Inicializar selectores de diseño personalizado de forma automática
    initializeCustomSelects();
});
 
// ── FUNCIONES DE LIMPIEZA Y SANITIZACIÓN DE CAMPOS ──

// Elimina emojis del texto usando expresiones regulares
function stripEmojis(val) {
    if (!val) return '';
    return val.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
}
 
// Deja solo letras y espacios en español (incluye acentos, ñ, ü) y colapsa espacios dobles
function sanitizeLettersOnly(val) {
    let clean = stripEmojis(val);
    clean = clean.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
    return clean.replace(/\s+/g, ' ');
}
 
// Deja únicamente dígitos numéricos en la cadena
function sanitizeDigitsOnly(val) {
    if (!val) return '';
    return val.replace(/\D/g, '');
}
 
// Permite solo números y un único punto decimal
function sanitizeDecimalOnly(val) {
    let clean = stripEmojis(val);
    clean = clean.replace(/[^0-9.]/g, '');
    const parts = clean.split('.');
    // Si hay más de un punto decimal, une el primero y remueve el resto
    if (parts.length > 2) {
        clean = parts[0] + '.' + parts.slice(1).join('');
    }
    return clean;
}
 
// Permite caracteres alfanuméricos, espacios, guiones y diagonales
function sanitizeAlphanumericDash(val) {
    let clean = stripEmojis(val);
    clean = clean.replace(/[^a-zA-Z0-9\s\-/]/g, '');
    return clean.replace(/\s+/g, ' ');
}
 
// Elimina caracteres comúnmente utilizados en inyecciones de código (XSS, HTML)
function sanitizeGeneralText(val) {
    let clean = stripEmojis(val);
    clean = clean.replace(/[<>[\]{}$%^*+=|\\~`]/g, '');
    return clean;
}
 
// Valida que el correo tenga formato correcto y pertenezca a dominios comerciales conocidos
function validateEmailDomain(email) {
    const val = email.trim().toLowerCase();
    if (!val) return true;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(val)) return false;
    
    const allowedEmailDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];
    const domain = val.split('@')[1];
    return allowedEmailDomains.includes(domain);
}
 
// ── EFECTO DE STEPPER FLOTANTE / PEGAJOSO (STICKY) ──

// Hace que el indicador de pasos (stepper) flote dinámicamente debajo del navbar
function initStepperFloat(stepperSelector = '.stepper') {
    const stepper = document.querySelector(stepperSelector);
    if (!stepper) return;
 
    const navbar = document.querySelector('.cavex-navbar');
    const NAVBAR_H = navbar ? navbar.offsetHeight : 92;
    document.documentElement.style.setProperty('--navbar-h', NAVBAR_H + 'px');
    let stepperNaturalTop = 0;
    let stepperH = 0;
    let floating = false;
 
    // Crea un contenedor invisible (placeholder) para evitar el salto brusco del contenido al flotar
    let placeholder = stepper.parentNode.querySelector('.stepper-placeholder');
    if (!placeholder) {
        placeholder = document.createElement('div');
        placeholder.className = 'stepper-placeholder';
        stepper.parentNode.insertBefore(placeholder, stepper.nextSibling);
    }
 
    // Recalcula la posición original del stepper en el documento
    function recalculate() {
        if (!floating) {
            stepperNaturalTop = stepper.getBoundingClientRect().top + window.scrollY;
            stepperH = stepper.offsetHeight;
        }
    }
 
    // Evalúa si corresponde aplicar o quitar la clase de flotación según el scroll del usuario
    function onScroll() {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const shouldFloat = scrollY + NAVBAR_H > stepperNaturalTop;
 
        if (shouldFloat && !floating) {
            floating = true;
            placeholder.style.height = stepperH + 'px';
            placeholder.classList.add('visible');
            stepper.classList.add('is-floating');
        } else if (!shouldFloat && floating) {
            floating = false;
            placeholder.classList.remove('visible');
            stepper.classList.remove('is-floating');
        }
    }
 
    requestAnimationFrame(() => {
        recalculate();
        onScroll();
    });
 
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { floating = false; stepper.classList.remove('is-floating'); recalculate(); }, { passive: true });
}
 
// ── COMPONENTE DROPDOWN (SELECT) PERSONALIZADO ──

// Transforma los selects HTML nativos en elementos estilizados y dinámicos
function initializeCustomSelects() {
    document.querySelectorAll('.form-group select, select.form-select').forEach(select => {
        if (select.dataset.customSelectInitialized) return;
        select.dataset.customSelectInitialized = "true";
 
        // Envuelve el select original para controlarlo
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
 
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);
        select.style.display = 'none'; // Oculta el select nativo
 
        // Crea el disparador visual del dropdown (el botón que se muestra)
        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        
        const triggerText = document.createElement('span');
        triggerText.className = 'custom-select-trigger-text';
        triggerText.textContent = select.options[select.selectedIndex] ? select.options[select.selectedIndex].textContent : 'Seleccionar...';
        trigger.appendChild(triggerText);
 
        const arrow = document.createElement('span');
        arrow.className = 'custom-select-arrow';
        arrow.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s;"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
        trigger.appendChild(arrow);
        wrapper.appendChild(trigger);
 
        // Crea el contenedor que contendrá las opciones customizadas
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'custom-select-options';
 
        // Regenera la lista de opciones customizadas basándose en el select nativo
        const rebuildOptions = () => {
            optionsContainer.innerHTML = '';
            Array.from(select.options).forEach((opt, idx) => {
                const optDiv = document.createElement('div');
                optDiv.className = 'custom-select-option';
                optDiv.textContent = opt.textContent;
                optDiv.dataset.value = opt.value;
                optDiv.dataset.index = idx;
 
                // Controla la opción deshabilitada
                if (opt.disabled) {
                    optDiv.classList.add('disabled');
                    optDiv.style.opacity = '0.5';
                    optDiv.style.cursor = 'not-allowed';
                }
                // Resalta la opción seleccionada
                if (opt.selected) {
                    optDiv.classList.add('selected');
                }
 
                // Evento click al elegir una opción customizada
                optDiv.addEventListener('click', (e) => {
                    if (opt.disabled) return;
                    e.stopPropagation();
 
                    // Sincroniza la selección en el select oculto nativo
                    select.selectedIndex = idx;
                    triggerText.textContent = opt.textContent;
 
                    optionsContainer.querySelectorAll('.custom-select-option').forEach(el => el.classList.remove('selected'));
                    optDiv.classList.add('selected');
 
                    optionsContainer.classList.remove('show');
                    trigger.classList.remove('active');
 
                    // Dispara el evento change nativo para que reaccionen otras funciones JS vinculadas
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                });
 
                optionsContainer.appendChild(optDiv);
            });
        };
 
        rebuildOptions();
        wrapper.appendChild(optionsContainer);
 
        // Evento para abrir y cerrar el dropdown
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            // Cierra cualquier otro custom select que esté abierto
            document.querySelectorAll('.custom-select-options.show').forEach(openContainer => {
                if (openContainer !== optionsContainer) {
                    openContainer.classList.remove('show');
                    openContainer.previousSibling.classList.remove('active');
                }
            });
 
            rebuildOptions();
            optionsContainer.classList.toggle('show');
            trigger.classList.toggle('active');
        });
 
        // MutationObserver para reconstruir las opciones cuando el select original cambie dinámicamente (ej. cargas en cascada)
        const observer = new MutationObserver(() => {
            rebuildOptions();
            const currentSelOpt = select.options[select.selectedIndex];
            triggerText.textContent = currentSelOpt ? currentSelOpt.textContent : 'Seleccionar...';
        });
        observer.observe(select, { childList: true, subtree: true });
 
        // Escucha cambios manuales sobre el select nativo para mantener actualizada la UI personalizada
        select.addEventListener('change', () => {
            const currentSelOpt = select.options[select.selectedIndex];
            triggerText.textContent = currentSelOpt ? currentSelOpt.textContent : 'Seleccionar...';
            optionsContainer.querySelectorAll('.custom-select-option').forEach((el, index) => {
                if (index === select.selectedIndex) {
                    el.classList.add('selected');
                } else {
                    el.classList.remove('selected');
                }
            });
        });
    });
}
 
// Cierra todos los selectores personalizados si el usuario hace click fuera de ellos
document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select-options.show').forEach(container => {
        container.classList.remove('show');
        container.previousSibling.classList.remove('active');
    });
});
 
// Exporta la función globalmente para inicializar selects que carguen dinámicamente
window.initializeCustomSelects = initializeCustomSelects;

// Sanitiza el valor de un elemento de entrada usando la función provista, preservando la posición del cursor
function sanitizeInputElement(el, fn) {
    if (!el) return;
    const originalVal = el.value;
    const cleanedVal = fn(originalVal);
    if (originalVal !== cleanedVal) {
        const selectionStart = el.selectionStart;
        const selectionEnd = el.selectionEnd;
        el.value = cleanedVal;
        try {
            el.setSelectionRange(selectionStart, selectionEnd);
        } catch (err) {}
    }
}
window.sanitizeInputElement = sanitizeInputElement;

// Registra manejadores de eventos (input, paste, blur) para sanitizar automáticamente un elemento de entrada
function registerSanitizer(el, fn) {
    if (!el) return;
    const handler = () => sanitizeInputElement(el, fn);
    el.addEventListener('input', handler);
    el.addEventListener('paste', () => setTimeout(handler, 0));
    el.addEventListener('blur', () => {
        el.value = el.value.trim();
        handler();
    });
}
window.registerSanitizer = registerSanitizer;

// Escapa caracteres especiales de HTML para prevenir inyecciones de código (XSS)
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
window.escapeHtml = escapeHtml;

// Decodifica cadenas con problemas de mojibake (caracteres extraños por codificación incorrecta UTF-8)
function decodeUtf8Mojibake(str) {
    if (!str) return '';
    try {
        return decodeURIComponent(escape(str));
    } catch (e) {
        return str;
    }
}
window.decodeUtf8Mojibake = decodeUtf8Mojibake;

// Convierte un texto a formato de título (Capitalización Primera Letra), conservando CURP/RFC originales
function toTitleCase(str) {
    if (!str || str === '—') return '—';
    const decoded = decodeUtf8Mojibake(str).trim();
    if (!decoded) return '—';
    
    // Si coincide con patrón de CURP o RFC o es completamente numérico, mantener en mayúsculas u original
    if (/^[A-Z]{4}\d{6}[A-Z\d]{8}$/i.test(decoded)) return decoded.toUpperCase();
    if (/^[A-Z]{3,4}\d{6}[A-Z\d]{3}$/i.test(decoded)) return decoded.toUpperCase();
    if (/^\d+$/.test(decoded)) return decoded;
    
    return decoded
        .toLowerCase()
        .split(/\s+/)
        .map(word => {
            if (!word) return '';
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}
window.toTitleCase = toTitleCase;

// Formatea un número agregándole comas como separadores de miles
function formatNumberWithComas(val) {
    if (val === null || val === undefined) return '';
    let clean = val.toString().replace(/,/g, '');
    let parts = clean.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
}
window.formatNumberWithComas = formatNumberWithComas;

