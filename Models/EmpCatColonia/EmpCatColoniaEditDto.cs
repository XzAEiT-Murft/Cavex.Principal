using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.EmpCatColonia
{
    public class EmpCatColoniaEditDto : EmpCatColoniaSaveDto
    {
        [Required]
        public int Id { get; set; }
    }
}
