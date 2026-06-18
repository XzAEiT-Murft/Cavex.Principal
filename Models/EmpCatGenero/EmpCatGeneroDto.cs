using System.ComponentModel;    
using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.EmpCatGenero
{
    public class EmpCatGeneroDto
    {
        public int Id { get; set; }

        [Display(Name = "Genero")]
        public string StrValor { get; set; }

        [Display(Name = "Descripcion")]
        public string StrDescripcionr { get; set; }


    }
}
