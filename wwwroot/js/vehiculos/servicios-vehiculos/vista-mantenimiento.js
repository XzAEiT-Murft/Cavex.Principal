/**
 * vista-mantenimiento.js
 * Lógica para la pantalla "Registro de Ingreso a Taller".
 */

'use strict';

/* ─── Estado global ─────────────────────────────────────────────────────── */
let _vehiculos = [];         // Catálogo completo de vehículos
let _asignaciones = [];      // Asignaciones activas cargadas una vez
let _empleados = [];         // Catálogo completo de empleados
let _modoCompleto = false;   // true = switch ON (reporte de taller habilitado)

/* ─── Init ──────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    setFechaHoy();
    cargarCatalogos();
    cargarHistorial();
    bindSwitch();
    bindCostosChange();
    bindComprobanteUpload();
    bindFormSubmit();

    const moInput = document.getElementById('mant-mnyCostoManoObra');
    if (moInput) {
        moInput.addEventListener('input', () => formatCurrencyInput(moInput));
    }
    const refInput = document.getElementById('mant-mnyCostoRefacciones');
    if (refInput) {
        refInput.addEventListener('input', () => formatCurrencyInput(refInput));
    }
    const kmInput = document.getElementById('mant-decKilometrajeActual');
    if (kmInput) {
        kmInput.addEventListener('input', () => {
            kmInput.value = kmInput.value.replace(/[^0-9]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        });
    }
});

/* ─── Fecha por defecto = hoy ────────────────────────────────────────────── */
function setFechaHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('mant-dteFechaServicio').value = hoy;
}

/* ─── Switch toggle ─────────────────────────────────────────────────────── */
function bindSwitch() {
    const switchEl = document.getElementById('switchServicioConcluido');
    if (!switchEl) return;
    switchEl.addEventListener('change', () => {
        _modoCompleto = switchEl.checked;
        switchEl.setAttribute('aria-checked', _modoCompleto.toString());
        toggleCard2(_modoCompleto);
    });
}

// Función para mostrar u ocultar la sección "Reporte de Taller" según el estado del switch
function toggleCard2(habilitar) {
    // Obtenemos el contenedor de la sección 2 (Reporte de Taller)
    const card2     = document.getElementById('card2');
    // Obtenemos la etiqueta de texto del switch (NO / SÍ)
    const label     = document.getElementById('switchLabel');
    // Obtenemos el texto del botón de guardado
    const btnLabel  = document.getElementById('btnGuardarLabel');
    // Obtenemos todos los elementos interactivos dentro de la sección 2
    const inputs2   = card2?.querySelectorAll('input:not([type=hidden]), select, textarea');

    // Si el switch está activado en SÍ
    if (habilitar) {
        // Mostramos la sección 2 en la pantalla
        if (card2) card2.style.display = 'block';
        // Cambiamos el texto del switch a "SÍ"
        if (label) label.textContent = 'SÍ';
        // Actualizamos el texto del botón principal
        if (btnLabel) btnLabel.textContent = 'Guardar reporte de taller';
        // Habilitamos los campos internos para captura
        inputs2?.forEach(el => {
            el.disabled = false;
        });
        // Habilitamos la zona de carga de comprobante
        document.getElementById('mantComprobanteArea')?.classList.remove('mant-upload-area--disabled');
    } else {
        // Si el switch está en NO, ocultamos la sección 2 por completo
        if (card2) card2.style.display = 'none';
        // Cambiamos el texto del switch a "NO"
        if (label) label.textContent = 'NO';
        // Restauramos el texto del botón principal
        if (btnLabel) btnLabel.textContent = 'Guardar ingreso a taller';
        // Deshabilitamos los campos de la sección 2
        inputs2?.forEach(el => el.disabled = true);
        // Deshabilitamos la zona de carga de comprobante
        document.getElementById('mantComprobanteArea')?.classList.add('mant-upload-area--disabled');
    }
}

/* ─── Cargar catálogos ───────────────────────────────────────────────────── */
async function cargarCatalogos() {
    try {
        const [resVehiculos, resCatalogos, resResponsables, resAsignaciones, resEmpleados] = await Promise.all([
            fetch('/Vehiculos/GetVehiculos').then(r => r.json()),
            fetch('/Vehiculos/GetMantenimientoCatalogos').then(r => r.json()),
            fetch('/Vehiculos/ResponsablesServicio/GetResponsables').then(r => r.json()),
            fetch('/Vehiculos/GetAsignacionesActivas').then(r => r.json()),
            fetch('/Empleado/GetEmpleadosDropdown').then(r => r.json()).catch(() => ({ success: false }))
        ]);

        // Asignaciones activas
        if (resAsignaciones.success) {
            _asignaciones = resAsignaciones.data || [];
        }

        const vehIdAsignados = new Set(
            (_asignaciones || [])
                .filter(a => (a.decKilometrajeFinal == null && a.DecKilometrajeFinal == null) || Number(a.decKilometrajeFinal ?? a.DecKilometrajeFinal) === 0)
                .map(a => Number(a.idVehDatosGenerales ?? a.IdVehDatosGenerales))
                .filter(id => !isNaN(id) && id > 0)
        );

        const empIdAsignados = new Set(
            (_asignaciones || [])
                .filter(a => (a.decKilometrajeFinal == null && a.DecKilometrajeFinal == null) || Number(a.decKilometrajeFinal ?? a.DecKilometrajeFinal) === 0)
                .map(a => Number(a.idEmpEmpleado ?? a.IdEmpEmpleado))
                .filter(id => !isNaN(id) && id > 0)
        );

        // Vehículos solo asignados
        if (resVehiculos.success) {
            _vehiculos = (resVehiculos.data || []).filter(v => vehIdAsignados.has(Number(v.id ?? v.Id)));
            poblarSelect('mant-idVehDatosGenerales', _vehiculos, v => ({
                value: v.id ?? v.Id,
                text: `${v.strPlaca || v.StrPlaca || '—'} · ${v.strMarca || v.StrMarca || ''} ${v.strModelo || v.StrModelo || ''} ${v.intAnio || v.IntAnio || ''}`.trim()
            }));
        }

        // Empleados (Choferes) solo asignados
        if (resEmpleados.success && resEmpleados.data) {
            _empleados = (resEmpleados.data || []).filter(e => empIdAsignados.has(Number(e.id ?? e.Id)));
            poblarSelect('mant-idEmpEmpleadoChofer', _empleados, e => ({
                value: e.id ?? e.Id,
                text: `${e.strNombre || e.StrNombre || ''} ${e.strApellidoPaterno || e.StrApellidoPaterno || ''} ${e.strApellidoMaterno || e.StrApellidoMaterno || ''}`.trim()
            }));
        }

        // Los dropdowns son convertidos automáticamente por el componente global custom-select de CAVEX (site.js)

        // Vincular selector de vehículo y chofer igual que en infracciones
        bindVinculacionVehiculoEmpleado();

    } catch (err) {
        console.error('Error cargando catálogos:', err);
    }
}

/* ─── Selector de vehículo / chofer / kilometraje (Vinculación automática) ─── */
// Bandera para evitar bucles infinitos durante eventos simulados de cambio
let isVinculandoMantenimiento = false;

// Función para inicializar la vinculación automática de campos
function bindVinculacionVehiculoEmpleado() {
    // Referencia al select de vehículo
    const selectVeh = document.getElementById('mant-idVehDatosGenerales');
    // Referencia al select de chofer (empleado)
    const selectEmp = document.getElementById('mant-idEmpEmpleadoChofer');

    // Evento al cambiar el vehículo seleccionado
    selectVeh?.addEventListener('change', () => {
        // Si la vinculación está en proceso, prevenimos reentradas
        if (isVinculandoMantenimiento) return;
        // Activamos la bandera de bloqueo temporal
        isVinculandoMantenimiento = true;
        try {
            // Obtenemos el ID numérico del vehículo elegido
            const vehId = parseInt(selectVeh.value, 10);
            // Referencia al campo donde se ingresa el kilometraje actual
            const kmInput = document.getElementById('mant-decKilometrajeActual');
            
            // Si se seleccionó un vehículo válido
            if (vehId) {
                // Buscamos el objeto del vehículo dentro de la lista cargada
                const veh = _vehiculos.find(v => Number(v.id) === vehId);
                // Si se encuentra el vehículo y existe el input de kilometraje
                if (veh && kmInput) {
                    // Extraemos su kilometraje registrado actual
                    const kmVal = veh.decKilometrajeActual ?? veh.DecKilometrajeActual ?? 0;
                    // Escribimos el valor formateado con comas en el campo de texto
                    kmInput.value = Number(kmVal).toLocaleString('es-MX');
                }

                // Buscamos si existe una asignación activa asociada al vehículo
                const asig = _asignaciones.find(a => Number(a.idVehDatosGenerales) === vehId);
                // Si encontramos asignación activa y existe el select de chofer
                if (asig && selectEmp) {
                    // Si el chofer seleccionado no coincide con el chofer asignado
                    if (selectEmp.value !== String(asig.idEmpEmpleado)) {
                        // Seleccionamos al chofer correspondiente automáticamente
                        selectEmp.value = String(asig.idEmpEmpleado);
                        // Notificamos el cambio a posibles escuchadores
                        selectEmp.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    // Deshabilitamos el select del chofer para evitar cambios no autorizados
                    selectEmp.disabled = true;
                } else if (selectEmp) {
                    // Si el vehículo no tiene asignación activa, permitimos elegir chofer libremente
                    selectEmp.disabled = false;
                }
            } else {
                // Si se deselecciona el vehículo, vaciamos el kilometraje
                if (kmInput) kmInput.value = '';
                // Si existe el select del chofer, lo reiniciamos
                if (selectEmp) {
                    if (selectEmp.value !== '') {
                        selectEmp.value = '';
                        selectEmp.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    // Habilitamos la selección manual
                    selectEmp.disabled = false;
                }
            }
        } finally {
            // Liberamos la bandera para futuros eventos de usuario
            isVinculandoMantenimiento = false;
        }
    });

    // Evento al cambiar manualmente el chofer seleccionado
    selectEmp?.addEventListener('change', () => {
        // Prevenimos bucles de eventos entre vehículo y chofer
        if (isVinculandoMantenimiento) return;
        // Activamos la bandera de bloqueo temporal
        isVinculandoMantenimiento = true;
        try {
            // Obtenemos el ID numérico del empleado elegido
            const empId = parseInt(selectEmp.value, 10);
            // Si se seleccionó un empleado
            if (empId) {
                // Buscamos si dicho empleado tiene un vehículo asignado
                const asig = _asignaciones.find(a => a.idEmpEmpleado === empId);
                // Si encontramos la asignación activa y existe el select de vehículo
                if (asig && selectVeh) {
                    // Si el vehículo no está seleccionado
                    if (selectVeh.value !== String(asig.idVehDatosGenerales)) {
                        // Seleccionamos automáticamente el vehículo del chofer
                        selectVeh.value = String(asig.idVehDatosGenerales);
                        // Disparamos el evento para que cargue también su kilometraje
                        selectVeh.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            }
        } finally {
            // Liberamos la bandera al finalizar la operación
            isVinculandoMantenimiento = false;
        }
    });
}

/* ─── Cálculo en vivo: Total = Mano de Obra + Refacciones ───────────────── */
function bindCostosChange() {
    ['mant-mnyCostoManoObra', 'mant-mnyCostoRefacciones'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calcularTotal);
    });
}

function calcularTotal() {
    const moStr = document.getElementById('mant-mnyCostoManoObra')?.value || '';
    const refStr = document.getElementById('mant-mnyCostoRefacciones')?.value || '';
    const mo  = parseFloat(moStr.replace(/,/g, '')) || 0;
    const ref = parseFloat(refStr.replace(/,/g, '')) || 0;
    const total = mo + ref;
    const totalEl = document.getElementById('mant-mnyCostoTotal');
    if (totalEl) {
        totalEl.value = (mo > 0 || ref > 0) ? total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
    }
}

/* ─── Upload comprobante ─────────────────────────────────────────────────── */
function bindComprobanteUpload() {
    const area    = document.getElementById('mantComprobanteArea');
    const input   = document.getElementById('mantComprobanteArchivo');
    const preview = document.getElementById('mantFilePreview');
    const prompt  = document.getElementById('mantComprobantePrompt');
    const btnQuit = document.getElementById('btnQuitarComprobanteMant');

    if (!area || !input) return;

    input.addEventListener('click', e => {
        e.stopPropagation();
    });
    area.addEventListener('click', () => { if (!input.disabled) input.click(); });

    area.addEventListener('dragenter', e => {
        e.preventDefault();
        e.stopPropagation();
        if (!input.disabled) area.classList.add('dragover');
    });
    area.addEventListener('dragover', e => { e.preventDefault(); if (!input.disabled) area.classList.add('dragover'); });
    area.addEventListener('dragleave', () => area.classList.remove('dragover'));
    area.addEventListener('drop', e => {
        e.preventDefault();
        area.classList.remove('dragover');
        if (!input.disabled && e.dataTransfer.files.length) {
            input.files = e.dataTransfer.files;
            input.dispatchEvent(new Event('change'));
        }
    });

    input.addEventListener('change', () => {
        const file = input.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({ icon: 'warning', title: 'Archivo muy grande', text: 'El comprobante no debe superar 5 MB.', confirmButtonColor: '#0d233a' });
            input.value = '';
            return;
        }
        document.getElementById('mantFileName').textContent = file.name;
        document.getElementById('mantFileSize').textContent = formatBytes(file.size);
        if (prompt) prompt.style.display = 'none';
        if (preview) preview.style.display = 'flex';
    });

    btnQuit?.addEventListener('click', () => {
        input.value = '';
        const hiddenUrl = document.getElementById('mant-strUrlComprobantePago');
        if (hiddenUrl) hiddenUrl.value = '';
        if (preview) preview.style.display = 'none';
        if (prompt) prompt.style.display  = '';
    });
}

function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─── Submit del formulario ──────────────────────────────────────────────── */
function bindFormSubmit() {
    document.getElementById('formMantenimiento')?.addEventListener('submit', async e => {
        e.preventDefault();
        e.stopPropagation();

        const form = e.target;
        if (!form.checkValidity()) {
            if (_modoCompleto) {
                const fp = document.getElementById('mant-idVehFormaPago');
                if (fp && !fp.value) { fp.classList.add('is-invalid'); return; }
            }
            form.classList.add('was-validated');
            return;
        }
        form.classList.add('was-validated');

        await guardarMantenimiento();
    });
}

async function guardarMantenimiento() {
    const btn = document.getElementById('btnGuardarMantenimiento');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';

    try {
        const formData = new FormData();
        formData.append('idVehDatosGenerales',          document.getElementById('mant-idVehDatosGenerales').value);
        formData.append('idEmpEmpleadoChofer',          document.getElementById('mant-idEmpEmpleadoChofer').value);
        formData.append('idVehCatTipoServicio',         document.getElementById('mant-idVehCatTipoServicio').value);
        formData.append('dteFechaServicio',             document.getElementById('mant-dteFechaServicio').value);
        formData.append('decKilometrajeActual',         document.getElementById('mant-decKilometrajeActual').value.replace(/,/g, ''));
        formData.append('idVehCatTaller',               document.getElementById('mant-idVehCatTaller').value);
        formData.append('strDescripcion',               document.getElementById('mant-strDescripcion').value);
        formData.append('idVehCatResponsableServicio',  document.getElementById('mant-idVehCatResponsableServicio').value);

        if (_modoCompleto) {
            formData.append('mnyCostoManoObra',    (document.getElementById('mant-mnyCostoManoObra').value || '0').replace(/,/g, ''));
            formData.append('mnyCostoRefacciones', (document.getElementById('mant-mnyCostoRefacciones').value || '0').replace(/,/g, ''));
            formData.append('idVehFormaPago',      document.getElementById('mant-idVehFormaPago').value || '1');

            const archivo = document.getElementById('mantComprobanteArchivo').files[0];
            if (archivo) formData.append('ComprobanteArchivo', archivo);
        } else {
            formData.append('mnyCostoManoObra',    '0');
            formData.append('mnyCostoRefacciones', '0');
            formData.append('idVehFormaPago',      '1');
        }

        const res  = await fetch('/Vehiculos/SaveMantenimiento', { method: 'POST', body: formData });
        const data = await res.json();

        if (data.success) {
            await Swal.fire({
                icon: 'success',
                title: '¡Registro guardado!',
                text: data.message || 'El ingreso a taller se registró correctamente.',
                confirmButtonColor: '#0d233a'
            });
            resetForm();
            cargarHistorial();
        } else {
            Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'No se pudo guardar el registro.', confirmButtonColor: '#0d233a' });
        }

    } catch (err) {
        console.error('SaveMantenimiento error:', err);
        Swal.fire({ icon: 'error', title: 'Error de red', text: 'No se pudo contactar con el servidor. Intenta de nuevo.', confirmButtonColor: '#0d233a' });
    } finally {
        btn.disabled = false;
        const textoBtn = _modoCompleto ? 'Guardar reporte de taller' : 'Guardar ingreso a taller';
        btn.innerHTML = `<span id="btnGuardarLabel">${textoBtn}</span>`;
    }
}

function resetForm() {
    const form = document.getElementById('formMantenimiento');
    if (form) {
        form.reset();
        form.classList.remove('was-validated');
    }
    // Reset switch
    const sw = document.getElementById('switchServicioConcluido');
    if (sw) sw.checked = false;
    _modoCompleto = false;
    toggleCard2(false);

    // Reset comprobante
    const preview = document.getElementById('mantFilePreview');
    const prompt = document.getElementById('mantComprobantePrompt');
    const totalInput = document.getElementById('mant-mnyCostoTotal');
    if (preview) preview.style.display = 'none';
    if (prompt) prompt.style.display = '';
    if (totalInput) totalInput.value = '0.00';
    setFechaHoy();
}

/* ─── Historial de mantenimientos ───────────────────────────────────────── */
async function cargarHistorial() {
    const tbody = document.getElementById('mantenimientoTableBody');
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-4"><span class="spinner-border spinner-border-sm me-2"></span>Cargando...</td></tr>';

    try {
        const res  = await fetch('/Vehiculos/GetMantenimientos');
        const data = await res.json();

        if (!data.success || !data.data?.length) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-4">Sin registros.</td></tr>';
            return;
        }

        tbody.innerHTML = data.data.map(m => {
            const total = m.mnyCostoTotal ?? (m.mnyCostoManoObra + m.mnyCostoRefacciones);
            return `
            <tr>
                <td>${m.strMarca || '—'} ${m.strModelo || ''}</td>
                <td>${m.strTaller || '—'}</td>
                <td>${m.strTipoServicio || '—'}</td>
                <td>${m.strEncargado || '—'}</td>
                <td>${formatFecha(m.dteFechaServicio)}</td>
                <td>${Number(m.decKilometrajeActual || 0).toLocaleString('es-MX')} km</td>
                <td>$${Number(total).toFixed(2)}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-cavex" onclick="eliminarMantenimiento(${m.id})" title="Eliminar">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                            <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                    </button>
                </td>
            </tr>`;
        }).join('');

    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-danger py-4">Error al cargar los registros.</td></tr>';
    }
}

async function eliminarMantenimiento(id) {
    const confirm = await Swal.fire({
        icon: 'warning',
        title: '¿Eliminar registro?',
        text: 'Esta acción no se puede deshacer.',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#c0392b',
        cancelButtonColor: '#0d233a'
    });
    if (!confirm.isConfirmed) return;

    const res  = await fetch(`/Vehiculos/DeleteMantenimiento?id=${id}`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
        Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false });
        cargarHistorial();
    } else {
        Swal.fire({ icon: 'error', title: 'Error', text: data.message, confirmButtonColor: '#0d233a' });
    }
}

/* ─── Utilidades ─────────────────────────────────────────────────────────── */
function poblarSelect(selectId, items, mapFn) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    const current = sel.value;
    while (sel.options.length > 1) sel.remove(1);
    items.forEach(item => {
        const { value, text } = mapFn(item);
        const opt = new Option(text, value);
        sel.add(opt);
    });
    if (current) sel.value = current;
}

function formatFecha(val) {
    if (!val) return '—';
    const d = new Date(val);
    if (isNaN(d)) return val;
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Formatea en tiempo real un input de tipo moneda, permitiendo solo un punto decimal
 * e insertando comas para separar los miles mientras el usuario escribe.
 * @param {HTMLInputElement} input - El elemento input a formatear.
 */
function formatCurrencyInput(input) {
    let value = input.value.replace(/[^0-9.]/g, "");
    const parts = value.split(".");
    if (parts.length > 2) {
        value = parts[0] + "." + parts.slice(1).join("");
    }
    let integerPart = parts[0];
    let decimalPart = parts[1];
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (decimalPart !== undefined) {
        decimalPart = decimalPart.substring(0, 2);
        input.value = integerPart + "." + decimalPart;
    } else {
        input.value = integerPart;
    }
}




