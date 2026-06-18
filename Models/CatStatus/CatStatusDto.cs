using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.CatStatus
{
    public class CatStatusDto
    {
        public int Id { get; set; }
        [Display(Name = "Estatus")]
        public string StrValor { get; set; } = string.Empty;
        [Display(Name = "Descripcion")]
        public string? StrDescripcion { get; set; }
    }
}
