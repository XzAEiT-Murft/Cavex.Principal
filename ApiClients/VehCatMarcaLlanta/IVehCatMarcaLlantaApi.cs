using Cavex.Principal.Common;
using Cavex.Principal.Models.VehCatMarcaLlanta;
using Refit;

namespace Cavex.Principal.ApiClients.VehCatMarcaLlanta
{
    public interface IVehCatMarcaLlantaApi
    {
        [Get("/api/v1/VehCatMarcaLlanta")]
        Task<ResponseWrapper<PagedResponse<VehCatMarcaLlantaDto>>> GetAllAsync(CancellationToken cancellationToken = default);

        [Get("/api/v1/VehCatMarcaLlanta/{id}")]
        Task<ResponseWrapper<VehCatMarcaLlantaDto>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        [Post("/api/v1/VehCatMarcaLlanta")]
        Task<ResponseWrapper<VehCatMarcaLlantaDto>> CreateAsync([Body] RequestWrapper<VehCatMarcaLlantaSaveDto> dto, CancellationToken cancellationToken = default);

        [Put("/api/v1/VehCatMarcaLlanta/{id}")]
        Task<ResponseWrapper<VehCatMarcaLlantaDto>> UpdateAsync(int id, [Body] RequestWrapper<VehCatMarcaLlantaEditDto> dto, CancellationToken cancellationToken = default);

        [Delete("/api/v1/VehCatMarcaLlanta/{id}")]
        Task<ResponseWrapper<bool>> DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}
