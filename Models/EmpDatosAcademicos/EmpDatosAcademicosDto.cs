using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.EmpCatDatosAcademicos
{
    public class EmpDatosAcademicosDto
    {
        public int Id { get; set; }

        [Display(Name = "Nivel de estudios")]
        public string StrNivelEstudios { get; set; } = string.Empty;

        [Display(Name = "Institucion")]
        public required string StrInstitucion { get; set; }

        [Display(Name = "Carrera")]
        public string? StrCarrera { get; set; }

        [Display(Name = "Estatus")]
        public string? StrEstatus { get; set;}

        [Display(Name = "Fecha de inicio")]
        public DateOnly DteFechaInicio { get; set; }

        [Display(Name = "Fecha de terminacion")]
        public DateOnly DteFechaFin { get; set; }
    }
}
