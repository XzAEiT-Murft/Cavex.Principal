using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.EmpCatEstadoCivil
{
    public class EmpCatEstadoCivilEditDto : EmpCatEstadoCivilSaveDto
    {
        [Required]
        public int Id { get; set; }
    }
}
