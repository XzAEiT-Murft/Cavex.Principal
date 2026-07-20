let marcas = [];
let editingId = null;

// Variables de paginación y búsqueda
let currentPage = 1;
let pageSize = 10;
let searchQuery = '';

// Renderizado inicial de la tabla cargando datos del servidor
document.addEventListener('DOMContentLoaded', () => {
    loadMarcasFromServer();
    
    // Aplicación en tiempo real utilizando las funciones globales de site.js
    const nombreInput = document.getElementById('strNombre');
    const descInput = document.getElementById('strDescripcion');
    
    if (nombreInput) {
        registerSanitizer(nombreInput, sanitizeGeneralText);
        nombreInput.addEventListener('input', () => {
            nombreInput.classList.remove('is-invalid', 'is-valid');
        });
    }
    
    if (descInput) {
        registerSanitizer(descInput, sanitizeGeneralText);
        descInput.addEventListener('input', () => {
            descInput.classList.remove('is-invalid', 'is-valid');
        });
    }

    resetForm();
});

function loadMarcasFromServer() {
    const url = `/Marcas/GetMarcas?pagina=1&search=${encodeURIComponent(searchQuery)}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(result => {
            if (result.success) {
                if (result.data && Array.isArray(result.data)) {
                    marcas = result.data.map(item => ({
                        id: item.id ?? item.Id,
                        nombre: item.strValor ?? item.StrValor ?? '',
                        descripcion: item.strDescripcion ?? item.StrDescripcion ?? ''
                    }));
                } else {
                    marcas = [];
                }
                renderMarcas();
            } else {
                console.error("Error al cargar marcas desde base de datos:", result.message);
                marcas = [];
                renderMarcas();
            }
        })
        .catch(err => {
            console.error("Error en petición:", err);
            marcas = [];
            renderMarcas();
        });
}

// Función para renderizar las marcas
function renderMarcas() {
    const tbody = document.getElementById('marcasTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const filtered = marcas.filter(m => {
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return m.nombre.toLowerCase().includes(q) || (m.descripcion || '').toLowerCase().includes(q);
        }
        return true;
    });

    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / pageSize) || 1;
    
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalRecords);
    const pagedList = filtered.slice(startIndex, endIndex);

    if (pagedList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center py-5">
                    <div class="text-muted">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mb-2 opacity-50"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                        <p class="m-0 font-weight-700">No se encontraron marcas</p>
                        <small>Prueba ajustando la búsqueda</small>
                    </div>
                </td>
            </tr>
        `;
    } else {
        pagedList.forEach(m => {
            const tr = document.createElement('tr');
            
            const descText = m.descripcion || 'Sin descripción';
            const truncatedDesc = m.descripcion && m.descripcion.length > 50 
                ? m.descripcion.substring(0, 50) + '...' 
                : descText;
            const descTitle = m.descripcion ? `title="${escapeHtml(m.descripcion)}"` : '';

            tr.innerHTML = `
                <td>
                    <div class="cotizacion-main-text">${escapeHtml(m.nombre)}</div>
                </td>
                <td>
                    <div class="description-text" ${descTitle}>${escapeHtml(truncatedDesc)}</div>
                </td>
                <td class="text-end">
                    <div class="dropdown actions-dropdown d-inline-block">
                        <button class="btn-action-trigger btn-sm" type="button" data-bs-toggle="dropdown" data-bs-boundary="viewport" aria-expanded="false">
                            <span>Acciones</span>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                                <button class="dropdown-item d-flex align-items-center" type="button" onclick="editMarca(${m.id})">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2 text-primary"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    Editar
                                </button>
                            </li>
                            <li>
                                <button class="dropdown-item d-flex align-items-center text-danger" type="button" onclick="deleteMarca(${m.id})">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2 text-danger"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    <span>Eliminar</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Actualizar contadores e información en barra inferior
    const infoText = totalRecords > 0 
        ? `Mostrando ${startIndex + 1}-${endIndex} de ${totalRecords} registros`
        : 'Mostrando 0-0 de 0 registros';
    
    const infoElement = document.getElementById('paginationInfo');
    if (infoElement) infoElement.textContent = infoText;

    const countPill = document.querySelector('.table-module .records-pill');
    if (countPill) countPill.textContent = `${totalRecords} marcas`;

    renderPagination(totalPages);

    // Inicializar dropdowns de acciones con estrategia 'fixed' para prevenir recortes
    document.querySelectorAll('#marcasTableBody .btn-action-trigger').forEach(el => {
        new bootstrap.Dropdown(el, {
            popperConfig: (defaultConfig) => ({ ...defaultConfig, strategy: 'fixed' })
        });
    });
}

// Función para renderizar los números de página
function renderPagination(totalPages) {
    const paginationList = document.getElementById('paginationList');
    if (!paginationList) return;

    paginationList.innerHTML = '';
    if (totalPages <= 1) return;

    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(event, ${currentPage - 1})">&laquo;</a>`;
    paginationList.appendChild(prevLi);

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(event, ${i})">${i}</a>`;
        paginationList.appendChild(li);
    }

    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(event, ${currentPage + 1})">&raquo;</a>`;
    paginationList.appendChild(nextLi);
}

function changePage(event, page) {
    if (event) event.preventDefault();
    if (page < 1) return;
    currentPage = page;
    renderMarcas();
}

function handleSearch(query) {
    searchQuery = query || '';
    currentPage = 1;
    renderMarcas();
}

function handleFormSubmit(e) {
    e.preventDefault();

    const nombreInput = document.getElementById('strNombre');
    const descInput = document.getElementById('strDescripcion');

    clearValidation();

    const nombre = nombreInput.value.trim();
    const descripcion = descInput.value.trim();

    if (!nombre) {
        nombreInput.classList.add('is-invalid');
        const feedback = document.getElementById('nombreFeedback');
        if (feedback) feedback.textContent = 'El nombre de la marca es obligatorio.';
        nombreInput.focus();
        return;
    }

    // Validar si ya existe otra marca con el mismo nombre (ignora mayúsculas/minúsculas)
    const nombreLower = nombre.toLowerCase().trim();
    const existeDuplicado = marcas.some(m => m.nombre.toLowerCase().trim() === nombreLower && m.id !== editingId);
    
    if (existeDuplicado) {
        nombreInput.classList.add('is-invalid');
        const feedback = document.getElementById('nombreFeedback');
        if (feedback) feedback.textContent = 'El nombre de la marca ya existe.';
        nombreInput.focus();
        return;
    }

    // Si todo es válido
    nombreInput.classList.add('is-valid');
    if (descripcion) descInput.classList.add('is-valid');

    const url = editingId === null ? '/Marcas/SaveMarca' : '/Marcas/UpdateMarca';

    const payload = {
        id: editingId || 0,
        strValor: nombre,
        strDescripcion: descripcion
    };

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: editingId === null ? '¡Registro exitoso!' : '¡Actualización exitosa!',
                text: editingId === null ? 'Marca agregada exitosamente.' : 'Marca actualizada exitosamente.',
                confirmButtonColor: 'var(--teal-cavex)'
            });
            resetForm();
            loadMarcasFromServer();
        } else {
            nombreInput.classList.add('is-invalid');
            const feedback = document.getElementById('nombreFeedback');
            if (feedback) feedback.textContent = result.message || 'Error al guardar la marca.';

            Swal.fire({
                icon: 'error',
                title: 'No se pudo guardar',
                text: result.message || 'La marca no se pudo guardar.',
                confirmButtonColor: 'var(--teal-cavex)'
            });
        }
    })
    .catch(err => {
        console.error("Error al guardar la marca:", err);
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo procesar la solicitud. ¡Intenta de nuevo!',
            confirmButtonColor: 'var(--teal-cavex)'
        });
    });
}

// Cargar datos en el formulario para edición
function editMarca(id) {
    const marca = marcas.find(m => m.id === id);
    if (!marca) return;

    clearValidation();
    editingId = id;
    document.getElementById('strNombre').value = marca.nombre;
    document.getElementById('strDescripcion').value = marca.descripcion || '';

    document.getElementById('formTitle').textContent = 'Editar marca';
    document.getElementById('formSubtitle').textContent = 'Modifica los detalles de la marca seleccionada.';
    document.getElementById('btnSubmit').textContent = 'Guardar cambios';
    document.getElementById('btnCancel').style.display = 'inline-block';

    // Desplazar suavemente al formulario y enfocar el campo principal
    document.querySelector('.filter-card').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('strNombre').focus();
}

// Eliminar marca
function deleteMarca(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('/Marcas/DeleteMarca?id=' + id, {
                method: 'POST'
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Eliminado!',
                        text: 'La marca ha sido eliminada exitosamente.',
                        confirmButtonColor: 'var(--teal-cavex)'
                    });
                    if (editingId === id) {
                        resetForm();
                    }
                    loadMarcasFromServer();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'No se pudo eliminar',
                        text: result.message || 'Inténtalo de nuevo más tarde.',
                        confirmButtonColor: 'var(--teal-cavex)'
                    });
                }
            })
            .catch(err => {
                console.error("Error al eliminar la marca:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo procesar la solicitud. ¡Intenta de nuevo!',
                    confirmButtonColor: 'var(--teal-cavex)'
                });
            });
        }
    });
}

// Restablecer el formulario
function resetForm() {
    editingId = null;
    clearValidation();
    document.getElementById('formMarca').reset();

    document.getElementById('formTitle').textContent = 'Registrar marca';
    document.getElementById('formSubtitle').textContent = 'Ingresa el nombre y la descripción de la marca.';
    document.getElementById('btnSubmit').textContent = 'Guardar marca';
    document.getElementById('btnCancel').style.display = 'none';
}

function clearValidation() {
    const inputs = document.querySelectorAll('#formMarca .form-control');
    inputs.forEach(input => {
        input.classList.remove('is-invalid', 'is-valid');
    });
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
