using Cavex.Principal.Models.VehSeguro;
using Cavex.Principal.Models.VehCatAseguradora;
using Cavex.Principal.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Cavex.Principal.Controllers
{
    public class SegurosController : Controller
    {
        private readonly IVehSeguroService _vehSeguro;
        private readonly IVehCatAseguradoraService _vehCatAseguradora;

        public SegurosController(IVehSeguroService vehSeguro, IVehCatAseguradoraService vehCatAseguradora)
        {
            _vehSeguro = vehSeguro;
            _vehCatAseguradora = vehCatAseguradora;
        }

        // --- SEGUROS (ASEGURADORAS) ---
        [HttpGet("/Seguros")]
        [HttpGet("/Seguros/Seguros")]
        public IActionResult Seguros()
        {
            return View("~/Views/Vehiculos/Seguros.cshtml");
        }

        [HttpGet("/Seguros/GetVehiculoSeguros")]
        public async Task<IActionResult> GetVehiculoSeguros(CancellationToken cancellationToken)
        {
            try
            {
                var response = await _vehSeguro.ObtenerTodosAsync(cancellationToken);
                if (response == null || !response.Success) return Json(new { success = false, message = response?.Message ?? "Error al obtener seguros." });
                return Json(new { success = true, data = response.Data?.Items ?? Enumerable.Empty<VehSeguroDto>() });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("/Seguros/GetSeguros")]
        [HttpGet("/Seguros/Seguros/GetSeguros")]
        public async Task<IActionResult> GetSeguros(CancellationToken cancellationToken)
        {
            try
            {
                var response = await _vehCatAseguradora.ObtenerTodosAsync(cancellationToken);
                if (response == null || !response.Success) return Json(new { success = false, message = response?.Message ?? "Error al obtener catálogo de aseguradoras." });
                return Json(new { success = true, data = response.Data?.Items ?? Enumerable.Empty<VehCatAseguradoraDto>() });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("/Seguros/SaveSeguro")]
        [HttpPost("/Seguros/Seguros/SaveSeguro")]
        public async Task<IActionResult> SaveSeguro([FromBody] VehCatAseguradoraSaveDto model, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return Json(new { success = false, message = string.Join(" ", errors) });
            }
            try
            {
                var response = await _vehCatAseguradora.CrearAsync(model, cancellationToken);
                return Json(new { success = response?.Success ?? false, message = response?.Message, data = response?.Data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("/Seguros/UpdateSeguro")]
        [HttpPost("/Seguros/Seguros/UpdateSeguro")]
        public async Task<IActionResult> UpdateSeguro([FromBody] VehCatAseguradoraEditDto model, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return Json(new { success = false, message = string.Join(" ", errors) });
            }
            try
            {
                var response = await _vehCatAseguradora.EditarAsync(model, cancellationToken);
                return Json(new { success = response?.Success ?? false, message = response?.Message, data = response?.Data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("/Seguros/DeleteSeguro")]
        [HttpPost("/Seguros/Seguros/DeleteSeguro")]
        public async Task<IActionResult> DeleteSeguro(int id, CancellationToken cancellationToken)
        {
            try
            {
                var response = await _vehCatAseguradora.EliminarAsync(id, cancellationToken);
                return Json(new { success = response?.Success ?? false, message = response?.Message });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
