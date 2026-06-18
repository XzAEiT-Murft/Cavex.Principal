using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.EmpCatEstadoCivil
{
    public class EmpCatEstadoCivilSaveDto
    {
        [Required(ErrorMessage = "El Estado Civil es obligatorio.")]
        [StringLength(150, ErrorMessage = "El valor no puede superar los 150 caracteres.")]
        [Display(Name = "Estado Civil")]
        public string StrValor { get; set; } = string.Empty;

     
        [StringLength(450, ErrorMessage = "El valor no puede superar los 450 caracteres.")]
        [Display(Name = "Descripcion")]
        public string StrDescripcion { get; set; } = string.Empty;
    }
}
