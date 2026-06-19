using Cavex.Principal.Models.EmpCatAreaLaboral;
using Cavex.Principal.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Cavex.Principal.Controllers
{
    public class EmpCatAreaLaboralController : Controller
    {
        private readonly IEmpCatAreaLaboralService _service;

        public EmpCatAreaLaboralController(IEmpCatAreaLaboralService service)
        {
            _service = service;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetAreas(CancellationToken cancellationToken)
        {
            var response = await _service.ObtenerTodosAsync(1, 1000, cancellationToken);
            if (!response.Success)
            {
                return Json(new { success = false, message = response.Message });
            }
            return Json(new { success = true, data = response.Data?.Items });
        }

        [HttpPost]
        public async Task<IActionResult> SaveArea([FromBody] EmpCatAreaLaboralSaveDto model, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return Json(new { success = false, message = string.Join(" ", errors) });
            }

            var response = await _service.CrearAsync(model, cancellationToken);
            if (!response.Success)
            {
                return Json(new { success = false, message = response.Message });
            }
            return Json(new { success = true, data = response.Data });
        }

        [HttpPost]
        public async Task<IActionResult> UpdateArea([FromBody] EmpCatAreaLaboralEditDto model, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return Json(new { success = false, message = string.Join(" ", errors) });
            }

            var saveModel = new EmpCatAreaLaboralSaveDto
            {
                StrValor = model.StrValor,
                StrDescripcion = model.StrDescripcion
            };

            var response = await _service.ActualizarAsync(model.Id, saveModel, cancellationToken);
            if (!response.Success)
            {
                return Json(new { success = false, message = response.Message });
            }
            return Json(new { success = true, data = response.Data });
        }

        [HttpPost]
        public async Task<IActionResult> DeleteArea(int id, CancellationToken cancellationToken)
        {
            var response = await _service.EliminarAsync(id, cancellationToken);
            if (!response.Success)
            {
                return Json(new { success = false, message = response.Message });
            }
            return Json(new { success = true, data = response.Data });
        }
    }
}
