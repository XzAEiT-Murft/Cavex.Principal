using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.EmpCatAreaLaboral
{
    public class EmpCatAreaLaboralDto
    {
        public int Id { get; set; }

        [Display(Name = "Area laboral")]
        public required string StrValor { get; set; }

        [Display(Name = "Descripcion")]
        public string? StrDescripcion { get; set; }

        public int IdCatStatus { get; set; }

        [Display(Name = "Estatus")]
        public string StrCatStatus { get; set; } = string.Empty;
    }
}

