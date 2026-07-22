let gasolineras = [];
let editingId = null;
let currentPage = 1;
let pageSize = 10;
let searchQuery = "";

document.addEventListener("DOMContentLoaded", async () => {
    wireFormInputs();
    await loadGasolinerasFromServer();
    resetForm();
});

async function loadGasolinerasFromServer() {
    try {
        const response = await fetch("/Gasolina/Gasolineras/GetGasolineras", {
            method: "GET",
            headers: { "Accept": "application/json" }
        });

        const result = await response.json();

        if (!result.success) {
            showError(result.message || "No fue posible cargar las gasolineras.");
            return;
        }

        gasolineras = (result.data || []).map(item => {
            return {
                id: item.id,
                nombre: item.strValor || item.StrValor || "",
                descripcion: item.strDescripcion || item.StrDescripcion || ""
            };
        });

        renderGasolineras();
    } catch (error) {
        console.error(error);
        showError("Ocurrió un error al cargar las gasolineras.");
    }
}

function wireFormInputs() {
    const nombreInput = document.getElementById("strNombreGasolinera");
    const descInput = document.getElementById("strDescripcionGasolinera");

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

function renderGasolineras() {
    const tbody = document.getElementById("gasolinerasTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    const filtered = gasolineras.filter(g => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return g.nombre.toLowerCase().includes(query)
                || (g.descripcion || "").toLowerCase().includes(query);
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
                        <p class="m-0 font-weight-700">No se encontraron gasolineras</p>
                        <small>Prueba ajustando la búsqueda</small>
                    </div>
                </td>
            </tr>`;
    } else {
        pagedList.forEach(g => {
            const tr = document.createElement("tr");
            const descText = g.descripcion || "Sin descripción";
            const truncatedDesc = descText.length > 80 ? `${descText.substring(0, 80)}...` : descText;

            tr.innerHTML = `
                <td>
                    <div class="cotizacion-main-text">${escapeHtml(g.nombre)}</div>
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
                                <button class="dropdown-item d-flex align-items-center" type="button" onclick="editGasolinera(${g.id})">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2 text-primary"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    Editar
                                </button>
                            </li>
                            <li>
                                <button class="dropdown-item d-flex align-items-center text-danger" type="button" onclick="deleteGasolinera(${g.id})">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2 text-danger"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                                    Eliminar
                                </button>
                            </li>
                        </ul>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    const startIndexText = totalRecords > 0 ? startIndex + 1 : 0;
    setText("paginationInfo", `Mostrando ${startIndexText}-${endIndex} de ${totalRecords} registros`);
    
    const countPill = document.querySelector(".table-module .records-pill");
    if (countPill) countPill.textContent = `${totalRecords} gasolineras`;

    renderPagination(totalPages);

    // Inicializar dropdowns de acciones con estrategia 'fixed' para prevenir recortes
    document.querySelectorAll('#gasolinerasTableBody .btn-action-trigger').forEach(el => {
        new bootstrap.Dropdown(el, {
            popperConfig: (defaultConfig) => ({ ...defaultConfig, strategy: 'fixed' })
        });
    });
}

function renderPagination(totalPages) {
    const paginationList = document.getElementById("paginationList");
    if (!paginationList) return;

    paginationList.innerHTML = "";
    if (totalPages <= 1) return;

    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(event, ${currentPage - 1})">&laquo;</a>`;
    paginationList.appendChild(prevLi);

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === currentPage ? "active" : ""}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(event, ${i})">${i}</a>`;
        paginationList.appendChild(li);
    }

    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(event, ${currentPage + 1})">&raquo;</a>`;
    paginationList.appendChild(nextLi);
}

function changePage(e, page) {
    if (e) e.preventDefault();
    if (page < 1) return;
    currentPage = page;
    renderGasolineras();
}

function handleSearch(val) {
    searchQuery = val || "";
    currentPage = 1;
    renderGasolineras();
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const nombreInput = document.getElementById("strNombreGasolinera");
    const descInput = document.getElementById("strDescripcionGasolinera");

    clearValidation();

    const nombreVal = nombreInput ? nombreInput.value.trim() : "";
    const descVal = descInput ? descInput.value.trim() : "";

    if (!nombreVal) {
        if (nombreInput) {
            nombreInput.classList.add("is-invalid");
            nombreInput.focus();
        }
        return;
    }

    const regexLettersOnly = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    if (!regexLettersOnly.test(nombreVal)) {
        if (nombreInput) {
            nombreInput.classList.add("is-invalid");
            const feedback = document.getElementById("nombreFeedback");
            if (feedback) feedback.textContent = "El nombre solo debe contener letras y espacios.";
            nombreInput.focus();
        }
        return;
    }

    const nombreLower = nombreVal.toLowerCase();
    const duplicate = gasolineras.some(g => g.nombre.toLowerCase() === nombreLower && g.id !== editingId);
    if (duplicate) {
        if (nombreInput) {
            nombreInput.classList.add("is-invalid");
            const feedback = document.getElementById("nombreFeedback");
            if (feedback) feedback.textContent = "El nombre de la gasolinera ya existe.";
            nombreInput.focus();
        }
        return;
    }

    if (nombreInput) nombreInput.classList.add("is-valid");

    const isEdit = editingId !== null;
    const url = isEdit ? "/Gasolina/Gasolineras/Actualizar" : "/Gasolina/Gasolineras/Crear";

    const payload = {
        Id: editingId || 0,
        StrValor: nombreVal,
        StrDescripcion: descVal
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
            Swal.fire({
                icon: "success",
                title: "Éxito",
                text: isEdit ? "Gasolinera actualizada correctamente." : "Gasolinera guardada correctamente.",
                confirmButtonColor: "var(--teal-cavex)"
            });

            resetForm();
            await loadGasolinerasFromServer();
        } else {
            showError(result.message || "No se pudo guardar la información.");
        }
    } catch (error) {
        console.error(error);
        showError("Ocurrió un error al guardar la gasolinera.");
    }
}

function editGasolinera(id) {
    const item = gasolineras.find(g => g.id === id);
    if (!item) return;

    clearValidation();
    editingId = id;

    const nombreInput = document.getElementById("strNombreGasolinera");
    const descInput = document.getElementById("strDescripcionGasolinera");
    const formTitle = document.getElementById("formTitle");
    const formSub = document.getElementById("formSubtitle");
    const btnSubmit = document.querySelector("#formGasolinera button[type='submit']");

    if (nombreInput) nombreInput.value = item.nombre;
    if (descInput) descInput.value = item.descripcion || "";

    if (formTitle) formTitle.textContent = "Editar gasolinera";
    if (formSub) formSub.textContent = "Modifica los campos de la gasolinera.";
    if (btnSubmit) btnSubmit.textContent = "Guardar cambios";

    document.querySelector('.filter-card').scrollIntoView({ behavior: 'smooth' });
    if (nombreInput) nombreInput.focus();
}

function deleteGasolinera(id) {
    Swal.fire({
        title: "¿Deseas eliminar esta gasolinera?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then(async (res) => {
        if (res.isConfirmed) {
            try {
                const response = await fetch(`/Gasolina/Gasolineras/Eliminar/${id}`, {
                    method: "POST"
                });
                const result = await response.json();

                if (result.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Eliminado",
                        text: "Gasolinera eliminada correctamente.",
                        confirmButtonColor: "var(--teal-cavex)"
                    });
                    if (editingId === id) resetForm();
                    await loadGasolinerasFromServer();
                } else {
                    showError(result.message || "No fue posible eliminar la gasolinera.");
                }
            } catch (err) {
                console.error(err);
                showError("Ocurrió un error al intentar eliminar.");
            }
        }
    });
}

function resetForm() {
    editingId = null;
    clearValidation();

    const form = document.getElementById("formGasolinera");
    if (form) form.reset();

    const formTitle = document.getElementById("formTitle");
    const formSub = document.getElementById("formSubtitle");
    const btnSubmit = document.querySelector("#formGasolinera button[type='submit']");

    if (formTitle) formTitle.textContent = "Registrar gasolinera";
    if (formSub) formSub.textContent = "Ingresa el nombre y la descripción para registrar la gasolinera.";
    if (btnSubmit) btnSubmit.textContent = "Guardar gasolinera";
}

function clearValidation() {
    const inputs = document.querySelectorAll("#formGasolinera .form-control");
    inputs.forEach(input => {
        input.classList.remove("is-invalid", "is-valid");
    });
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function showError(msg) {
    Swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
        confirmButtonColor: "var(--teal-cavex)"
    });
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
