let seguros = [];
let editingId = null;
let currentPage = 1;
let pageSize = 10;
let searchQuery = "";

document.addEventListener("DOMContentLoaded", async () => {
    wireFormInputs();
    await loadSegurosFromServer();
    resetForm();
});

async function loadSegurosFromServer() {
    try {
        const response = await fetch("/Vehiculos/Seguros/GetSeguros", {
            method: "GET",
            headers: { "Accept": "application/json" }
        });

        const result = await response.json();

        if (!result.success) {
            showError(result.message || "No fue posible cargar las aseguradoras.");
            return;
        }

        seguros = (result.data || []).map(item => {
            return {
                id: item.id,
                nombre: item.strValor || item.StrValor || "",
                descripcion: item.strDescripcion || item.StrDescripcion || ""
            };
        });

        renderSeguros();
    } catch (error) {
        console.error(error);
        showError("Ocurrió un error al cargar las aseguradoras.");
    }
}

function wireFormInputs() {
    const nombreInput = document.getElementById("strNombreSeguro");
    const descInput = document.getElementById("strDescripcionSeguro");

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

function renderSeguros() {
    const tbody = document.getElementById("segurosTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    const filtered = seguros.filter(s => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return s.nombre.toLowerCase().includes(query)
                || (s.descripcion || "").toLowerCase().includes(query);
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
                        <p class="m-0 font-weight-700">No se encontraron aseguradoras</p>
                        <small>Prueba ajustando la búsqueda</small>
                    </div>
                </td>
            </tr>`;
    } else {
        pagedList.forEach(s => {
            const tr = document.createElement("tr");
            const descText = s.descripcion || "Sin descripción";
            const truncatedDesc = descText.length > 80 ? `${descText.substring(0, 80)}...` : descText;

            tr.innerHTML = `
                <td>
                    <div class="cotizacion-main-text">${escapeHtml(s.nombre)}</div>
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
                                <button class="dropdown-item d-flex align-items-center" type="button" onclick="editSeguro(${s.id})">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2 text-primary"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    Editar
                                </button>
                            </li>
                            <li>
                                <button class="dropdown-item d-flex align-items-center text-danger" type="button" onclick="deleteSeguro(${s.id})">
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
    if (countPill) countPill.textContent = `${totalRecords} aseguradoras`;

    const extraPill = document.querySelector(".table-module .records-pill-soft");
    if (extraPill) extraPill.textContent = `Página ${currentPage} de ${totalPages}`;

    renderPagination(totalPages);

    // Inicializar dropdowns de acciones con estrategia 'fixed' para prevenir recortes
    document.querySelectorAll('#segurosTableBody .btn-action-trigger').forEach(el => {
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
    renderSeguros();
}

function handleSearch(query) {
    searchQuery = query || "";
    currentPage = 1;
    renderSeguros();
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const nombreInput = document.getElementById("strNombreSeguro");
    const descInput = document.getElementById("strDescripcionSeguro");

    if (!nombreInput) return;

    const nombre = nombreInput.value.trim();
    const descripcion = descInput ? descInput.value.trim() : "";

    if (!nombre) {
        nombreInput.classList.add("is-invalid");
        nombreInput.classList.remove("is-valid");
        const feedback = document.getElementById("nombreFeedback");
        if (feedback) feedback.textContent = "El nombre de la aseguradora es obligatorio.";
        nombreInput.focus();
        return;
    }

    const nombreLower = nombre.toLowerCase().trim();
    const existeDuplicado = seguros.some(s => s.nombre.toLowerCase().trim() === nombreLower && s.id !== editingId);

    if (existeDuplicado) {
        nombreInput.classList.add("is-invalid");
        nombreInput.classList.remove("is-valid");
        const feedback = document.getElementById("nombreFeedback");
        if (feedback) feedback.textContent = "El nombre de la aseguradora ya existe.";
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
        ? "/Vehiculos/Seguros/SaveSeguro"
        : "/Vehiculos/Seguros/UpdateSeguro";

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
            showError(result.message || "No fue posible guardar la aseguradora.");
            return;
        }

        Swal.fire({
            icon: "success",
            title: editingId === null ? "Registro exitoso" : "Actualización exitosa",
            text: editingId === null ? "Aseguradora agregada exitosamente." : "Aseguradora actualizada exitosamente.",
            confirmButtonColor: "var(--teal-cavex)"
        });

        resetForm();
        await loadSegurosFromServer();
    } catch (error) {
        console.error(error);
        showError("Ocurrió un error al guardar la aseguradora.");
    }
}

function editSeguro(id) {
    const seguro = seguros.find(s => s.id === id);
    if (!seguro) return;

    clearValidation();
    editingId = id;

    document.getElementById("strNombreSeguro").value = seguro.nombre;

    const descInput = document.getElementById("strDescripcionSeguro");
    if (descInput) descInput.value = seguro.descripcion || "";

    setText("formTitle", "Editar aseguradora");
    setText("formSubtitle", "Modifica los detalles de la aseguradora seleccionada.");
    setText("btnSubmit", "Guardar cambios");

    const btnCancel = document.getElementById("btnCancel");
    if (btnCancel) btnCancel.style.display = "inline-block";

    const formCard = document.querySelector(".filter-card");
    if (formCard) formCard.scrollIntoView({ behavior: "smooth" });

    document.getElementById("strNombreSeguro").focus();
}

function deleteSeguro(id) {
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
            const response = await fetch(`/Vehiculos/Seguros/DeleteSeguro?id=${id}`, {
                method: "POST",
                headers: { "Accept": "application/json" }
            });

            const data = await response.json();

            if (!data.success) {
                showError(data.message || "No fue posible eliminar la aseguradora.");
                return;
            }

            Swal.fire({
                icon: "success",
                title: "Eliminado",
                text: "La aseguradora ha sido eliminada exitosamente.",
                confirmButtonColor: "var(--teal-cavex)"
            });

            if (editingId === id) resetForm();
            await loadSegurosFromServer();
        } catch (error) {
            console.error(error);
            showError("Ocurrió un error al eliminar la aseguradora.");
        }
    });
}

function resetForm() {
    editingId = null;
    clearValidation();

    const form = document.getElementById("formSeguro");
    if (form) form.reset();

    setText("formTitle", "Registrar aseguradora");
    setText("formSubtitle", "Ingresa el nombre y la descripción para registrar la compañía de seguros.");
    setText("btnSubmit", "Guardar aseguradora");

    const btnCancel = document.getElementById("btnCancel");
    if (btnCancel) btnCancel.style.display = "none";
}

function clearValidation() {
    document.getElementById("strNombreSeguro")?.classList.remove("is-invalid", "is-valid");
    document.getElementById("strDescripcionSeguro")?.classList.remove("is-invalid", "is-valid");
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
