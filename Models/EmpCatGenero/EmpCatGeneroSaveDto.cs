using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.EmpCatGenero
{
    public class EmpCatGeneroSaveDto
    {
        [Required(ErrorMessage = "El genero es obligatorio.")]
        [StringLength(150, ErrorMessage = "El valor no puede superar los 150 caracteres.")]
        [Display(Name = "Genero")]
        public string StrValor { get; set; } = string.Empty;


        [StringLength(450, ErrorMessage = "El valor no puede superar los 450 caracteres.")]
        [Display(Name = "Descripcion")]
        public string StrDescripcion { get; set; } = string.Empty;
    }
}
