using System.Threading;
using System.Threading.Tasks;
using Refit;
using Cavex.Principal.Common;
using Cavex.Principal.Models.EmpEmpleado;

namespace Cavex.Principal.ApiClients.EmpSubEntidades
{
    /// <summary>
    /// Llama al endpoint POST /api/v1/EmpDireccion del API externo.
    /// Crea el registro de dirección del empleado y devuelve el Id generado.
    /// </summary>
    public interface IEmpDireccionApi
    {
        [Post("/api/v1/EmpDireccion")]
        Task<ResponseWrapper<EmpSubEntidadDto>> CreateAsync(
            [Body] RequestWrapper<EmpDireccionCreateApiDto> request,
            CancellationToken cancellationToken = default);
    }
}
