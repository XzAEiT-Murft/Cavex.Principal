using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.EmpCatGenero
{
    public class EmpCatGeneroEditDto : EmpCatGeneroSaveDto
    {
        [Required]
        public int Id { get; set; }
    }
}
