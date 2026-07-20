using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.EmpCatMunicipio
{
    public class EmpCatMunicipioDto
    {
        public int Id { get; set; }

        [Display(Name = "Municipio")]
        public required string StrValor { get; set; }
        
        [Display(Name = "Descripcion")]
        public string? StrDescripcion { get; set; }
    }
}
