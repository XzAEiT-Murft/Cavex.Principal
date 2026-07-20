using Cavex.Principal.Common;
using Cavex.Principal.Models.VehAsignacionVehiculos;
using Refit;

namespace Cavex.Principal.ApiClients.VehAsignacionVehiculos
{
    public interface IVehAsignacionVehiculosApi
    {
        [Get("/api/v1/VehAsignacionVehiculos?pageSize=1000")]
        Task<ResponseWrapper<PagedResponse<VehAsignacionVehiculosDto>>> GetAllAsync(CancellationToken cancellationToken = default);

        [Get("/api/v1/VehAsignacionVehiculos/{id}")]
        Task<ResponseWrapper<VehAsignacionVehiculosDto>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        [Post("/api/v1/VehAsignacionVehiculos")]
        Task<ResponseWrapper<VehAsignacionVehiculosDto>> CreateAsync([Body] RequestWrapper<VehAsignacionVehiculosSaveDto> dto, CancellationToken cancellationToken = default);

        [Put("/api/v1/VehAsignacionVehiculos/{id}")]
        Task<ResponseWrapper<VehAsignacionVehiculosDto>> UpdateAsync(int id, [Body] RequestWrapper<VehAsignacionVehiculosEditDto> dto, CancellationToken cancellationToken = default);

        [Delete("/api/v1/VehAsignacionVehiculos/{id}")]
        Task<ResponseWrapper<bool>> DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}
