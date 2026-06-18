using Cavex.Principal.Common;
using Cavex.Principal.Models.ServicioAClientes;
using Refit;

namespace Cavex.Principal.ApiClients.ServicioAClientes
{
    public interface IServicioAClientesApi
    {

        [Get("/api/v1/ServicioAClientes")]
        Task<ResponseWrapper<List<CatServicioSaveDto>>> GetAllAsync(CancellationToken cancellationToken = default);

        [Get("/api/v1/ServicioAClientes/{id}")]
        Task<ResponseWrapper<CatServicioSaveDto>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        [Post("/api/v1/ServicioAClientes")]
        Task<ResponseWrapper<CatServicioSaveDto>> CreateAsync([Body] CatServicioSaveDto request, CancellationToken cancellationToken = default);

        [Put("/api/v1/ServicioAClientes/{id}")]
        Task<ResponseWrapper<CatServicioSaveDto>> UpdateAsync(int id, [Body] CatServicioSaveDto request, CancellationToken cancellationToken = default);

        [Delete("/api/v1/ServicioAClientes/{id}")]
        Task<ResponseWrapper<bool>> DeleteAsync(int id, CancellationToken cancellationToken = default); 
    }
}
