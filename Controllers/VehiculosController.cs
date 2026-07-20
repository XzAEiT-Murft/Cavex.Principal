using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Threading;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Cavex.Principal.Common;
using Cavex.Principal.Enums;
using Cavex.Principal.Models.VehCatCapacidad;
using Cavex.Principal.Models.VehCatColor;
using Cavex.Principal.Models.VehCatMarcaVehiculo;
using Cavex.Principal.Models.VehCatTaller;
using Cavex.Principal.Models.VehCatTipoCombustible;
using Cavex.Principal.Models.VehCatTipoVehiculo;
using Cavex.Principal.Models.VehDatosGenerales;
using Cavex.Principal.Models.Vehiculo;
using Cavex.Principal.Models.VehControlLlanta;
using Cavex.Principal.Models.VehControlGasolina;
using Cavex.Principal.Models.VehInfracciones;
using Cavex.Principal.Models.VehDaniosAccidentes;
using Cavex.Principal.Models.VehCatGasolineras;
using Cavex.Principal.Models.VehCatAseguradora;
using Cavex.Principal.Models.VehCatResponsableServicio;
using Cavex.Principal.Models.VehAsignacionVehiculos;
using Cavex.Principal.Models.VehCatTransmision;
using Cavex.Principal.Models.VehCatStatus;
using Cavex.Principal.Models.VehCatFormaPago;
using Cavex.Principal.Services.Interfaces;
namespace Cavex.Principal.Controllers
{
    public class VehiculosController : Controller
    {
        private readonly IVehCatColorService _vehCatColorService;
        private readonly IVehCatMarcaVehiculoService _vehCatMarcaVehiculo;
        private readonly IVehCatTipoVehiculoService _vehCatTipoVehiculo;
        private readonly IVehCatCapacidadService _vehCatCapacidad;
        private readonly IVehCatTipoCombustibleService _vehCatTipoCombustible;
        private readonly IVehCatTransmisionService _vehCatTransmisionService;
        private readonly IVehCatStatusService _vehCatStatusService;
        private readonly IVehDatosGeneralesService _vehDatosGenerales;
        private readonly IVehAsignacionVehiculosService _vehAsignacionVehiculos;
        private readonly IVehDaniosAccidentesService _vehDaniosAccidentes;
        private readonly IVehInfraccionesService _vehInfracciones;
        private readonly IVehControlLlantaService _vehControlLlanta;
        private readonly IVehControlGasolinaService _vehControlGasolina;
        private readonly IVehCatGasolinerasService _vehCatGasolineras;
        private readonly IVehCatAseguradoraService _vehCatAseguradora;
        private readonly IVehCatFormaPagoService _vehCatFormaPago;
        private readonly IVehCatResponsableServicioService _vehCatResponsableServicio;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public VehiculosController(
            IVehCatMarcaVehiculoService vehCatMarcaVehiculo, 
            IVehCatColorService vehCatColorService, 
            IVehCatTipoVehiculoService vehCatTipoVehiculo, 
            IVehCatCapacidadService vehCatCapacidad, 
            IVehCatTipoCombustibleService vehCatTipoCombustible, 
            IVehCatTransmisionService vehCatTransmisionService,
            IVehCatStatusService vehCatStatusService,
            IVehDatosGeneralesService vehDatosGenerales,
            IVehAsignacionVehiculosService vehAsignacionVehiculos,
            IVehDaniosAccidentesService vehDaniosAccidentes,
            IVehInfraccionesService vehInfracciones,
            IVehControlLlantaService vehControlLlanta,
            IVehControlGasolinaService vehControlGasolina,
            IVehCatGasolinerasService vehCatGasolineras,
            IVehCatAseguradoraService vehCatAseguradora,
            IVehCatFormaPagoService vehCatFormaPago,
            IVehCatResponsableServicioService vehCatResponsableServicio,
            IWebHostEnvironment webHostEnvironment)
        {
            _vehCatMarcaVehiculo = vehCatMarcaVehiculo;
            _vehCatColorService = vehCatColorService;
            _vehCatTipoVehiculo = vehCatTipoVehiculo;
            _vehCatCapacidad = vehCatCapacidad;
            _vehCatTipoCombustible = vehCatTipoCombustible;
            _vehCatTransmisionService = vehCatTransmisionService;
            _vehCatStatusService = vehCatStatusService;
            _vehDatosGenerales = vehDatosGenerales;
            _vehAsignacionVehiculos = vehAsignacionVehiculos;
            _vehDaniosAccidentes = vehDaniosAccidentes;
            _vehInfracciones = vehInfracciones;
            _vehControlLlanta = vehControlLlanta;
            _vehControlGasolina = vehControlGasolina;
            _vehCatGasolineras = vehCatGasolineras;
            _vehCatAseguradora = vehCatAseguradora;
            _vehCatFormaPago = vehCatFormaPago;
            _vehCatResponsableServicio = vehCatResponsableServicio;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet("/Vehiculos")]
        [HttpGet("/Vehiculos/Index")]
        public IActionResult Index()
        {
            return View();
        }

        // Pantalla frontend de Infracciones
        [HttpGet("/Vehiculos/Infracciones")]
        public IActionResult Infracciones()
        {
            return View();
        }

        // Pantalla frontend de cargas de combustible
        [HttpGet("/Vehiculos/Gasolina")]
        public IActionResult Gasolina()
        {
            return View();
        }

        // Pantalla frontend de control de llantas
        [HttpGet("/Vehiculos/Llantas")]
        public IActionResult Llantas()
        {
            return View();
        }

        // Pantalla frontend de daños y accidentes
        [HttpGet("/Vehiculos/DaniosAccidentes")]
        public IActionResult DaniosAccidentes()
        {
            return View();
        }

        // Pantalla frontend de asignaciones
        [HttpGet("/Vehiculos/Asignaciones")]
        public IActionResult Asignaciones()
        {
            return View();
        }

        // Pantalla de detalle de vehículo
        [HttpGet("/Vehiculos/Detalle/{id:int?}")]
        public IActionResult Detalle(int? id)
        {
            ViewBag.VehiculoId = id ?? 1;
            return View();
        }

        // Pantalla de Agregar gasolineras
        [HttpGet("/Vehiculos/Gasolineras/{id:int?}")]
        public IActionResult Gasolineras(int? id)
        {
            ViewData["GasolineraId"] = id ?? 1;
            return View();
        }

        // Pantalla de Agregar responsables de servicio
        [HttpGet("/Vehiculos/ResponsableServicio")]
        public IActionResult ResponsableServicio()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        #region endpoints de consumo general para la vista (vehiculos y catalogos)

        [HttpGet("/Vehiculos/GetVehiculos")]
        public async Task<IActionResult> GetVehiculos(CancellationToken cancellationToken)
        {
            var response = await _vehDatosGenerales.ObtenerTodosAsync(cancellationToken);
            if (!response.Success)
            {
                return Json(new { success = false, message = response.Message });
            }
            return Json(new { success = true, data = response.Data?.Items ?? Enumerable.Empty<VehDatosGeneralesDto>() });
        }

        [HttpGet("/Vehiculos/GetVehiculo")]
        public async Task<IActionResult> GetVehiculo(int id, CancellationToken cancellationToken)
        {
            var response = await _vehDatosGenerales.ObtenerPorIdAsync(id, cancellationToken);
            if (!response.Success)
            {
                return Json(new { success = false, message = response.Message });
            }
            return Json(new { success = true, data = response.Data });
        }

        [HttpPost("/Vehiculos/DeleteVehiculo")]
        public async Task<IActionResult> DeleteVehiculo(int id, CancellationToken cancellationToken)
        {
            var response = await _vehDatosGenerales.EliminarAsync(id, cancellationToken);
            if (!response.Success)
            {
                return Json(new { success = false, message = response.Message });
            }
            return Json(new { success = true });
        }

        [HttpPost("/Vehiculos/UpdateVehiculoStatus")]
        public async Task<IActionResult> UpdateVehiculoStatus(int id, int idStatus, CancellationToken cancellationToken)
        {
            var existingResponse = await _vehDatosGenerales.ObtenerPorIdAsync(id, cancellationToken);
            if (!existingResponse.Success || existingResponse.Data == null)
            {
                return Json(new { success = false, message = "No se encontró el vehículo." });
            }
            var v = existingResponse.Data;
            VehDatosGeneralesEditDto editDto = new VehDatosGeneralesEditDto
            {
                Id = v.Id,
                StrNumSerie = v.StrNumSerie,
                IdVehCatMarcaVehiculo = v.IdVehCatMarcaVehiculo,
                StrModelo = v.StrModelo,
                IntAnio = v.IntAnio,
                StrVersion = v.StrVersion,
                IdVehCatColor = v.IdVehCatColor,
                StrPlaca = v.StrPlaca,
                StrNumMotor = v.strNumMotor,
                IdVehCatTipoVehiculo = v.IdVehCatTipoVehiculo,
                IdVehCatCapacidad = v.IdVehCatCapacidad,
                IdVehCatTipoCombustible = v.IdVehCatTipoCombustible,
                DecKilometrajeActual = v.DecKilometrajeActual,
                IdVehCatStatus = idStatus,
                StrUrlFoto = v.StrUrlFoto,
                DteFechaRegistro = v.DteFechaRegistro,
                StrObservaciones = v.StrObservaciones,
                StrMotor = v.StrMotor,
                IdVehCatTransmision = v.IdVehCatTransmision
            };
            var apiResult = await _vehDatosGenerales.EditarAsync(editDto, cancellationToken);
            if (apiResult.Success)
            {
                return Json(new { success = true });
            }
            return Json(new { success = false, message = apiResult.Message ?? "No se pudo actualizar el estatus." });
        }

        [HttpGet("/Vehiculos/GetVehiculoCatalogos")]
        public async Task<IActionResult> GetVehiculoCatalogos(CancellationToken cancellationToken)
        {
            var marcas = await _vehCatMarcaVehiculo.ObtenerTodosAsync(1, 100, null, cancellationToken);
            var colors = await _vehCatColorService.ObtenerTodosAsync(1, 100, null, cancellationToken);
            var tipos = await _vehCatTipoVehiculo.ObtenerTodosAsync(1, 100, null, cancellationToken);
            var capacidades = await _vehCatCapacidad.ObtenerTodosAsync(1, 100, null, cancellationToken);
            var combustibles = await _vehCatTipoCombustible.ObtenerTodosAsync(1, 100, null, cancellationToken);
            var transmisiones = await _vehCatTransmisionService.ObtenerTodosAsync(1, 100, null, cancellationToken);
            var statusList = await _vehCatStatusService.ObtenerTodosAsync(cancellationToken);
            var aseguradoras = await _vehCatAseguradora.ObtenerTodosAsync(cancellationToken);
            var gasolineras = await _vehCatGasolineras.ObtenerTodosAsync(cancellationToken);
            var formasPago = await _vehCatFormaPago.ObtenerTodosAsync(cancellationToken);

            return Json(new
            {
                success = true,
                data = new
                {
                    idVehCatMarcaVehiculo = marcas.Data?.Items ?? Enumerable.Empty<VehCatMarcaVehiculoDto>(),
                    idVehCatColor = colors.Data?.Items ?? Enumerable.Empty<VehCatColorDto>(),
                    idVehCatTipoVehiculo = tipos.Data?.Items ?? Enumerable.Empty<VehCatTipoVehiculoDto>(),
                    idVehCatCapacidad = capacidades.Data?.Items ?? Enumerable.Empty<VehCatCapacidadDto>(),
                    idVehCatTipoCombustible = combustibles.Data?.Items ?? Enumerable.Empty<VehCatTipoCombustibleDto>(),
                    idVehCatTransmision = transmisiones.Data?.Items ?? Enumerable.Empty<VehCatTransmisionDto>(),
                    idVehCatStatus = statusList.Data?.Items ?? Enumerable.Empty<VehCatStatusDto>(),
                    idVehCatAseguradora = aseguradoras.Data?.Items ?? Enumerable.Empty<VehCatAseguradoraDto>(),
                    idVehCatGasolineras = gasolineras.Data?.Items ?? Enumerable.Empty<VehCatGasolinerasDto>(),
                    idVehCatFormaPago = formasPago.Data?.Items ?? Enumerable.Empty<VehCatFormaPagoDto>()
                }
            });
        }

        #endregion

        #region Asignaciones de vehículos

        [HttpPost("/Vehiculos/SaveAsignacion")]
        public async Task<IActionResult> SaveAsignacion([FromBody] VehAsignacionVehiculosEditDto model, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return Json(new { success = false, message = string.Join(" ", errors) });
            }

            if (model.Id > 0)
            {
                var response = await _vehAsignacionVehiculos.EditarAsync(model, cancellationToken);
                if (!response.Success) return Json(new { success = false, message = response.Message });
                return Json(new { success = true, message = "Asignación actualizada correctamente.", data = response.Data });
            }
            else
            {
                var response = await _vehAsignacionVehiculos.CrearAsync(model, cancellationToken);
                if (!response.Success) return Json(new { success = false, message = response.Message });
                return Json(new { success = true, message = "Asignación creada correctamente.", data = response.Data });
            }
        }

        [HttpGet("/Vehiculos/GetAsignacionesActivas")]
        public async Task<IActionResult> GetAsignacionesActivas(CancellationToken cancellationToken)
        {
            var response = await _vehAsignacionVehiculos.ObtenerTodosAsync(cancellationToken);
            if (!response.Success)
            {
                return Json(new { success = false, message = response.Message });
            }
            return Json(new { success = true, data = response.Data?.Items ?? Enumerable.Empty<VehAsignacionVehiculosDto>() });
        }

        [HttpPost("/Vehiculos/DeleteAsignacion/{id}")]
        public async Task<IActionResult> DeleteAsignacion(int id, CancellationToken cancellationToken)
        {
            var response = await _vehAsignacionVehiculos.EliminarAsync(id, cancellationToken);
            return Json(new { success = response.Success, message = response.Message });
        }

        // --- DAÑOS ---
        [HttpGet("/Vehiculos/GetDanios")]
        public async Task<IActionResult> GetDanios(CancellationToken cancellationToken)
        {
            var response = await _vehDaniosAccidentes.ObtenerTodosAsync(cancellationToken);
            if (!response.Success) return Json(new { success = false, message = response.Message });
            return Json(new { success = true, data = response.Data?.Items ?? Enumerable.Empty<VehDaniosAccidentesDto>() });
        }

        [HttpPost("/Vehiculos/DeleteDanio/{id}")]
        public async Task<IActionResult> DeleteDanio(int id, CancellationToken cancellationToken)
        {
            var response = await _vehDaniosAccidentes.EliminarAsync(id, cancellationToken);
            return Json(new { success = response.Success, message = response.Message });
        }

        // --- INFRACCIONES ---
        [HttpGet("/Vehiculos/GetInfracciones")]
        public async Task<IActionResult> GetInfracciones(CancellationToken cancellationToken)
        {
            var response = await _vehInfracciones.ObtenerTodosAsync(cancellationToken);
            if (!response.Success) return Json(new { success = false, message = response.Message });
            return Json(new { success = true, data = response.Data?.Items ?? Enumerable.Empty<VehInfraccionesDto>() });
        }

        [HttpPost("/Vehiculos/DeleteInfraccion/{id}")]
        public async Task<IActionResult> DeleteInfraccion(int id, CancellationToken cancellationToken)
        {
            var response = await _vehInfracciones.EliminarAsync(id, cancellationToken);
            return Json(new { success = response.Success, message = response.Message });
        }

        // --- LLANTAS ---
        [HttpGet("/Vehiculos/GetLlantas")]
        public async Task<IActionResult> GetLlantas(CancellationToken cancellationToken)
        {
            var response = await _vehControlLlanta.ObtenerTodosAsync(cancellationToken);
            if (!response.Success) return Json(new { success = false, message = response.Message });
            return Json(new { success = true, data = response.Data?.Items ?? Enumerable.Empty<VehControlLlantaDto>() });
        }

        [HttpPost("/Vehiculos/DeleteLlanta/{id}")]
        public async Task<IActionResult> DeleteLlanta(int id, CancellationToken cancellationToken)
        {
            var response = await _vehControlLlanta.EliminarAsync(id, cancellationToken);
            return Json(new { success = response.Success, message = response.Message });
        }

        [HttpPost("/Vehiculos/SaveDanio")]
        public async Task<IActionResult> SaveDanio([FromForm] VehDaniosAccidentesEditDto model, List<IFormFile>? EvidenciaArchivos, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return Json(new { success = false, message = string.Join(" ", errors) });
            }

            try
            {
                // 1. Obtener la marca, modelo y placa del vehículo para estructurar las carpetas físicamente
                string brandName = "Desconocida";
                string modelName = "Desconocido";
                string plateName = "SinPlaca";
                
                var vehResponse = await _vehDatosGenerales.ObtenerPorIdAsync(model.IdVehDatosGenerales, cancellationToken);
                if (vehResponse.Success && vehResponse.Data != null)
                {
                    modelName = vehResponse.Data.StrModelo;
                    plateName = vehResponse.Data.StrPlaca;
                    
                    var marcaResponse = await _vehCatMarcaVehiculo.ObtenerPorIdAsync(vehResponse.Data.IdVehCatMarcaVehiculo);
                    if (marcaResponse.Success && marcaResponse.Data != null)
                    {
                        brandName = marcaResponse.Data.StrValor;
                    }
                }

                // 2. Sanitizar datos de ruta
                string cleanBrand = CleanFolderName(brandName);
                string cleanModel = CleanFolderName(modelName);
                string cleanPlate = CleanFolderName(plateName);

                string relativePath = $"/Vehiculos/{cleanBrand}/{cleanModel}/{cleanPlate}/Danios";
                string physicalPath = Path.Combine(_webHostEnvironment.WebRootPath, "Vehiculos", cleanBrand, cleanModel, cleanPlate, "Danios");

                // Recopilar urls de evidencias existentes (que vienen en model.StrUrlEvidencia)
                List<string> urlFotosList = new List<string>();
                if (!string.IsNullOrWhiteSpace(model.StrUrlEvidencia))
                {
                    urlFotosList.AddRange(model.StrUrlEvidencia.Split(';', StringSplitOptions.RemoveEmptyEntries));
                }

                // 3. Subir nuevos archivos
                if (EvidenciaArchivos != null && EvidenciaArchivos.Count > 0)
                {
                    if (!Directory.Exists(physicalPath))
                    {
                        Directory.CreateDirectory(physicalPath);
                    }

                    foreach (var file in EvidenciaArchivos)
                    {
                        if (file.Length > 0)
                        {
                            string extension = Path.GetExtension(file.FileName);
                            string uniqueFileName = $"{Guid.NewGuid()}{extension}";
                            string physicalFilePath = Path.Combine(physicalPath, uniqueFileName);

                            using (var stream = new FileStream(physicalFilePath, FileMode.Create))
                            {
                                await file.CopyToAsync(stream);
                            }

                            urlFotosList.Add($"{relativePath}/{uniqueFileName}");
                        }
                    }
                }

                model.StrUrlEvidencia = string.Join(";", urlFotosList);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error al procesar los archivos de evidencia: " + ex.Message });
            }

            if (model.Id > 0)
            {
                var response = await _vehDaniosAccidentes.EditarAsync(model, cancellationToken);
                return Json(new { success = response.Success, message = response.Message, data = response.Data });
            }
            else
            {
                var response = await _vehDaniosAccidentes.CrearAsync(model, cancellationToken);
                return Json(new { success = response.Success, message = response.Message, data = response.Data });
            }
        }

        [HttpPost("/Vehiculos/SaveInfraccion")]
        public async Task<IActionResult> SaveInfraccion([FromForm] VehInfraccionesEditDto model, IFormFile? ComprobanteArchivo, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return Json(new { success = false, message = string.Join(" ", errors) });
            }

            try
            {
                if (ComprobanteArchivo != null && ComprobanteArchivo.Length > 0)
                {
                    // 1. Obtener la marca, modelo y placa del vehículo para estructurar la ruta
                    string brandName = "Desconocida";
                    string modelName = "Desconocido";
                    string plateName = "SinPlaca";

                    var vehResponse = await _vehDatosGenerales.ObtenerPorIdAsync(model.IdVehDatosGenerales, cancellationToken);
                    if (vehResponse.Success && vehResponse.Data != null)
                    {
                        modelName = vehResponse.Data.StrModelo;
                        plateName = vehResponse.Data.StrPlaca;

                        var marcaResponse = await _vehCatMarcaVehiculo.ObtenerPorIdAsync(vehResponse.Data.IdVehCatMarcaVehiculo);
                        if (marcaResponse.Success && marcaResponse.Data != null)
                        {
                            brandName = marcaResponse.Data.StrValor;
                        }
                    }

                    // 2. Sanitizar datos de ruta
                    string cleanBrand = CleanFolderName(brandName);
                    string cleanModel = CleanFolderName(modelName);
                    string cleanPlate = CleanFolderName(plateName);

                    string relativePath = $"/Vehiculos/{cleanBrand}/{cleanModel}/{cleanPlate}/Infracciones";
                    string physicalPath = Path.Combine(_webHostEnvironment.WebRootPath, "Vehiculos", cleanBrand, cleanModel, cleanPlate, "Infracciones");

                    if (!Directory.Exists(physicalPath))
                    {
                        Directory.CreateDirectory(physicalPath);
                    }

                    string extension = Path.GetExtension(ComprobanteArchivo.FileName);
                    string uniqueFileName = $"{Guid.NewGuid()}{extension}";
                    string physicalFilePath = Path.Combine(physicalPath, uniqueFileName);

                    using (var stream = new FileStream(physicalFilePath, FileMode.Create))
                    {
                        await ComprobanteArchivo.CopyToAsync(stream);
                    }

                    model.StrUrlComprobantePago = $"{relativePath}/{uniqueFileName}";
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error al procesar el comprobante de pago: " + ex.Message });
            }

            if (model.Id > 0)
            {
                var response = await _vehInfracciones.EditarAsync(model, cancellationToken);
                return Json(new { success = response.Success, message = response.Message, data = response.Data });
            }
            else
            {
                var response = await _vehInfracciones.CrearAsync(model, cancellationToken);
                return Json(new { success = response.Success, message = response.Message, data = response.Data });
            }
        }

        [HttpPost("/Vehiculos/SaveLlanta")]
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
                    if (vehResponse.Success && vehResponse.Data != null)
                    {
                        modelName = vehResponse.Data.StrModelo;
                        plateName = vehResponse.Data.StrPlaca;

                        var marcaResponse = await _vehCatMarcaVehiculo.ObtenerPorIdAsync(vehResponse.Data.IdVehCatMarcaVehiculo);
                        if (marcaResponse.Success && marcaResponse.Data != null)
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
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error al procesar la evidencia de la llanta: " + ex.Message });
            }

            if (model.Id > 0)
            {
                var response = await _vehControlLlanta.EditarAsync(model, cancellationToken);
                return Json(new { success = response.Success, message = response.Message, data = response.Data });
            }
            else
            {
                var response = await _vehControlLlanta.CrearAsync(model, cancellationToken);
                return Json(new { success = response.Success, message = response.Message, data = response.Data });
            }
        }

        #endregion

        #region Gasolina, Gasolineras y Seguros

        // --- GASOLINA ---
        [HttpGet("/Vehiculos/GetGasolinas")]
        public async Task<IActionResult> GetGasolinas(CancellationToken cancellationToken)
        {
            var response = await _vehControlGasolina.ObtenerTodosAsync(cancellationToken);
            if (!response.Success) return Json(new { success = false, message = response.Message });
            return Json(new { success = true, data = response.Data?.Items ?? Enumerable.Empty<VehControlGasolinaDto>() });
        }

        [HttpPost("/Vehiculos/SaveGasolina")]
        public async Task<IActionResult> SaveGasolina([FromForm] VehControlGasolinaEditDto model, IFormFile? ComprobanteArchivo, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return Json(new { success = false, message = string.Join(" ", errors) });
            }

            try
            {
                if (ComprobanteArchivo != null && ComprobanteArchivo.Length > 0)
                {
                    // 1. Obtener la marca, modelo y placa del vehículo para estructurar la ruta
                    string brandName = "Desconocida";
                    string modelName = "Desconocido";
                    string plateName = "SinPlaca";

                    var vehResponse = await _vehDatosGenerales.ObtenerPorIdAsync(model.IdVehDatosGenerales, cancellationToken);
                    if (vehResponse.Success && vehResponse.Data != null)
                    {
                        modelName = vehResponse.Data.StrModelo;
                        plateName = vehResponse.Data.StrPlaca;

                        var marcaResponse = await _vehCatMarcaVehiculo.ObtenerPorIdAsync(vehResponse.Data.IdVehCatMarcaVehiculo);
                        if (marcaResponse.Success && marcaResponse.Data != null)
                        {
                            brandName = marcaResponse.Data.StrValor;
                        }
                    }

                    // 2. Sanitizar datos de ruta
                    string cleanBrand = CleanFolderName(brandName);
                    string cleanModel = CleanFolderName(modelName);
                    string cleanPlate = CleanFolderName(plateName);

                    string relativePath = $"/Vehiculos/{cleanBrand}/{cleanModel}/{cleanPlate}/Gasolina";
                    string physicalPath = Path.Combine(_webHostEnvironment.WebRootPath, "Vehiculos", cleanBrand, cleanModel, cleanPlate, "Gasolina");

                    if (!Directory.Exists(physicalPath))
                    {
                        Directory.CreateDirectory(physicalPath);
                    }

                    string extension = Path.GetExtension(ComprobanteArchivo.FileName);
                    string uniqueFileName = $"{Guid.NewGuid()}{extension}";
                    string physicalFilePath = Path.Combine(physicalPath, uniqueFileName);

                    using (var stream = new FileStream(physicalFilePath, FileMode.Create))
                    {
                        await ComprobanteArchivo.CopyToAsync(stream);
                    }

                    model.StrUrlComprobantePago = $"{relativePath}/{uniqueFileName}";
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error al procesar el comprobante de pago: " + ex.Message });
            }

            if (model.Id > 0)
            {
                var response = await _vehControlGasolina.EditarAsync(model, cancellationToken);
                return Json(new { success = response.Success, message = response.Message, data = response.Data });
            }
            else
            {
                var saveDto = new VehControlGasolinaSaveDto
                {
                    IdVehDatosGenerales = model.IdVehDatosGenerales,
                    DteFechaCarga = model.DteFechaCarga,
                    MnyMontoPagado = model.MnyMontoPagado,
                    MnyPrecioLitro = model.MnyPrecioLitro,
                    DecKilometrajeActual = model.DecKilometrajeActual,
                    IdVehFormaPago = model.IdVehFormaPago,
                    StrUrlComprobantePago = model.StrUrlComprobantePago,
                    IdVehCatGasolineras = model.IdVehCatGasolineras,
                    IdEmpEmpleado = model.IdEmpEmpleado
                };
                var response = await _vehControlGasolina.CrearAsync(saveDto, cancellationToken);
                return Json(new { success = response.Success, message = response.Message, data = response.Data });
            }
        }

        [HttpPost("/Vehiculos/DeleteGasolina/{id}")]
        public async Task<IActionResult> DeleteGasolina(int id, CancellationToken cancellationToken)
        {
            var response = await _vehControlGasolina.EliminarAsync(id, cancellationToken);
            return Json(new { success = response.Success, message = response.Message });
        }

        // --- GASOLINERAS ---
        [HttpGet("/Vehiculos/Gasolineras/GetGasolineras")]
        public async Task<IActionResult> GetGasolineras(CancellationToken cancellationToken)
        {
            var response = await _vehCatGasolineras.ObtenerTodosAsync(cancellationToken);
            if (!response.Success) return Json(new { success = false, message = response.Message });
            return Json(new { success = true, data = response.Data?.Items ?? Enumerable.Empty<VehCatGasolinerasDto>() });
        }

        [HttpPost("/Vehiculos/Gasolineras/SaveGasolinera")]
        public async Task<IActionResult> SaveGasolinera([FromBody] VehCatGasolinerasSaveDto model, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return Json(new { success = false, message = string.Join(" ", errors) });
            }
            var response = await _vehCatGasolineras.CrearAsync(model, cancellationToken);
            return Json(new { success = response.Success, message = response.Message, data = response.Data });
        }

        [HttpPost("/Vehiculos/Gasolineras/UpdateGasolinera")]
        public async Task<IActionResult> UpdateGasolinera([FromBody] VehCatGasolinerasEditDto model, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return Json(new { success = false, message = string.Join(" ", errors) });
            }
            var response = await _vehCatGasolineras.EditarAsync(model, cancellationToken);
            return Json(new { success = response.Success, message = response.Message, data = response.Data });
        }

        [HttpPost("/Vehiculos/Gasolineras/DeleteGasolinera")]
        public async Task<IActionResult> DeleteGasolinera(int id, CancellationToken cancellationToken)
        {
            var response = await _vehCatGasolineras.EliminarAsync(id, cancellationToken);
            return Json(new { success = response.Success, message = response.Message });
        }

        // --- SEGUROS (ASEGURADORAS) ---
        [HttpGet("/Vehiculos/Seguros")]
        public IActionResult Seguros()
        {
            return View();
        }

        [HttpGet("/Vehiculos/Seguros/GetSeguros")]
        public async Task<IActionResult> GetSeguros(CancellationToken cancellationToken)
        {
            var response = await _vehCatAseguradora.ObtenerTodosAsync(cancellationToken);
            if (!response.Success) return Json(new { success = false, message = response.Message });
            return Json(new { success = true, data = response.Data?.Items ?? Enumerable.Empty<VehCatAseguradoraDto>() });
        }

        [HttpPost("/Vehiculos/Seguros/SaveSeguro")]
        public async Task<IActionResult> SaveSeguro([FromBody] VehCatAseguradoraSaveDto model, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return Json(new { success = false, message = string.Join(" ", errors) });
            }
            var response = await _vehCatAseguradora.CrearAsync(model, cancellationToken);
            return Json(new { success = response.Success, message = response.Message, data = response.Data });
        }

        [HttpPost("/Vehiculos/Seguros/UpdateSeguro")]
        public async Task<IActionResult> UpdateSeguro([FromBody] VehCatAseguradoraEditDto model, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return Json(new { success = false, message = string.Join(" ", errors) });
            }
            var response = await _vehCatAseguradora.EditarAsync(model, cancellationToken);
            return Json(new { success = response.Success, message = response.Message, data = response.Data });
        }

        [HttpPost("/Vehiculos/Seguros/DeleteSeguro")]
        public async Task<IActionResult> DeleteSeguro(int id, CancellationToken cancellationToken)
        {
            var response = await _vehCatAseguradora.EliminarAsync(id, cancellationToken);
            return Json(new { success = response.Success, message = response.Message });
        }

        // --- RESPONSABLES DE SERVICIO ---
        [HttpGet("/Vehiculos/ResponsablesServicio/GetResponsables")]
        public async Task<IActionResult> GetResponsables(CancellationToken cancellationToken)
        {
            var response = await _vehCatResponsableServicio.ObtenerTodosAsync(cancellationToken);
            if (!response.Success) return Json(new { success = false, message = response.Message });
            return Json(new { success = true, data = response.Data?.Items ?? Enumerable.Empty<VehCatResponsableServicioDto>() });
        }

        [HttpPost("/Vehiculos/ResponsablesServicio/SaveResponsable")]
        public async Task<IActionResult> SaveResponsable([FromBody] VehCatResponsableServicioSaveDto model, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return Json(new { success = false, message = string.Join(" ", errors) });
            }
            var response = await _vehCatResponsableServicio.CrearAsync(model, cancellationToken);
            return Json(new { success = response.Success, message = response.Message, data = response.Data });
        }

        [HttpPost("/Vehiculos/ResponsablesServicio/UpdateResponsable")]
        public async Task<IActionResult> UpdateResponsable([FromBody] VehCatResponsableServicioEditDto model, CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return Json(new { success = false, message = string.Join(" ", errors) });
            }
            var response = await _vehCatResponsableServicio.EditarAsync(model, cancellationToken);
            return Json(new { success = response.Success, message = response.Message, data = response.Data });
        }

        [HttpPost("/Vehiculos/ResponsablesServicio/DeleteResponsable")]
        public async Task<IActionResult> DeleteResponsable(int id, CancellationToken cancellationToken)
        {
            var response = await _vehCatResponsableServicio.EliminarAsync(id, cancellationToken);
            return Json(new { success = response.Success, message = response.Message });
        }

        #endregion

        #region Insertar datos del formulario con subida física de imagen
        
        private string CleanFolderName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return "Desconocido";

            char[] invalidChars = Path.GetInvalidFileNameChars();
            string clean = string.Join("_", name.Split(invalidChars, StringSplitOptions.RemoveEmptyEntries));
            clean = clean.Replace(" ", "_").Replace("/", "_").Replace("\\", "_");
            return clean;
        }

        [HttpPost("/Vehiculos/SaveVehiculo")]
        public async Task<IActionResult> SaveVehiculo([FromForm] VehiculoManagerSaveDto managerSaveDto, IFormFile? FotoArchivo, CancellationToken cancellationToken)
        {
            if (managerSaveDto != null)
            {
                bool isEdit = managerSaveDto.Id.HasValue && managerSaveDto.Id.Value > 0;
                VehDatosGeneralesDto? existingVehiculo = null;

                if (isEdit)
                {
                    var existingResponse = await _vehDatosGenerales.ObtenerPorIdAsync(managerSaveDto.Id.Value, cancellationToken);
                    if (!existingResponse.Success || existingResponse.Data == null)
                    {
                        return NotFound(new { success = false, message = "No se encontró el vehículo a editar." });
                    }
                    existingVehiculo = existingResponse.Data;
                }

                // 1. Obtener la marca textual para la carpeta
                string brandName = "Desconocida";
                if (managerSaveDto.VehCatMarcaVehiculo != null)
                {
                    var marcaResponse = await _vehCatMarcaVehiculo.ObtenerPorIdAsync(managerSaveDto.VehCatMarcaVehiculo.Id);
                    if (marcaResponse.Success && marcaResponse.Data != null)
                    {
                        brandName = marcaResponse.Data.StrValor;
                    }
                }

                // 2. Sanitizar datos de ruta
                string cleanBrand = CleanFolderName(brandName);
                string cleanModel = CleanFolderName(managerSaveDto.StrModelo);
                string cleanPlate = CleanFolderName(managerSaveDto.StrPlaca);

                string relativePath = $"/Vehiculos/{cleanBrand}/{cleanModel}/{cleanPlate}";
                string physicalPath = Path.Combine(_webHostEnvironment.WebRootPath, "Vehiculos", cleanBrand, cleanModel, cleanPlate);

                string urlFoto = string.Empty;

                // 3. Subir archivo
                if (FotoArchivo != null && FotoArchivo.Length > 0)
                {
                    if (!Directory.Exists(physicalPath))
                    {
                        Directory.CreateDirectory(physicalPath);
                    }

                    string extension = Path.GetExtension(FotoArchivo.FileName);
                    string uniqueFileName = $"{Guid.NewGuid()}{extension}";
                    string physicalFilePath = Path.Combine(physicalPath, uniqueFileName);

                    using (var stream = new FileStream(physicalFilePath, FileMode.Create))
                    {
                        await FotoArchivo.CopyToAsync(stream);
                    }

                    urlFoto = $"{relativePath}/{uniqueFileName}";

                    // Si es edición, eliminar la foto anterior para no dejar basura
                    if (isEdit && existingVehiculo != null && !string.IsNullOrWhiteSpace(existingVehiculo.StrUrlFoto))
                    {
                        string oldPhysicalPath = Path.Combine(_webHostEnvironment.WebRootPath, existingVehiculo.StrUrlFoto.TrimStart('/'));
                        if (System.IO.File.Exists(oldPhysicalPath))
                        {
                            try { System.IO.File.Delete(oldPhysicalPath); } catch { }
                        }
                    }
                }
                else
                {
                    if (isEdit && existingVehiculo != null)
                    {
                        urlFoto = existingVehiculo.StrUrlFoto;
                    }
                    else
                    {
                        return BadRequest(new { success = false, message = "La foto del vehículo es obligatoria." });
                    }
                }

                // 4. Guardar o Actualizar en BD
                if (isEdit && existingVehiculo != null)
                {
                    VehDatosGeneralesEditDto editDto = new VehDatosGeneralesEditDto
                    {
                        Id = managerSaveDto.Id.Value,
                        StrNumSerie = managerSaveDto.StrNumeroSerie ?? string.Empty,
                        IdVehCatMarcaVehiculo = managerSaveDto.VehCatMarcaVehiculo?.Id ?? 0,
                        StrModelo = managerSaveDto.StrModelo,
                        IntAnio = managerSaveDto.IntAnio,
                        StrVersion = managerSaveDto.StrVersion,
                        IdVehCatColor = managerSaveDto.VehCatColorDto?.Id ?? 0,
                        StrPlaca = managerSaveDto.StrPlaca,
                        StrNumMotor = managerSaveDto.StrNumMotor,
                        IdVehCatTipoVehiculo = managerSaveDto.VehCatTipoVehiculo?.Id ?? 0,
                        IdVehCatCapacidad = managerSaveDto.VehCatCapacidad?.Id ?? 0,
                        IdVehCatTipoCombustible = managerSaveDto.VehCatTipoCombustibleDto?.Id ?? 0,
                        DecKilometrajeActual = managerSaveDto.DecKilometrajeActual,
                        IdVehCatStatus = existingVehiculo.IdVehCatStatus, // Conserva el estatus actual
                        StrUrlFoto = urlFoto,
                        DteFechaRegistro = existingVehiculo.DteFechaRegistro, // Conserva la fecha de registro original
                        StrObservaciones = managerSaveDto.StrDescripcion,
                        StrMotor = managerSaveDto.StrNumMotor,
                        IdVehCatTransmision = managerSaveDto.VehCatTransmisionDto?.Id ?? 0
                    };

                    var apiResult = await _vehDatosGenerales.EditarAsync(editDto, cancellationToken);
                    if (apiResult.Success)
                    {
                        return Ok(new { success = true, message = "Vehículo actualizado correctamente." });
                    }
                    else
                    {
                        return BadRequest(new { success = false, message = apiResult.Message ?? "No se pudieron actualizar los datos." });
                    }
                }
                else
                {
                    VehDatosGeneralesSaveDto saveDto = new VehDatosGeneralesSaveDto
                    {
                        StrNumSerie = managerSaveDto.StrNumeroSerie ?? string.Empty,
                        IdVehCatMarcaVehiculo = managerSaveDto.VehCatMarcaVehiculo?.Id ?? 0,
                        StrModelo = managerSaveDto.StrModelo,
                        IntAnio = managerSaveDto.IntAnio,
                        StrVersion = managerSaveDto.StrVersion,
                        IdVehCatColor = managerSaveDto.VehCatColorDto?.Id ?? 0,
                        StrPlaca = managerSaveDto.StrPlaca,
                        StrNumMotor = managerSaveDto.StrNumMotor,
                        IdVehCatTipoVehiculo = managerSaveDto.VehCatTipoVehiculo?.Id ?? 0,
                        IdVehCatCapacidad = managerSaveDto.VehCatCapacidad?.Id ?? 0,
                        IdVehCatTipoCombustible = managerSaveDto.VehCatTipoCombustibleDto?.Id ?? 0,
                        DecKilometrajeActual = managerSaveDto.DecKilometrajeActual,
                        IdVehCatStatus = (int)EnumStatus.Activo,
                        StrUrlFoto = urlFoto,
                        DteFechaRegistro = DateOnly.FromDateTime(DateTime.Now),
                        StrObservaciones = managerSaveDto.StrDescripcion,
                        StrMotor = managerSaveDto.StrNumMotor,
                        IdVehCatTransmision = managerSaveDto.VehCatTransmisionDto?.Id ?? 0
                    };

                    var apiResult = await _vehDatosGenerales.CrearAsync(saveDto, cancellationToken);
                    if (apiResult.Success || apiResult.StatusCode == System.Net.HttpStatusCode.Created)
                    {
                        return Ok(new { success = true, message = "Vehículo guardado correctamente." });
                    }
                    else
                    {
                        // Si falló, eliminar archivo subido
                        if (!string.IsNullOrEmpty(urlFoto) && System.IO.File.Exists(Path.Combine(physicalPath, Path.GetFileName(urlFoto))))
                        {
                            try { System.IO.File.Delete(Path.Combine(physicalPath, Path.GetFileName(urlFoto))); } catch { }
                        }
                        return BadRequest(new { success = false, message = apiResult.Message ?? "No se pudieron guardar los datos." });
                    }
                }
            }

            return BadRequest(new { success = false, message = "No se pudieron guardar los datos de forma correcta." });
        }

        #endregion


    }
}
