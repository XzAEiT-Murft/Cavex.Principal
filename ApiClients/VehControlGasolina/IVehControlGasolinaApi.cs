using Cavex.Principal.Common;
using Cavex.Principal.Models.VehControlGasolina;
using Refit;

namespace Cavex.Principal.ApiClients.VehControlGasolina
{
    public interface IVehControlGasolinaApi
    {
        [Get("/api/v1/VehControlGasolina")]
        Task<ResponseWrapper<PagedResponse<VehControlGasolinaDto>>> GetAllAsync(CancellationToken cancellationToken = default);

        [Get("/api/v1/VehControlGasolina/{id}")]
        Task<ResponseWrapper<VehControlGasolinaDto>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        [Post("/api/v1/VehControlGasolina")]
        Task<ResponseWrapper<VehControlGasolinaDto>> CreateAsync(RequestWrapper<VehControlGasolinaSaveDto> request, CancellationToken cancellationToken = default);

        [Put("/api/v1/VehControlGasolina/{id}")]
        Task<ResponseWrapper<VehControlGasolinaDto>> UpdateAsync(int id, RequestWrapper<VehControlGasolinaEditDto> request, CancellationToken cancellationToken = default);

        [Delete("/api/v1/VehControlGasolina/{id}")]
        Task<ResponseWrapper<bool>> DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}