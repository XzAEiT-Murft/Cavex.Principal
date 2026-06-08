using Cavex.Principal.Models.ServicioAClientes;
using Refit;

namespace Cavex.Principal.ApiClients.ServicioAClientes
{
    /** Esta interfaz define los métodos para interactuar con la API de ServicioAClientes.*/
    public interface IServicioAClientesApi
    {
        
        [Get("/api/v1/servicioaclientes")]
        Task<ApiResponse<List<ServicioAClienteDto>>> GetAllAsync();
    }
}
