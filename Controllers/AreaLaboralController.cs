using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Cavex.Principal.Services.Interfaces;
using Cavex.Principal.Models.EmpCatAreaLaboral;

namespace Cavex.Principal.Controllers
{
    public class AreaLaboralController : Controller
    {
        private readonly IEmpCatAreaLaboralService _serviceAreaLaboral;
        private readonly ICatStatusService _catStatusService;
        private readonly IMemoryCache _cache;
        private const string CacheKey = "areas_list";
        private const string StatusCacheKey = "status_list";

        public AreaLaboralController(IEmpCatAreaLaboralService serviceAreaLaboral, ICatStatusService catStatusService, IMemoryCache cache)
        {
            _serviceAreaLaboral = serviceAreaLaboral;
            _catStatusService = catStatusService;
            _cache = cache;
        }

        // Muestra la vista principal del catálogo
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<JsonResult> GetStatus(CancellationToken cancellationToken)
        {
            var statusItems = _cache.Get<object>(StatusCacheKey);
            if (statusItems != null)
            {
                return Json(new { success = true, data = statusItems });
            }

            var response = await _catStatusService.ObtenerTodosAsync(cancellationToken);
            if (!response.Success || response.Data?.Items == null || !response.Data.Items.Any())
            {
                statusItems = new[]
                {
                    new { id = 1, strValor = "Activo", strDescripcion = "Activo" },
                    new { id = 2, strValor = "Inactivo", strDescripcion = "Inactivo" }
                };
                _cache.Set(StatusCacheKey, statusItems, TimeSpan.FromSeconds(30));
                return Json(new { success = true, data = statusItems });
            }

            statusItems = response.Data.Items;
            _cache.Set(StatusCacheKey, statusItems, TimeSpan.FromMinutes(10));

            return Json(new { success = true, data = statusItems });
        }

        // Obtiene las áreas laborales paginadas con opción de filtrado/búsqueda
        [HttpGet]
        public async Task<JsonResult> GetAreas(int pagina, string? search = null, int pageSize = 10, CancellationToken cancellationToken = default)
        {
            if (pagina < 1) pagina = 1;
            if (pageSize < 1) pageSize = 10;

            var response = await _serviceAreaLaboral.ObtenerTodosAsync(pagina, pageSize, search, cancellationToken);
            if (!response.Success)
            {
                return Json(new { success = false, message = response.Message });
            }

            var items = response.Data?.Items?.ToList() ?? new List<EmpCatAreaLaboralDto>();
            var totalCount = response.Data?.TotalCount ?? 0;

            return Json(new { success = true, data = items, totalCount = totalCount });
        }

        // Registra una nueva área laboral verificando primero que el nombre no esté duplicado
        [HttpPost]
        public async Task<JsonResult> SaveArea([FromBody] EmpCatAreaLaboralSaveDto model, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return Json(new { success = false, message = string.Join(" ", errors) });
            }

            // Valida duplicidad del nombre a nivel general
            var exists = await _serviceAreaLaboral.ExistePorNombreAsync(
                model.StrValor.Trim(),
                null,
                cancellationToken);

            if (exists)
            {
                return Json(new { success = false, message = "El nombre del área laboral ya existe." });
            }

            var response = await _serviceAreaLaboral.CrearAsync(model, cancellationToken);
            if (!response.Success)
            {
                return Json(new { success = false, message = response.Message });
            }

            return Json(new { success = true, data = response.Data });
        }

        // Actualiza un área laboral existente validando duplicidad con otros registros distintos del actual
        [HttpPost]
        public async Task<JsonResult> UpdateArea([FromBody] EmpCatAreaLaboralEditDto model, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return Json(new { success = false, message = string.Join(" ", errors) });
            }

            // Valida duplicidad del nombre excluyendo el registro actual (ID)
            var exists = await _serviceAreaLaboral.ExistePorNombreAsync(
                model.StrValor.Trim(),
                model.Id,
                cancellationToken);

            if (exists)
            {
                return Json(new { success = false, message = "El nombre del área laboral ya existe." });
            }

            var saveModel = new EmpCatAreaLaboralSaveDto
            {
                StrValor = model.StrValor,
                StrDescripcion = model.StrDescripcion,
                IdCatStatus = model.IdCatStatus
            };

            var response = await _serviceAreaLaboral.ActualizarAsync(model.Id, saveModel, cancellationToken);
            if (!response.Success)
            {
                return Json(new { success = false, message = response.Message });
            }

            return Json(new { success = true, data = response.Data });
        }

        // Elimina lógicamente/físicamente el área por ID y limpia la caché asociada
        [HttpPost]
        public async Task<JsonResult> DeleteArea(int id, CancellationToken cancellationToken)
        {
            var response = await _serviceAreaLaboral.EliminarAsync(id, cancellationToken);
            if (!response.Success)
            {
                return Json(new { success = false, message = response.Message });
            }

            // Invalida la lista en caché al haber modificaciones
            _cache.Remove(CacheKey);

            return Json(new { success = true, data = response.Data });
        }
    }
}
