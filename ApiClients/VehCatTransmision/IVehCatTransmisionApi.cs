using System.Threading;
using System.Threading.Tasks;
using Cavex.Principal.Common;
using Cavex.Principal.Models.VehCatTransmision;
using Refit;

namespace Cavex.Principal.ApiClients.VehCatTransmision
{
    public interface IVehCatTransmisionApi
    {
        [Get("/api/v1/VehCatTransmision")]
        Task<ResponseWrapper<PagedResponse<VehCatTransmisionDto>>> GetAllAsync(
            [Query] int? pageIndex = null,
            [Query] int? pageSize = null,
            [Query] string? search = null,
            CancellationToken cancellationToken = default);

        [Get("/api/v1/VehCatTransmision/{id}")]
        Task<ResponseWrapper<VehCatTransmisionDto>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        [Post("/api/v1/VehCatTransmision")]
        Task<ResponseWrapper<VehCatTransmisionDto>> CreateAsync([Body] RequestWrapper<VehCatTransmisionSaveDto> dto, CancellationToken cancellationToken = default);

        [Put("/api/v1/VehCatTransmision/{id}")]
        Task<ResponseWrapper<VehCatTransmisionDto>> UpdateAsync(int id, [Body] RequestWrapper<VehCatTransmisionEditDto> dto, CancellationToken cancellationToken = default);

        [Delete("/api/v1/VehCatTransmision/{id}")]
        Task<ResponseWrapper<bool>> DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}
