using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Cavex.Principal.ApiClients.VehCatTransmision;
using Cavex.Principal.Common;
using Cavex.Principal.Models.VehCatTransmision;
using Cavex.Principal.Services.Interfaces;
using Refit;
using System.Net;

namespace Cavex.Principal.Services.Implementations
{
    public class VehCatTransmisionService : IVehCatTransmisionService
    {
        private readonly IVehCatTransmisionApi _vehCatTransmisionApi;
        private readonly ILogger<VehCatTransmisionService> _logger;

        public VehCatTransmisionService(IVehCatTransmisionApi vehCatTransmisionApi, ILogger<VehCatTransmisionService> logger)
        {
            _vehCatTransmisionApi = vehCatTransmisionApi;
            _logger = logger;
        }

        public Task<ResponseWrapper<PagedResponse<VehCatTransmisionDto>>> ObtenerTodosAsync(
            int pageIndex = 1,
            int pageSize = 10,
            string? search = null,
            CancellationToken cancellationToken = default) =>
            ExecuteAsync(() => _vehCatTransmisionApi.GetAllAsync(pageIndex, pageSize, search, cancellationToken), "No fue posible obtener los registros de VehCatTransmision.");

        public async Task<bool> ExistePorNombreAsync(string nombre, int? excludeId = null, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(nombre)) return false;
            var response = await ObtenerTodosAsync(1, 10, nombre, cancellationToken);
            if (response.Success && response.Data?.Items != null)
            {
                return response.Data.Items.Any(x => 
                    x.StrValor.Trim().Equals(nombre.Trim(), StringComparison.OrdinalIgnoreCase) 
                    && (!excludeId.HasValue || x.Id != excludeId.Value));
            }
            return false;
        }

        public Task<ResponseWrapper<VehCatTransmisionDto>> ObtenerPorIdAsync(int id, CancellationToken cancellationToken = default) =>
            ExecuteAsync(() => _vehCatTransmisionApi.GetByIdAsync(id, cancellationToken), "No fue posible obtener el registro de VehCatTransmision.");

        public Task<ResponseWrapper<VehCatTransmisionDto>> CrearAsync(VehCatTransmisionSaveDto dto, CancellationToken cancellationToken = default) =>
            ExecuteAsync(() => _vehCatTransmisionApi.CreateAsync(RequestWrapper<VehCatTransmisionSaveDto>.Create(dto), cancellationToken), "No fue posible crear el registro de VehCatTransmision.");

        public Task<ResponseWrapper<VehCatTransmisionDto>> EditarAsync(VehCatTransmisionEditDto dto, CancellationToken cancellationToken = default) =>
            ExecuteAsync(() => _vehCatTransmisionApi.UpdateAsync(dto.Id, RequestWrapper<VehCatTransmisionEditDto>.Create(dto), cancellationToken), "No fue posible editar el registro de VehCatTransmision.");

        public Task<ResponseWrapper<bool>> EliminarAsync(int id, CancellationToken cancellationToken = default) =>
            ExecuteAsync(() => _vehCatTransmisionApi.DeleteAsync(id, cancellationToken), "No fue posible eliminar el registro de VehCatTransmision.");

        private async Task<ResponseWrapper<T>> ExecuteAsync<T>(Func<Task<ResponseWrapper<T>>> apiCall, string fallbackMessage)
        {
            try
            {
                var response = await apiCall();
                return response.Success ? response : ResponseWrapper<T>.Fail(response.Message ?? fallbackMessage, response.StatusCode);
            }
            catch (ApiException ex)
            {
                _logger.LogError(ex, "API error while consuming VehCatTransmision.");
                return ResponseWrapper<T>.Fail(!string.IsNullOrWhiteSpace(ex.Content) ? ex.Content : fallbackMessage, ex.StatusCode);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while consuming VehCatTransmision.");
                return ResponseWrapper<T>.Fail(fallbackMessage, HttpStatusCode.InternalServerError);
            }
        }
    }
}
