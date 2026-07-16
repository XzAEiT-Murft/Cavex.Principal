"use strict";

// Inicializador de eventos al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    inicializarVistaGasolina();
});

// Inicializa validaciones, carga de catálogos y el envío de datos de cargas de gasolina
function inicializarVistaGasolina() {
    const form = document.getElementById("gasolinaVehiculoForm");
    if (!form) return;

    cargarCatalogosGasolina();
    inicializarCalculoLitros();
    inicializarCargaComprobante();

    // Eventos de validación en tiempo real para todos los inputs/selects obligatorios
    form.querySelectorAll("input:not([type='file']):not([type='hidden']), select").forEach(campo => {
        ["input", "change"].forEach(evento => campo.addEventListener(evento, () => {
            const teniaError = campo.classList.contains("is-invalid");
            limpiarErrorCampo(campo);
            if (teniaError) validarCampoGasolina(campo);
        }));

        campo.addEventListener("blur", () => {
            if (campo.type !== "number" && campo.tagName !== "SELECT" && !campo.readOnly) {
                campo.value = campo.value.trim().replace(/\s{2,}/g, " ");
            }
            if (campo.required || campo.value) {
                validarCampoGasolina(campo);
            }
        });
    });

    // Envío del formulario al backend para registrar la carga de combustible
    form.addEventListener("submit", async event => {
        event.preventDefault();
        
        if (!validarFormularioGasolina(form)) {
            Swal.fire({
                icon: "warning",
                title: "Formulario incompleto",
                text: "Revisa los campos obligatorios antes de continuar.",
                confirmButtonColor: "var(--teal-cavex)"
            });
            return;
        }

        Swal.fire({
            title: "Registrando carga...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Construcción del DTO mapeado a las propiedades esperadas por VehControlGasolinaSaveDto
        const payload = {
            idVehDatosGenerales: parseInt(document.getElementById("gasolina-idVehDatosGenerales").value, 10),
            dteFechaCarga: document.getElementById("gasolina-dteFechaCarga").value,
            mnyMontoPagado: parseFloat(document.getElementById("gasolina-mnyMontoPagado").value),
            mnyPrecioLitro: parseFloat(document.getElementById("gasolina-mnyPrecioLitro").value),
            decKilometrajeActual: parseFloat(document.getElementById("gasolina-decKilometrajeActual").value),
            idVehFormaPago: parseInt(document.getElementById("gasolina-idVehFormaPago").value, 10),
            strUrlComprobantePago: document.getElementById("gasolina-strUrlComprobantePago").value || null,
            idVehCatGasolineras: parseInt(document.getElementById("gasolina-idVehCatGasolineras").value, 10),
            idEmpEmpleado: parseInt(document.getElementById("gasolina-idEmpEmpleado").value, 10)
        };

        try {
            const response = await fetch("/Vehiculos/SaveGasolina", {
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
                    text: result.message || "No fue posible registrar la carga de combustible.",
                    confirmButtonColor: "var(--teal-cavex)"
                });
                return;
            }

            Swal.fire({
                icon: "success",
                title: "Carga registrada",
                text: "Los datos de la carga de combustible han sido registrados exitosamente en la base de datos.",
                confirmButtonColor: "var(--teal-cavex)"
            }).then(() => {
                window.location.href = "/Vehiculos/Index";
            });
        } catch (err) {
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "No se pudo establecer. ¡Intenta de nuevo!",
                confirmButtonColor: "var(--teal-cavex)"
            });
        }
    });
}

// Carga los catálogos de vehículos, empleados, gasolineras y formas de pago desde la base de datos
function cargarCatalogosGasolina() {
    // 1. Cargar vehículos
    fetch("/Vehiculos/GetVehiculos")
        .then(res => res.json())
        .then(result => {
            const select = document.getElementById("gasolina-idVehDatosGenerales");
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

    // 2. Cargar empleados
    fetch("/Empleado/GetEmpleados")
        .then(res => res.json())
        .then(result => {
            const select = document.getElementById("gasolina-idEmpEmpleado");
            if (!select) return;
            select.innerHTML = '<option value="">Seleccionar...</option>';
            if (result.success && result.data) {
                result.data.forEach(e => {
                    const opt = document.createElement("option");
                    opt.value = String(e.id);
                    const nombreCompleto = e.strNombre + ' ' + e.strApellidoPaterno + (e.strApellidoMaterno ? ' ' + e.strApellidoMaterno : '');
                    opt.textContent = nombreCompleto;
                    select.appendChild(opt);
                });
            }
        })
        .catch(() => {});

    // 3. Cargar catálogos de gasolineras y formas de pago
    fetch("/Vehiculos/GetVehiculoCatalogos")
        .then(res => res.json())
        .then(result => {
            if (result.success && result.data) {
                // Gasolineras
                const selectGas = document.getElementById("gasolina-idVehCatGasolineras");
                if (selectGas && result.data.idVehCatGasolineras) {
                    selectGas.innerHTML = '<option value="">Seleccionar...</option>';
                    result.data.idVehCatGasolineras.forEach(item => {
                        const opt = document.createElement("option");
                        opt.value = String(item.id);
                        opt.textContent = item.strValor || item.strDescripcion;
                        selectGas.appendChild(opt);
                    });
                }

                // Formas de pago
                const selectPago = document.getElementById("gasolina-idVehFormaPago");
                if (selectPago && result.data.idVehCatFormaPago) {
                    selectPago.innerHTML = '<option value="">Seleccionar...</option>';
                    result.data.idVehCatFormaPago.forEach(item => {
                        const opt = document.createElement("option");
                        opt.value = String(item.id);
                        opt.textContent = item.strValor || item.strDescripcion;
                        selectPago.appendChild(opt);
                    });
                }
            }
        })
        .catch(() => {});
}

// Calcula dinámicamente los litros estimados basados en Monto / Precio por litro
function inicializarCalculoLitros() {
    const monto = document.getElementById("gasolina-mnyMontoPagado");
    const precio = document.getElementById("gasolina-mnyPrecioLitro");
    const litros = document.getElementById("gasolinaLitrosEstimados");

    if (!monto || !precio || !litros) return;

    const calcular = () => {
        const valMonto = parseFloat(monto.value) || 0;
        const valPrecio = parseFloat(precio.value) || 0;
        if (valMonto > 0 && valPrecio > 0) {
            litros.textContent = (valMonto / valPrecio).toFixed(2) + " L";
        } else {
            litros.textContent = "0.00 L";
        }
    };

    monto.addEventListener("input", calcular);
    precio.addEventListener("input", calcular);
}

// Configura Drag & Drop y selección manual de archivos para el comprobante
function inicializarCargaComprobante() {
    const area = document.getElementById("gasolinaComprobanteArea");
    const input = document.getElementById("gasolinaComprobanteArchivo");
    if (!area || !input) return;

    area.addEventListener("click", event => {
        if (!event.target.closest(".gasolina-file-actions button")) input.click();
    });
    document.getElementById("btnQuitarComprobanteGasolina")?.addEventListener("click", event => {
        event.stopPropagation();
        limpiarComprobante();
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
        if (archivo) procesarArchivoComprobante(archivo);
    });
    input.addEventListener("change", () => {
        const archivo = input.files?.[0];
        if (archivo) procesarArchivoComprobante(archivo);
    });
}

// Valida el formato y tamaño del archivo de comprobante
function procesarArchivoComprobante(archivo) {
    const limBytes = 5 * 1024 * 1024;
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

    limpiarErrorComprobante();

    if (!tiposPermitidos.includes(archivo.type)) {
        mostrarErrorComprobante("El archivo debe ser PDF, JPG, PNG o WEBP.");
        return;
    }
    if (archivo.size > limBytes) {
        mostrarErrorComprobante("El archivo supera el límite de 5 MB.");
        return;
    }

    document.getElementById("gasolinaComprobantePrompt").hidden = true;
    document.getElementById("gasolinaFilePreview").hidden = false;
    document.getElementById("gasolinaFileName").textContent = archivo.name;
    document.getElementById("gasolina-strUrlComprobantePago").value = "/uploads/gasolina_demo.pdf";
}

// Limpia el input del comprobante de pago cargado
function limpiarComprobante() {
    const input = document.getElementById("gasolinaComprobanteArchivo");
    if (input) input.value = "";
    const hidden = document.getElementById("gasolina-strUrlComprobantePago");
    if (hidden) hidden.value = "";
    document.getElementById("gasolinaComprobantePrompt").hidden = false;
    document.getElementById("gasolinaFilePreview").hidden = true;
    limpiarErrorComprobante();
}

function mostrarErrorComprobante(mensaje) {
    document.getElementById("gasolinaComprobanteArea")?.classList.add("is-invalid");
    const error = document.getElementById("gasolinaComprobanteArchivoError");
    if (error) { error.textContent = mensaje; error.classList.add("d-block"); }
}

function limpiarErrorComprobante() {
    document.getElementById("gasolinaComprobanteArea")?.classList.remove("is-invalid");
    const error = document.getElementById("gasolinaComprobanteArchivoError");
    if (error) { error.textContent = ""; error.classList.remove("d-block"); }
}

// Realiza la validación del conjunto de campos requeridos del formulario
function validarFormularioGasolina(form) {
    const obligatorios = [
        "gasolina-idVehDatosGenerales", "gasolina-dteFechaCarga", "gasolina-decKilometrajeActual",
        "gasolina-idVehCatGasolineras", "gasolina-mnyMontoPagado", "gasolina-mnyPrecioLitro",
        "gasolina-idVehFormaPago", "gasolina-idEmpEmpleado"
    ];
    let valido = true;
    obligatorios.forEach(id => {
        const campo = document.getElementById(id);
        if (campo && !validarCampoGasolina(campo)) valido = false;
    });

    const primerError = form.querySelector(".is-invalid");
    if (primerError) {
        primerError.scrollIntoView({ behavior: "smooth", block: "center" });
        if (typeof primerError.focus === "function") primerError.focus({ preventScroll: true });
    }
    return valido;
}

// Ejecuta la validación lógica y de rango para campos específicos
function validarCampoGasolina(campo) {
    const original = String(campo.value || "");
    const valor = original.trim();
    let mensaje = "";

    if (campo.required && !valor) {
        mensaje = campo.tagName === "SELECT" ? "Selecciona una opción." : "Este campo es obligatorio.";
    }

    if (!mensaje) {
        switch (campo.id) {
            case "gasolina-decKilometrajeActual": {
                const num = Number(valor);
                if (isNaN(num) || num < 0 || num > 999999) {
                    mensaje = "Kilometraje no válido.";
                }
                break;
            }
            case "gasolina-mnyMontoPagado": {
                const num = Number(valor);
                if (isNaN(num) || num <= 0 || num > 999999) {
                    mensaje = "Monto pagado no válido (debe ser mayor a 0).";
                }
                break;
            }
            case "gasolina-mnyPrecioLitro": {
                const num = Number(valor);
                if (isNaN(num) || num <= 0 || num > 999) {
                    mensaje = "Precio por litro no válido (debe ser mayor a 0).";
                }
                break;
            }
        }
    }

    if (mensaje) {
        campo.classList.remove("is-valid");
        campo.classList.add("is-invalid");
        campo.setAttribute("aria-invalid", "true");
        const error = document.getElementById(`${campo.id}Error`);
        if (error) error.textContent = mensaje;
        return false;
    }

    limpiarErrorCampo(campo);
    if (campo.required && !campo.readOnly) campo.classList.add("is-valid");
    return true;
}

// Restablece el estado de error de un input
function limpiarErrorCampo(campo) {
    campo.classList.remove("is-invalid", "is-valid");
    campo.removeAttribute("aria-invalid");
    const error = document.getElementById(`${campo.id}Error`);
    if (error) {
        error.textContent = "";
        error.classList.remove("d-block");
    }
}
