let responsables = [];
let editingId = null;
let currentPage = 1;
let pageSize = 10;
let searchQuery = "";

document.addEventListener("DOMContentLoaded", async () => {
    wireFormInputs();
    await loadResponsablesFromServer();
    resetForm();
});

async function loadResponsablesFromServer() {
    try {
        const response = await fetch("/Vehiculos/ResponsablesServicio/GetResponsables", {
            method: "GET",
            headers: { "Accept": "application/json" }
        });

        const result = await response.json();

        if (!result.success) {
            showError(result.message || "No fue posible cargar los responsables.");
            return;
        }

        responsables = (result.data || []).map(item => {
            return {
                id: item.id,
                nombre: item.strValor || item.StrValor || "",
                descripcion: item.strDescripcion || item.StrDescripcion || ""
            };
        });

        renderResponsables();
    } catch (error) {
        console.error(error);
        showError("Ocurrio un error al cargar los responsables.");
    }
}

function wireFormInputs() {
    const nombreInput = document.getElementById("strNombre");
    const descInput = document.getElementById("strDescripcion");

    if (nombreInput) {
        if (typeof registerSanitizer === "function" && typeof sanitizeLettersOnly === "function") {
            registerSanitizer(nombreInput, sanitizeLettersOnly);
        }
        nombreInput.addEventListener("input", () => {
            nombreInput.classList.remove("is-invalid", "is-valid");
        });
    }
 
    if (descInput) {
        if (typeof registerSanitizer === "function" && typeof sanitizeGeneralText === "function") {
            registerSanitizer(descInput, sanitizeGeneralText);
        }
        descInput.addEventListener("input", () => {
            descInput.classList.remove("is-invalid", "is-valid");
        });
    }
}

function renderResponsables() {
    const tbody = document.getElementById("responsablesTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    const filtered = responsables.filter(r => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return r.nombre.toLowerCase().includes(query)
                || (r.descripcion || "").toLowerCase().includes(query);
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
                        <p class="m-0 font-weight-700">No se encontraron responsables</p>
                        <small>Prueba ajustando la búsqueda</small>
                    </div>
                </td>
            </tr>`;
    } else {
        pagedList.forEach(r => {
            const tr = document.createElement("tr");
            const descText = r.descripcion || "Sin descripcion";
            const truncatedDesc = descText.length > 80 ? `${descText.substring(0, 80)}...` : descText;

            tr.innerHTML = `
                <td>
                    <div class="cotizacion-main-text">${escapeHtml(r.nombre)}</div>
                </td>
                <td>
                    <div class="description-text" title="${escapeHtml(descText)}">${escapeHtml(truncatedDesc)}</div>
                </td>
                <td class="text-end">
                    <div class="dropdown actions-dropdown d-inline-block">
                        <button class="btn-action-trigger btn-sm" type="button" data-bs-toggle="dropdown" data-bs-boundary="viewport" aria-expanded="false">
                            <span>Acciones</span>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                                <button class="dropdown-item d-flex align-items-center" type="button" onclick="editResponsable(${r.id})">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2 text-primary"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    Editar
                                </button>
                            </li>
                            <li>
                                <button class="dropdown-item d-flex align-items-center text-danger" type="button" onclick="deleteResponsable(${r.id})">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2 text-danger"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                                    Eliminar
                                </button>
                            </li>
                        </ul>
                    </div>
                </td>`;

            tbody.appendChild(tr);
        });
    }

    setText(
        "paginationInfo",
        totalRecords > 0
            ? `Mostrando ${startIndex + 1}-${endIndex} de ${totalRecords} registros`
            : "Mostrando 0-0 de 0 registros"
    );

    const countPill = document.querySelector(".table-module .records-pill");
    if (countPill) countPill.textContent = `${totalRecords} responsables`;

    const extraPill = document.querySelector(".table-module .records-pill-soft");
    if (extraPill) extraPill.textContent = `Pagina ${currentPage} de ${totalPages}`;

    renderPagination(totalPages);

    // Inicializar dropdowns de acciones con estrategia 'fixed' para prevenir recortes
    document.querySelectorAll('#responsablesTableBody .btn-action-trigger').forEach(el => {
        new bootstrap.Dropdown(el, {
            popperConfig: (defaultConfig) => {
                return {
                    ...defaultConfig,
                    strategy: 'fixed'
                };
            }
        });
    });
}

function renderPagination(totalPages) {
    const paginationList = document.getElementById("paginationList");
    if (!paginationList) return;

    paginationList.innerHTML = "";
    if (totalPages <= 1) return;

    paginationList.appendChild(createPageItem("Anterior", currentPage - 1, currentPage === 1));

    for (let i = 1; i <= totalPages; i++) {
        paginationList.appendChild(createPageItem(String(i), i, false, currentPage === i));
    }

    paginationList.appendChild(createPageItem("Siguiente", currentPage + 1, currentPage === totalPages));
}

function createPageItem(text, page, disabled, active) {
    const li = document.createElement("li");
    li.className = `page-item ${disabled ? "disabled" : ""} ${active ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#" onclick="changePage(event, ${page})">${text}</a>`;
    return li;
}

function changePage(event, page) {
    if (event) event.preventDefault();
    currentPage = page;
    renderResponsables();
}

function handleSearch(query) {
    searchQuery = query || "";
    currentPage = 1;
    renderResponsables();
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const nombreInput = document.getElementById("strNombre");
    const descInput = document.getElementById("strDescripcion");

    if (!nombreInput) return;

    const nombre = nombreInput.value.trim();
    const descripcion = descInput ? descInput.value.trim() : "";

    if (!nombre) {
        nombreInput.classList.add("is-invalid");
        nombreInput.classList.remove("is-valid");
        const feedback = document.getElementById("nombreFeedback");
        if (feedback) feedback.textContent = "El nombre del responsable es obligatorio.";
        nombreInput.focus();
        return;
    }

    const nombreLower = nombre.toLowerCase().trim();
    const existeDuplicado = responsables.some(r => r.nombre.toLowerCase().trim() === nombreLower && r.id !== editingId);

    if (existeDuplicado) {
        nombreInput.classList.add("is-invalid");
        nombreInput.classList.remove("is-valid");
        const feedback = document.getElementById("nombreFeedback");
        if (feedback) feedback.textContent = "El nombre del responsable ya existe.";
        nombreInput.focus();
        return;
    }

    const payload = {
        strValor: nombre,
        strDescripcion: descripcion
    };

    if (editingId !== null) {
        payload.id = editingId;
    }

    const url = editingId === null
        ? "/Vehiculos/ResponsablesServicio/SaveResponsable"
        : "/Vehiculos/ResponsablesServicio/UpdateResponsable";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!result.success) {
            showError(result.message || "No fue posible guardar el responsable.");
            return;
        }

        Swal.fire({
            icon: "success",
            title: editingId === null ? "Registro exitoso" : "Actualizacion exitosa",
            text: editingId === null ? "Responsable agregado exitosamente." : "Responsable actualizado exitosamente.",
            confirmButtonColor: "var(--teal-cavex)"
        });

        resetForm();
        await loadResponsablesFromServer();
    } catch (error) {
        console.error(error);
        showError("Ocurrio un error al guardar el responsable.");
    }
}

function editResponsable(id) {
    const responsable = responsables.find(r => r.id === id);
    if (!responsable) return;

    clearValidation();
    editingId = id;

    document.getElementById("strNombre").value = responsable.nombre;

    const descInput = document.getElementById("strDescripcion");
    if (descInput) descInput.value = responsable.descripcion || "";

    setText("formTitle", "Editar responsable");
    setText("formSubtitle", "Modifica los detalles del responsable seleccionado.");
    setText("btnSubmit", "Guardar cambios");

    const btnCancel = document.getElementById("btnCancel");
    if (btnCancel) btnCancel.style.display = "inline-block";

    const formCard = document.querySelector(".filter-card");
    if (formCard) formCard.scrollIntoView({ behavior: "smooth" });

    document.getElementById("strNombre").focus();
}

function deleteResponsable(id) {
    Swal.fire({
        title: "¿Estas seguro?",
        text: "No podras revertir esta accion.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "Cancelar"
    }).then(async result => {
        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`/Vehiculos/ResponsablesServicio/DeleteResponsable?id=${id}`, {
                method: "POST",
                headers: { "Accept": "application/json" }
            });

            const data = await response.json();

            if (!data.success) {
                showError(data.message || "No fue posible eliminar al responsable.");
                return;
            }

            Swal.fire({
                icon: "success",
                title: "Eliminado",
                text: "El responsable ha sido eliminado exitosamente.",
                confirmButtonColor: "var(--teal-cavex)"
            });

            if (editingId === id) resetForm();
            await loadResponsablesFromServer();
        } catch (error) {
            console.error(error);
            showError("Ocurrio un error al eliminar al responsable.");
        }
    });
}

function resetForm() {
    editingId = null;
    clearValidation();

    const form = document.getElementById("formResponsableServicio");
    if (form) form.reset();

    setText("formTitle", "Registrar responsable de servicio");
    setText("formSubtitle", "Ingresa el nombre y la descripcion para registrar el responsable de servicio.");
    setText("btnSubmit", "Guardar responsable");

    const btnCancel = document.getElementById("btnCancel");
    if (btnCancel) btnCancel.style.display = "none";
}

function clearValidation() {
    document.getElementById("strNombre")?.classList.remove("is-invalid", "is-valid");
    document.getElementById("strDescripcion")?.classList.remove("is-invalid", "is-valid");
}

function escapeHtml(string) {
    return String(string)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function showError(message) {
    Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        confirmButtonColor: "var(--teal-cavex)"
    });
}
