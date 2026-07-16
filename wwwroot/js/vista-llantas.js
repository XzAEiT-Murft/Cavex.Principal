"use strict";

// Inicializador de eventos al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    inicializarVistaLlantas();
});

// Inicializa las validaciones, Drag & Drop y catálogos de la vista de Llantas
function inicializarVistaLlantas() {
    const form = document.getElementById("llantaVehiculoForm");
    if (!form) return;

    cargarCatalogosLlantas();
    inicializarCargaEvidencia();

    // Eventos de validación en tiempo real para todos los inputs/selects obligatorios
    form.querySelectorAll("input:not([type='file']):not([type='hidden']), select").forEach(campo => {
        ["input", "change"].forEach(evento => campo.addEventListener(evento, () => {
            const teniaError = campo.classList.contains("is-invalid");
            limpiarErrorCampo(campo);
            if (teniaError) validarCampoLlanta(campo);
        }));

        campo.addEventListener("blur", () => {
            if (campo.type !== "number" && campo.tagName !== "SELECT" && !campo.readOnly) {
                campo.value = campo.value.trim().replace(/\s{2,}/g, " ");
            }
            if (campo.required || campo.value) {
                validarCampoLlanta(campo);
            }
        });
    });

    // Envío asíncrono de los datos de la llanta a guardar en la base de datos
    form.addEventListener("submit", async event => {
        event.preventDefault();
        
        if (!validarFormularioLlanta(form)) {
            Swal.fire({
                icon: "warning",
                title: "Formulario incompleto",
                text: "Revisa los campos obligatorios antes de continuar.",
                confirmButtonColor: "var(--teal-cavex)"
            });
            return;
        }

        Swal.fire({
            title: "Registrando llanta...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const finVidaInput = document.getElementById("llanta-dteFechaFinVidaEstimada").value;
        const rotacionInput = document.getElementById("llanta-dteFechaRotacion").value;
        const sigRotacionInput = document.getElementById("llanta-dteFechaSiguienteRotacion").value;

        // Construcción del payload según el DTO VehControlLlantaSaveDto
        const payload = {
            idVehDatosGenerales: parseInt(document.getElementById("llanta-idVehDatosGenerales").value, 10),
            idVehCatMarcaLlanta: parseInt(document.getElementById("llanta-idVehCatMarcaLlanta").value, 10),
            strModelo: document.getElementById("llanta-strModelo").value,
            strMedida: document.getElementById("llanta-strMedida").value,
            dteFechaCompra: document.getElementById("llanta-dteFechaCompra").value,
            mnyCosto: parseFloat(document.getElementById("llanta-mnyCosto").value),
            idVehCatPosicionLlanta: parseInt(document.getElementById("llanta-idVehCatPosicionLlanta").value, 10),
            decKilometrajeActual: parseFloat(document.getElementById("llanta-decKilometrajeActual").value),
            dteFechaFinVidaEstimada: finVidaInput ? finVidaInput : null,
            dteFechaRotacion: rotacionInput ? rotacionInput : null,
            dteFechaSiguienteRotacion: sigRotacionInput ? sigRotacionInput : null,
            strUrlEvidencia: document.getElementById("llanta-strUrlEvidencia").value || null,
            idVehCatStatus: parseInt(document.getElementById("llanta-idVehCatStatus").value, 10)
        };

        try {
            const response = await fetch("/Vehiculos/SaveLlanta", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            Swal.close();

            if (!result.success) {
                Swal.fire({
                    icon: "error",
                    title: "Error al registrar",
                    text: result.message || "No fue posible registrar la llanta.",
                    confirmButtonColor: "var(--teal-cavex)"
                });
                return;
            }

            Swal.fire({
                icon: "success",
                title: "Llanta registrada",
                text: "Los datos de la llanta han sido registrados exitosamente en la base de datos.",
                confirmButtonColor: "var(--teal-cavex)"
            }).then(() => {
                window.location.href = "/Vehiculos/Index";
            });
        } catch (err) {
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "No se pudo establecer comunicación con el servidor. ¡Intenta de nuevo!",
                confirmButtonColor: "var(--teal-cavex)"
            });
        }
    });
}

// Carga catálogos de vehículos, marcas de llantas, posiciones y estados desde base de datos
function cargarCatalogosLlantas() {
    // 1. Cargar vehículos
    fetch("/Vehiculos/GetVehiculos")
        .then(res => res.json())
        .then(result => {
            const select = document.getElementById("llanta-idVehDatosGenerales");
            if (!select) return;
            select.innerHTML = '<option value="">Seleccionar...</option>';
            if (result.success && result.data) {
                result.data.forEach(v => {
                    const opt = document.createElement("option");
                    opt.value = String(v.id);
                    opt.textContent = `${v.strPlaca} - ${v.strModelo} (${v.intAnio})`;
                    select.appendChild(opt);
                });
            }
        })
        .catch(() => {});

    // 2. Cargar catálogos de llantas (marcas y posiciones)
    fetch("/Vehiculos/GetVehiculoCatalogos")
        .then(res => res.json())
        .then(result => {
            if (result.success && result.data) {
                // Marcas de llantas
                const selectMarca = document.getElementById("llanta-idVehCatMarcaLlanta");
                if (selectMarca && result.data.idVehCatMarcaLlanta) {
                    selectMarca.innerHTML = '<option value="">Seleccionar...</option>';
                    result.data.idVehCatMarcaLlanta.forEach(item => {
                        const opt = document.createElement("option");
                        opt.value = String(item.id);
                        opt.textContent = item.strValor || item.strDescripcion;
                        selectMarca.appendChild(opt);
                    });
                }

                // Posiciones
                const selectPos = document.getElementById("llanta-idVehCatPosicionLlanta");
                if (selectPos && result.data.idVehCatPosicionLlanta) {
                    selectPos.innerHTML = '<option value="">Seleccionar...</option>';
                    result.data.idVehCatPosicionLlanta.forEach(item => {
                        const opt = document.createElement("option");
                        opt.value = String(item.id);
                        opt.textContent = item.strValor || item.strDescripcion;
                        selectPos.appendChild(opt);
                    });
                }

                // Estatus de la llanta
                const selectStatus = document.getElementById("llanta-idVehCatStatus");
                if (selectStatus && result.data.idVehCatStatus) {
                    selectStatus.innerHTML = '<option value="">Seleccionar...</option>';
                    result.data.idVehCatStatus.forEach(item => {
                        const opt = document.createElement("option");
                        opt.value = String(item.id);
                        opt.textContent = item.strValor || item.strDescripcion;
                        selectStatus.appendChild(opt);
                    });
                    // Por defecto: Activo (1)
                    selectStatus.value = "1";
                }
            }
        })
        .catch(() => {});
}

// Configura el Drag & Drop e input de selección de archivo para la evidencia
function inicializarCargaEvidencia() {
    const area = document.getElementById("llantaEvidenciaArea");
    const input = document.getElementById("llantaEvidenciaArchivo");
    if (!area || !input) return;

    area.addEventListener("click", event => {
        if (!event.target.closest(".llanta-file-actions button")) input.click();
    });
    document.getElementById("btnQuitarEvidenciaLlanta")?.addEventListener("click", event => {
        event.stopPropagation();
        limpiarEvidencia();
    });
    area.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            input.click();
        }
    });
    area.addEventListener("dragover", event => { event.preventDefault(); area.classList.add("is-drag-over"); });
    area.addEventListener("dragleave", () => area.classList.remove("is-drag-over"));
    area.addEventListener("drop", event => {
        event.preventDefault();
        area.classList.remove("is-drag-over");
        const archivo = event.dataTransfer.files?.[0];
        if (archivo) procesarArchivoEvidencia(archivo);
    });
    input.addEventListener("change", () => {
        const archivo = input.files?.[0];
        if (archivo) procesarArchivoEvidencia(archivo);
    });
}

// Valida el formato y tamaño del archivo
function procesarArchivoEvidencia(archivo) {
    const limBytes = 5 * 1024 * 1024;
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

    limpiarErrorEvidencia();

    if (!tiposPermitidos.includes(archivo.type)) {
        mostrarErrorEvidencia("El archivo debe ser PDF, JPG, PNG o WEBP.");
        return;
    }
    if (archivo.size > limBytes) {
        mostrarErrorEvidencia("El archivo supera el límite de 5 MB.");
        return;
    }

    document.getElementById("llantaEvidenciaPrompt").hidden = true;
    document.getElementById("llantaFilePreview").hidden = false;
    document.getElementById("llantaFileName").textContent = archivo.name;
    document.getElementById("llanta-strUrlEvidencia").value = "/uploads/llanta_demo.pdf";
}

// Limpia el archivo de evidencia
function limpiarEvidencia() {
    const input = document.getElementById("llantaEvidenciaArchivo");
    if (input) input.value = "";
    const hidden = document.getElementById("llanta-strUrlEvidencia");
    if (hidden) hidden.value = "";
    document.getElementById("llantaEvidenciaPrompt").hidden = false;
    document.getElementById("llantaFilePreview").hidden = true;
    limpiarErrorEvidencia();
}

function mostrarErrorEvidencia(mensaje) {
    document.getElementById("llantaEvidenciaArea")?.classList.add("is-invalid");
    const error = document.getElementById("llantaEvidenciaArchivoError");
    if (error) { error.textContent = mensaje; error.classList.add("d-block"); }
}

function limpiarErrorEvidencia() {
    document.getElementById("llantaEvidenciaArea")?.classList.remove("is-invalid");
    const error = document.getElementById("llantaEvidenciaArchivoError");
    if (error) { error.textContent = ""; error.classList.remove("d-block"); }
}

// Realiza validación lógica del formulario
function validarFormularioLlanta(form) {
    const obligatorios = [
        "llanta-idVehDatosGenerales", "llanta-idVehCatMarcaLlanta", "llanta-strModelo",
        "llanta-strMedida", "llanta-idVehCatPosicionLlanta", "llanta-dteFechaCompra",
        "llanta-mnyCosto", "llanta-decKilometrajeActual", "llanta-idVehCatStatus"
    ];
    let valido = true;
    obligatorios.forEach(id => {
        const campo = document.getElementById(id);
        if (campo && !validarCampoLlanta(campo)) valido = false;
    });

    // Validaciones de fechas cruzadas
    const compra = document.getElementById("llanta-dteFechaCompra")?.value;
    const vida = document.getElementById("llanta-dteFechaFinVidaEstimada");
    const rot = document.getElementById("llanta-dteFechaRotacion");
    const sig = document.getElementById("llanta-dteFechaSiguienteRotacion");

    if (compra) {
        if (vida && vida.value && vida.value < compra) {
            mensajeCampo(vida, "La fecha de vida estimada debe ser igual o posterior a la compra.");
            valido = false;
        }
        if (rot && rot.value && rot.value < compra) {
            mensajeCampo(rot, "La fecha de rotación debe ser igual o posterior a la compra.");
            valido = false;
        }
        if (sig && sig.value && sig.value < compra) {
            mensajeCampo(sig, "La siguiente rotación debe ser igual o posterior a la compra.");
            valido = false;
        }
    }

    const primerError = form.querySelector(".is-invalid");
    if (primerError) {
        primerError.scrollIntoView({ behavior: "smooth", block: "center" });
        if (typeof primerError.focus === "function") primerError.focus({ preventScroll: true });
    }
    return valido;
}

function mensajeCampo(campo, msg) {
    campo.classList.remove("is-valid");
    campo.classList.add("is-invalid");
    campo.setAttribute("aria-invalid", "true");
    const error = document.getElementById(`${campo.id}Error`);
    if (error) error.textContent = msg;
}

// Valida valores individuales e intervalos válidos
function validarCampoLlanta(campo) {
    const original = String(campo.value || "");
    const valor = original.trim();
    let mensaje = "";

    if (campo.required && !valor) {
        mensaje = campo.tagName === "SELECT" ? "Selecciona una opción." : "Este campo es obligatorio.";
    }

    if (!mensaje) {
        switch (campo.id) {
            case "llanta-strModelo":
                if (valor.length > 50) mensaje = "El modelo no debe superar 50 caracteres.";
                break;
            case "llanta-strMedida":
                if (valor.length > 50) mensaje = "La medida no debe superar 50 caracteres.";
                break;
            case "llanta-mnyCosto": {
                const num = Number(valor);
                if (isNaN(num) || num < 0 || num > 999999) {
                    mensaje = "Monto del costo no válido.";
                }
                break;
            }
            case "llanta-decKilometrajeActual": {
                const num = Number(valor);
                if (isNaN(num) || num < 0 || num > 999999) {
                    mensaje = "Kilometraje no válido.";
                }
                break;
            }
        }
    }

    if (mensaje) {
        mensajeCampo(campo, mensaje);
        return false;
    }

    limpiarErrorCampo(campo);
    if (campo.required && !campo.readOnly) campo.classList.add("is-valid");
    return true;
}

// Limpia el estado de error de un input/select
function limpiarErrorCampo(campo) {
    campo.classList.remove("is-invalid", "is-valid");
    campo.removeAttribute("aria-invalid");
    const error = document.getElementById(`${campo.id}Error`);
    if (error) {
        error.textContent = "";
        error.classList.remove("d-block");
    }
}
