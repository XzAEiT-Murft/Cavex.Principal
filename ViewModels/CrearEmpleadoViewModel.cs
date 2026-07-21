using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Cavex.Principal.ViewModels
{
    // ── 1. VALIDACIÓN PERSONALIZADA PARA EDAD MÍNIMA ──
    public class MinAgeAttribute : ValidationAttribute
    {
        private readonly int _minAge;

        public MinAgeAttribute(int minAge)
        {
            _minAge = minAge;
            ErrorMessage = ErrorMessage ?? $"El empleado debe ser mayor de {minAge} años.";
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null)
            {
                return ValidationResult.Success;
            }

            DateOnly birthDate;
            if (value is DateOnly dateOnlyValue)
            {
                birthDate = dateOnlyValue;
            }
            else if (value is string stringValue && DateOnly.TryParse(stringValue, out var parsedDate))
            {
                birthDate = parsedDate;
            }
            else
            {
                return new ValidationResult("Formato de fecha inválido.");
            }

            var today = DateOnly.FromDateTime(DateTime.Today);
            var age = today.Year - birthDate.Year;

            if (birthDate > today.AddYears(-age))
            {
                age--;
            }

            if (age < _minAge)
            {
                return new ValidationResult(ErrorMessage);
            }

            return ValidationResult.Success;
        }
    }

    // ── 2. VIEWMODEL AUXILIAR PARA LA LISTA DINÁMICA DE EXPERIENCIA LABORAL ──
    public class ExperienciaLaboralViewModel
    {
        [Required(ErrorMessage = "La empresa es obligatoria.")]
        [RegularExpression(@"^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,;:'""()\-]+$", ErrorMessage = "La empresa contiene caracteres no permitidos.")]
        public string Empresa { get; set; } = string.Empty;

        [Required(ErrorMessage = "El puesto es obligatorio.")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$", ErrorMessage = "El puesto solo debe contener letras y espacios.")]
        public string Puesto { get; set; } = string.Empty;

        [Required(ErrorMessage = "El área es obligatoria.")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$", ErrorMessage = "El área solo debe contener letras y espacios.")]
        public string Area { get; set; } = string.Empty;

        [Required(ErrorMessage = "La fecha de inicio de la experiencia es obligatoria.")]
        public DateOnly FechaInicio { get; set; }

        [Required(ErrorMessage = "La fecha de fin de la experiencia es obligatoria.")]
        public DateOnly FechaFin { get; set; }

        [Required(ErrorMessage = "El sueldo mensual es obligatorio.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "El sueldo mensual debe ser mayor a 0.")]
        public double Sueldo { get; set; }

        [Required(ErrorMessage = "El motivo de salida es obligatorio.")]
        [RegularExpression(@"^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,;:'""()\-]+$", ErrorMessage = "El motivo de salida contiene caracteres no permitidos.")]
        public string MotivoSalida { get; set; } = string.Empty;
    }

    // ── 3. VIEWMODEL AUXILIAR PARA LA LISTA DINÁMICA DE REFERENCIAS PERSONALES ──
    public class ReferenciaPersonalViewModel
    {
        [Required(ErrorMessage = "El nombre completo de la referencia es obligatorio.")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$", ErrorMessage = "El nombre solo debe contener letras y espacios.")]
        public string NombreCompleto { get; set; } = string.Empty;

        [Required(ErrorMessage = "El parentesco es obligatorio.")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$", ErrorMessage = "El parentesco solo debe contener letras y espacios.")]
        public string Parentesco { get; set; } = string.Empty;

        [Required(ErrorMessage = "El teléfono celular es obligatorio.")]
        [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "El teléfono celular debe tener exactamente 10 dígitos.")]
        public string TelefonoCelular { get; set; } = string.Empty;
    }

    // ── 4. VIEWMODEL PRINCIPAL DE CREACIÓN DE EMPLEADO ──
    public class CreateViewModel : IValidatableObject
    {
        // SECTION 1: DATOS PERSONALES
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$", ErrorMessage = "El nombre solo debe contener letras y espacios.")]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El apellido paterno es obligatorio.")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$", ErrorMessage = "El apellido paterno solo debe contener letras y espacios.")]
        public string ApellidoPaterno { get; set; } = string.Empty;

        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$", ErrorMessage = "El apellido materno solo debe contener letras y espacios.")]
        public string? ApellidoMaterno { get; set; }

        [Required(ErrorMessage = "La fecha de nacimiento es obligatoria.")]
        [MinAge(18, ErrorMessage = "Debe ser mayor de 18 años y una fecha válida (año >= 1900).")]
        public DateOnly FechaNacimiento { get; set; }

        [Required(ErrorMessage = "El RFC es obligatorio.")]
        [RegularExpression(@"^[A-Z&Ññ]{3,4}[0-9]{6}[A-Z0-9]{3}$", ErrorMessage = "RFC inválido. Formato esperado: XXXX000000XXX o XXX000000XXX.")]
        public string Rfc { get; set; } = string.Empty;

        [Required(ErrorMessage = "La CURP es obligatoria.")]
        [RegularExpression(@"^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[A-Z0-9]{2}$", ErrorMessage = "CURP inválida (Ej: XXXX000000XXXXXX00).")]
        public string Curp { get; set; } = string.Empty;

        public int? Edad { get; set; }

        [Required(ErrorMessage = "Debe seleccionar un género.")]
        public string Genero { get; set; } = string.Empty;

        [Required(ErrorMessage = "Debe seleccionar un estado civil.")]
        public string EstadoCivil { get; set; } = string.Empty;

        [Required(ErrorMessage = "Debe seleccionar una nacionalidad.")]
        public string Nacionalidad { get; set; } = string.Empty;

        [Required(ErrorMessage = "El correo electrónico es obligatorio.")]
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com)$", ErrorMessage = "Solo se permiten correos de gmail.com, hotmail.com, outlook.com o yahoo.com.")]
        public string Correo { get; set; } = string.Empty;

        [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "El teléfono fijo debe tener exactamente 10 dígitos.")]
        public string? TelefonoFijo { get; set; }

        [Required(ErrorMessage = "El teléfono celular es obligatorio.")]
        [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "El teléfono celular debe tener exactamente 10 dígitos.")]
        public string TelefonoCelular { get; set; } = string.Empty;

        [Required(ErrorMessage = "El NSS es obligatorio.")]
        [RegularExpression(@"^[0-9]{11}$", ErrorMessage = "El NSS debe tener exactamente 11 dígitos.")]
        public string Nss { get; set; } = string.Empty;

        // SECTION 2: DATOS ACADÉMICOS
        [Required(ErrorMessage = "El nivel de estudios es obligatorio.")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$", ErrorMessage = "El nivel de estudios solo debe contener letras y espacios.")]
        public string NivelEstudios { get; set; } = string.Empty;

        [Required(ErrorMessage = "La institución es obligatoria.")]
        [RegularExpression(@"^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,;:'""()\-]+$", ErrorMessage = "La institución contiene caracteres no permitidos.")]
        public string Institucion { get; set; } = string.Empty;

        [Required(ErrorMessage = "La carrera es obligatoria.")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$", ErrorMessage = "La carrera solo debe contener letras y espacios.")]
        public string Carrera { get; set; } = string.Empty;

        [Required(ErrorMessage = "El estatus es obligatorio.")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$", ErrorMessage = "El estatus solo debe contener letras y espacios.")]
        public string Estatus { get; set; } = string.Empty;

        [Required(ErrorMessage = "La fecha de inicio de estudios es obligatoria.")]
        public DateOnly FechaInicioEstudios { get; set; }

        [Required(ErrorMessage = "La fecha de finalización de estudios es obligatoria.")]
        public DateOnly FechaFinEstudios { get; set; }

        // SECTION 3: EXPERIENCIA LABORAL
        public List<ExperienciaLaboralViewModel> Experiencias { get; set; } = new();

        // SECTION 4: DIRECCIÓN
        [Required(ErrorMessage = "El país es obligatorio.")]
        public string Pais { get; set; } = string.Empty;

        [Required(ErrorMessage = "El estado es obligatorio.")]
        public string Estado { get; set; } = string.Empty;

        [Required(ErrorMessage = "La colonia es obligatoria.")]
        public string Colonia { get; set; } = string.Empty;

        [Required(ErrorMessage = "El código postal es obligatorio.")]
        [RegularExpression(@"^[0-9]{5}$", ErrorMessage = "El código postal debe tener exactamente 5 dígitos.")]
        public string CodigoPostal { get; set; } = string.Empty;

        [Required(ErrorMessage = "El número exterior es obligatorio.")]
        [Range(1, int.MaxValue, ErrorMessage = "El número exterior debe ser mayor a 0.")]
        public int NumeroExterior { get; set; }

        [RegularExpression(@"^[a-zA-Z0-9\s\-]*$", ErrorMessage = "El número interior contiene caracteres no permitidos.")]
        public string? NumeroInterior { get; set; }

        // SECTION 5: CONDICIONES LABORALES
        [Required(ErrorMessage = "El sueldo mensual es obligatorio.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "El sueldo mensual debe ser mayor a 0.")]
        public double SueldoMensual { get; set; }

        [Required(ErrorMessage = "El área laboral es obligatoria.")]
        public string AreaLaboral { get; set; } = string.Empty;

        public bool ViveEnLugarDeTrabajo { get; set; }

        public bool DisponibilidadDeViaje { get; set; }

        public bool ExperienciaEnElCampo { get; set; }

        public bool ExperienciaEnElPuesto { get; set; }

        // SECTION 6: REFERENCIAS PERSONALES
        public List<ReferenciaPersonalViewModel> Referencias { get; set; } = new();

        // SECTION 7: DOCUMENTOS LABORALES
        [Required(ErrorMessage = "La identificación oficial es obligatoria.")]
        public IFormFile Identificacion { get; set; } = default!;

        [Required(ErrorMessage = "El comprobante de domicilio es obligatorio.")]
        public IFormFile Comprobante { get; set; } = default!;

        [Required(ErrorMessage = "El Currículum Vitae (CV) es obligatorio.")]
        public IFormFile Cv { get; set; } = default!;

        [Required(ErrorMessage = "El contrato laboral es obligatorio.")]
        public IFormFile Contrato { get; set; } = default!;

        [Required(ErrorMessage = "La licencia de conducir es obligatoria.")]
        public IFormFile Licencia { get; set; } = default!;

        [Required(ErrorMessage = "La fotografia del empleado es obligatoria.")]
        public IFormFile fotoEmpleado { get; set; } = default!;


        // COMPROBACIONES DE FECHAS CRUZADAS
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (FechaFinEstudios < FechaInicioEstudios)
            {
                yield return new ValidationResult(
                    "La fecha de finalización de estudios no puede ser anterior a la de inicio.",
                    new[] { nameof(FechaFinEstudios) });
            }

            if (Experiencias != null)
            {
                for (int i = 0; i < Experiencias.Count; i++)
                {
                    var exp = Experiencias[i];
                    if (exp.FechaFin < exp.FechaInicio)
                    {
                        yield return new ValidationResult(
                            $"En la experiencia laboral {i + 1}, la fecha de fin no puede ser anterior a la de inicio.",
                            new[] { $"Experiencias[{i}].FechaFin" });
                    }
                }
            }
        }
    }
}
