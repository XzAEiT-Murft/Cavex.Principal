using System.Threading;
using System.Threading.Tasks;
using Cavex.Principal.Common;
using Cavex.Principal.Models.VehCatTransmision;

namespace Cavex.Principal.Services.Interfaces
{
    public interface IVehCatTransmisionService
    {
        Task<ResponseWrapper<PagedResponse<VehCatTransmisionDto>>> ObtenerTodosAsync(int pageIndex = 1, int pageSize = 10, string? search = null, CancellationToken cancellationToken = default);

        Task<bool> ExistePorNombreAsync(string nombre, int? excludeId = null, CancellationToken cancellationToken = default);

        Task<ResponseWrapper<VehCatTransmisionDto>> ObtenerPorIdAsync(int id, CancellationToken cancellationToken = default);

        Task<ResponseWrapper<VehCatTransmisionDto>> CrearAsync(VehCatTransmisionSaveDto dto, CancellationToken cancellationToken = default);

        Task<ResponseWrapper<VehCatTransmisionDto>> EditarAsync(VehCatTransmisionEditDto dto, CancellationToken cancellationToken = default);

        Task<ResponseWrapper<bool>> EliminarAsync(int id, CancellationToken cancellationToken = default);
    }
}
