using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.EmpCatMunicipio
{
    public class EmpCatMunicipioSaveDto
    {
        [Required(ErrorMessage = "El nombre del Municipio es obligatorio.")]
        [StringLength(150, ErrorMessage = "El valor no puede superar los 150 caracteres.")]
        [Display(Name = "Municipio")]
        public string StrValor { get; set; } = string.Empty;


        [StringLength(450, ErrorMessage = "El valor no puede superar los 450 caracteres.")]
        [Display(Name = "Descripcion")]
        public string StrDescripcion { get; set; } = string.Empty;
    }
}
