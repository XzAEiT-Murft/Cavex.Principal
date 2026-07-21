using Cavex.Principal.Models.VehControlLlanta;
using Cavex.Principal.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Cavex.Principal.Controllers
{
    public class LlantasController : Controller
    {
        private readonly IVehControlLlantaService _vehControlLlanta;
        private readonly IVehDatosGeneralesService _vehDatosGenerales;
        private readonly IVehCatMarcaVehiculoService _vehCatMarcaVehiculo;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public LlantasController(
            IVehControlLlantaService vehControlLlanta,
            IVehDatosGeneralesService vehDatosGenerales,
            IVehCatMarcaVehiculoService vehCatMarcaVehiculo,
            IWebHostEnvironment webHostEnvironment)
        {
            _vehControlLlanta = vehControlLlanta;
            _vehDatosGenerales = vehDatosGenerales;
            _vehCatMarcaVehiculo = vehCatMarcaVehiculo;
            _webHostEnvironment = webHostEnvironment;
        }

        // Pantalla frontend de control de llantas
        [HttpGet("/Llantas")]
        [HttpGet("/Llantas/Llantas")]
        public IActionResult Llantas()
        {
            return View("~/Views/Vehiculos/Llantas.cshtml");
        }

        [HttpGet("/Llantas/GetLlantas")]
        public async Task<IActionResult> GetLlantas(CancellationToken cancellationToken)
        {
            try
            {
                var response = await _vehControlLlanta.ObtenerTodosAsync(cancellationToken);
                if (response == null || !response.Success) return Json(new { success = false, message = response?.Message ?? "Error al obtener llantas." });
                return Json(new { success = true, data = response.Data?.Items ?? Enumerable.Empty<VehControlLlantaDto>() });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("/Llantas/DeleteLlanta/{id}")]
        public async Task<IActionResult> DeleteLlanta(int id, CancellationToken cancellationToken)
        {
            try
            {
                var response = await _vehControlLlanta.EliminarAsync(id, cancellationToken);
                return Json(new { success = response?.Success ?? false, message = response?.Message });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        private string CleanFolderName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return "Desconocido";

            char[] invalidChars = Path.GetInvalidFileNameChars();
            string clean = string.Join("_", name.Split(invalidChars, StringSplitOptions.RemoveEmptyEntries));
            clean = clean.Replace(" ", "_").Replace("/", "_").Replace("\\", "_");
            return clean;
        }

        [HttpPost("/Llantas/SaveLlanta")]
        public async Task<IActionResult> SaveLlanta([FromForm] VehControlLlantaEditDto model, IFormFile? EvidenciaArchivo, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return Json(new { success = false, message = string.Join(" ", errors) });
            }

            try
            {
                if (EvidenciaArchivo != null && EvidenciaArchivo.Length > 0)
                {
                    // 1. Obtener la marca, modelo y placa del vehículo para estructurar la ruta
                    string brandName = "Desconocida";
                    string modelName = "Desconocido";
                    string plateName = "SinPlaca";

                    var vehResponse = await _vehDatosGenerales.ObtenerPorIdAsync(model.IdVehDatosGenerales, cancellationToken);
                    if (vehResponse != null && vehResponse.Success && vehResponse.Data != null)
                    {
                        modelName = vehResponse.Data.StrModelo;
                        plateName = vehResponse.Data.StrPlaca;

                        var marcaResponse = await _vehCatMarcaVehiculo.ObtenerPorIdAsync(vehResponse.Data.IdVehCatMarcaVehiculo);
                        if (marcaResponse != null && marcaResponse.Success && marcaResponse.Data != null)
                        {
                            brandName = marcaResponse.Data.StrValor;
                        }
                    }

                    // 2. Sanitizar datos de ruta
                    string cleanBrand = CleanFolderName(brandName);
                    string cleanModel = CleanFolderName(modelName);
                    string cleanPlate = CleanFolderName(plateName);

                    string relativePath = $"/Vehiculos/{cleanBrand}/{cleanModel}/{cleanPlate}/Llantas";
                    string physicalPath = Path.Combine(_webHostEnvironment.WebRootPath, "Vehiculos", cleanBrand, cleanModel, cleanPlate, "Llantas");

                    if (!Directory.Exists(physicalPath))
                    {
                        Directory.CreateDirectory(physicalPath);
                    }

                    string extension = Path.GetExtension(EvidenciaArchivo.FileName);
                    string uniqueFileName = $"{Guid.NewGuid()}{extension}";
                    string physicalFilePath = Path.Combine(physicalPath, uniqueFileName);

                    using (var stream = new FileStream(physicalFilePath, FileMode.Create))
                    {
                        await EvidenciaArchivo.CopyToAsync(stream);
                    }

                    model.StrUrlEvidencia = $"{relativePath}/{uniqueFileName}";
                }

                if (model.Id > 0)
                {
                    var response = await _vehControlLlanta.EditarAsync(model, cancellationToken);
                    return Json(new { success = response?.Success ?? false, message = response?.Message, data = response?.Data });
                }
                else
                {
                    var response = await _vehControlLlanta.CrearAsync(model, cancellationToken);
                    return Json(new { success = response?.Success ?? false, message = response?.Message, data = response?.Data });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error al procesar llanta: " + ex.Message });
            }
        }
    }
}
