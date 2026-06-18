using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.EmpDatosAcademicos
{
    public class EmpDatosAcademicosSaveDto
    {
        [Required(ErrorMessage = "El nivel de estudios es obligatorio.")]
        [StringLength(200, ErrorMessage = "El valor no puede superar los 200 caracteres.")]
        [Display(Name = "Nivel de Estudios")]
        public string StrNivelEstudios { get; set; } = string.Empty;

        [Required(ErrorMessage = "La institucion es obligatoria.")]
        [StringLength(200, ErrorMessage = "El valor no puede superar los 200 caracteres.")]
        [Display(Name = "Institucion")]
        public string StrIntitucion { get; set; } = string.Empty;

        [StringLength(200, ErrorMessage = "El valor no puede superar los 200 caracteres.")]
        [Display(Name = "Carrera")]
        public string? StrCarrera { get; set; } = string.Empty;

        [Required(ErrorMessage = "El valor es obligatorio.")]
        [StringLength(200, ErrorMessage = "El valor no puede superar los 200 caracteres.")]
        [Display(Name = "Estatus")]
        public string StrEstatus { get; set; } = string.Empty;


        [Required(ErrorMessage = "La fecha de inicio es obligatoria.")]
        [Display(Name = "Fecha de Inicio")]
        public DateOnly DteFechaInicio { get; set; }

        [Required(ErrorMessage = "La fecha de termino es obligatoria.")]
        [Display(Name = "Fecha de Termino")]
        public DateOnly DteFechaFin { get; set; }

       
    }
}
