using System.Threading;
using System.Threading.Tasks;
using Refit;
using Cavex.Principal.Common;
using Cavex.Principal.Models.EmpEmpleado;

namespace Cavex.Principal.ApiClients.EmpSubEntidades
{
    /// <summary>
    /// Llama a POST /api/v1/EmpDatosAcademicos.
    /// Crea los datos académicos del empleado (escolaridad, institución, etc.).
    /// </summary>
    public interface IEmpDatosAcademicosApi
    {
        [Post("/api/v1/EmpDatosAcademicos")]
        Task<ResponseWrapper<EmpSubEntidadDto>> CreateAsync(
            [Body] RequestWrapper<EmpDatosAcademicosCreateApiDto> request,
            CancellationToken cancellationToken = default);
    }

    /// <summary>
    /// Llama a POST /api/v1/EmpDocumentosLaborales.
    /// Guarda las rutas de los archivos subidos (INE, comprobante, CV, etc.).
    /// </summary>
    public interface IEmpDocumentosLaboralesApi
    {
        [Post("/api/v1/EmpDocumentosLaborales")]
        Task<ResponseWrapper<EmpSubEntidadDto>> CreateAsync(
            [Body] RequestWrapper<EmpDocumentosLaboralesCreateApiDto> request,
            CancellationToken cancellationToken = default);
    }

    /// <summary>
    /// Llama a POST /api/v1/EmpCondicionesLaborales.
    /// Registra sueldo, disponibilidad de viaje, fecha de ingreso, etc.
    /// </summary>
    public interface IEmpCondicionesLaboralesApi
    {
        [Post("/api/v1/EmpCondicionesLaborales")]
        Task<ResponseWrapper<EmpSubEntidadDto>> CreateAsync(
            [Body] RequestWrapper<EmpCondicionesLaboralesCreateApiDto> request,
            CancellationToken cancellationToken = default);
    }

    /// <summary>
    /// Llama a POST /api/v1/EmpExperiencia.
    /// Registra un puesto de trabajo previo del empleado.
    /// Se llama N veces, una por cada experiencia ingresada en el formulario.
    /// </summary>
    public interface IEmpExperienciaApi
    {
        [Post("/api/v1/EmpExperiencia")]
        Task<ResponseWrapper<EmpSubEntidadDto>> CreateAsync(
            [Body] RequestWrapper<EmpExperienciaCreateApiDto> request,
            CancellationToken cancellationToken = default);
    }

    /// <summary>
    /// Llama a POST /api/v1/EmpReferenciasPersonales.
    /// Registra una referencia personal del empleado.
    /// Se llama N veces, una por cada referencia ingresada en el formulario.
    /// </summary>
    public interface IEmpReferenciasPersonalesApi
    {
        [Post("/api/v1/EmpReferenciasPersonales")]
        Task<ResponseWrapper<EmpSubEntidadDto>> CreateAsync(
            [Body] RequestWrapper<EmpReferenciaCreateApiDto> request,
            CancellationToken cancellationToken = default);
    }

    /// <summary>
    /// Llama a POST /api/v1/EmpTelefono.
    /// Registra el teléfono fijo y/o celular del empleado.
    /// </summary>
    public interface IEmpTelefonoApi
    {
        [Post("/api/v1/EmpTelefono")]
        Task<ResponseWrapper<EmpSubEntidadDto>> CreateAsync(
            [Body] RequestWrapper<EmpTelefonoCreateApiDto> request,
            CancellationToken cancellationToken = default);
    }

    /// <summary>
    /// Llama a POST /api/v1/EmpHistorialArea.
    /// Asigna el área laboral inicial del empleado con su fecha de inicio.
    /// </summary>
    public interface IEmpHistorialAreaApi
    {
        [Post("/api/v1/EmpHistorialArea")]
        Task<ResponseWrapper<EmpSubEntidadDto>> CreateAsync(
            [Body] RequestWrapper<EmpHistorialAreaCreateApiDto> request,
            CancellationToken cancellationToken = default);
    }
}
