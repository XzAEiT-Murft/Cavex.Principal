using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.VehCatArrendatario
{
    public class VehCatArrendatarioDto
    {
        public int Id { get; set; }

        [Display(Name = "Arrendatario")]
        public required string StrValor { get; set; }

        [Display(Name = "Descripcion")]
        public string? StrDescripcion { get; set; }
    }
}
