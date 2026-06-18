using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.EmpCatEntidadFederativa
{
    public class EmpCatEntidadFederativaEditDto : EmpCatEntidadFederativaSaveDto
    {
        [Required]
        public int Id { get; set; }
    }
}
