using System;

namespace Cavex.Principal.Models.EmpEmpleado
{
    // ─────────────────────────────────────────────────────────────────────────────
    // EmpSubEntidadApiDtos.cs
    //
    // DTOs que el MVC usa para enviar datos al API externo al crear un empleado.
    // Cada DTO refleja exactamente lo que el API espera en su endpoint Create.
    // Estos no son los mismos DTOs del formulario (EmpEmpleadoSaveDto):
    //   - EmpEmpleadoSaveDto  → viene del browser (formulario con objetos anidados)
    //   - *CreateApiDto       → lo que el API REST espera (campos planos)
    // ─────────────────────────────────────────────────────────────────────────────

    /// <summary>
    /// Respuesta genérica de cualquier sub-entidad del empleado.
    /// Solo necesitamos el Id que generó el API para enlazarlo con el empleado.
    /// </summary>
    public class EmpSubEntidadDto
    {
        public int Id { get; set; }
    }

    // ── DTOs de creación para enviar al API ──────────────────────────────────────

    /// <summary>
    /// Datos de dirección del empleado: colonia, número exterior e interior.
    /// Equivale a EmpDireccionCreateDto del API.
    /// </summary>
    public class EmpDireccionCreateApiDto
    {
        public int IdEmpCatColonia { get; set; }
        public int? IntNumExterior { get; set; }
        public int? IntNumInterior { get; set; }
    }

    /// <summary>
    /// Datos académicos: escolaridad, institución, carrera y fechas.
    /// Equivale a EmpDatosAcademicosCreateDto del API.
    /// </summary>
    public class EmpDatosAcademicosCreateApiDto
    {
        public string StrNivelEstudios { get; set; } = string.Empty;
        public string StrInstitucion { get; set; } = string.Empty;
        public string? StrCarrera { get; set; }
        public string StrEstatus { get; set; } = string.Empty;
        public DateOnly DteFechaInicio { get; set; }
        public DateOnly DteFechaFin { get; set; }
    }

    /// <summary>
    /// Rutas de los documentos subidos al servidor (INE, comprobante, CV, contrato, etc.).
    /// Las rutas las genera el MVC al guardar los archivos en wwwroot/uploads/empleados/{CURP}/.
    /// Equivale a EmpDocumentosLaboralesCreateDto del API.
    /// </summary>
    public class EmpDocumentosLaboralesCreateApiDto
    {
        public string StrUrlIdentificacionOficial { get; set; } = string.Empty;
        public string StrUrlComprobanteDomicilio { get; set; } = string.Empty;
        public string StrUrlCurriculumVitae { get; set; } = string.Empty;
        public string StrUrlContrato { get; set; } = string.Empty;
        public string StrUrlLicencia { get; set; } = string.Empty;
        public string StrUrlFotoEmp { get; set; } = string.Empty;
    }

    /// <summary>
    /// Condiciones económicas y de disponibilidad del empleado.
    /// Equivale a EmpCondicionesLaboralesCreateDto del API.
    /// </summary>
    public class EmpCondicionesLaboralesCreateApiDto
    {
        public bool BitCercaniaVivienda { get; set; }
        public bool BitDisponibilidadDeViaje { get; set; }
        public decimal MnySueldoMensual { get; set; }
        public bool BitExperienciaEnArea { get; set; }
        public bool BitDisponibilidadCambioResidencia { get; set; }
        public DateOnly DteFechaIngreso { get; set; }
    }

    /// <summary>
    /// Registro raíz del empleado.
    /// Solo contiene campos propios del empleado + los IDs de las sub-entidades
    /// que deben crearse ANTES de llamar a este endpoint.
    /// Equivale a EmpEmpleadoCreateDto del API.
    /// </summary>
    public class EmpEmpleadoCreateApiDto
    {
        public string StrNombre { get; set; } = string.Empty;
        public string StrApellidoPaterno { get; set; } = string.Empty;
        public string? StrApellidoMaterno { get; set; }
        public DateOnly DteFechaNacimiento { get; set; }
        public string StrRfc { get; set; } = string.Empty;
        public string StrCurp { get; set; } = string.Empty;
        public int IntEdad { get; set; }
        public string StrCorreoElectronico { get; set; } = string.Empty;
        public long BigNss { get; set; }
        public int IdEmpCatGenero { get; set; }
        public int IdEmpCatEstadoCivil { get; set; }
        public int IdEmpCatNacionalidad { get; set; }
        public int IdEmpCatTipoContratacion { get; set; }
        // IDs de sub-entidades ya creadas:
        public int IdEmpDireccion { get; set; }
        public int IdEmpDatosAcademicos { get; set; }
        public int IdEmpDocumentosLaborales { get; set; }
        public int IdEmpCondicionesLaborales { get; set; }
        public int IdCatStatus { get; set; }
    }

    /// <summary>
    /// Un trabajo previo del empleado.
    /// Requiere el IdEmpEmpleado porque se crea DESPUÉS del registro raíz.
    /// Equivale a EmpExperienciaCreateDto del API.
    /// </summary>
    public class EmpExperienciaCreateApiDto
    {
        public string StrEmpresa { get; set; } = string.Empty;
        public string StrPuesto { get; set; } = string.Empty;
        public string StrArea { get; set; } = string.Empty;
        public DateOnly DteFechaIncio { get; set; }
        public DateOnly DteFechaFin { get; set; }
        public decimal MnySueldo { get; set; }
        public string StrMotivoSalida { get; set; } = string.Empty;
        public int IdEmpEmpleado { get; set; } // FK al empleado ya creado
    }

    /// <summary>
    /// Una referencia personal del empleado.
    /// Requiere el IdEmpEmpleado porque se crea DESPUÉS del registro raíz.
    /// Equivale a EmpReferenciasPersonalesCreateDto del API.
    /// </summary>
    public class EmpReferenciaCreateApiDto
    {
        public string StrNombreCompleto { get; set; } = string.Empty;
        public string StrParentezco { get; set; } = string.Empty;
        public long BigTelefono { get; set; }
        public int IdEmpEmpleado { get; set; } // FK al empleado ya creado
    }

    /// <summary>
    /// Teléfono fijo y/o celular del empleado.
    /// Los números vienen como string del formulario y se convierten a long en el servicio.
    /// Equivale a EmpTelefonoCreateDto del API.
    /// </summary>
    public class EmpTelefonoCreateApiDto
    {
        /// <summary>Número fijo parseado desde el string del formulario (solo dígitos).</summary>
        public long BigNumeroFijo { get; set; }
        public long? BigNumeroCelular { get; set; }
        public int IdEmpEmpleado { get; set; } // FK al empleado ya creado
    }

    /// <summary>
    /// Historial de área laboral del empleado.
    /// Se crea con la fecha de hoy como inicio y +1 año como fin por defecto.
    /// Equivale a EmpHistorialAreaCreateDto del API.
    /// </summary>
    public class EmpHistorialAreaCreateApiDto
    {
        public int IdEmpCatAreaLaboral { get; set; }
        public int IdEmpEmpleado { get; set; } // FK al empleado ya creado
        public DateOnly DteFechaInicio { get; set; }
        public DateOnly DteFechaFin { get; set; }
    }
}
