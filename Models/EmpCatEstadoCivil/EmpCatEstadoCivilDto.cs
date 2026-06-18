using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.EmpCatEstadoCivil
{
    public class EmpCatEstadoCivilDto
    {
        public int Id { get; set; }

        [Display(Name = "Estado Civil")]
        public string StrValor { get; set; }

        [Display(Name = "Descripcion")]
        public string StrDescripcion { get; set; }
    }
}
