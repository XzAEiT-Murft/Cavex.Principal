using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.CatStatus
{
    public class CatStatusEditDto : CatStatusSaveDto
    {
        [Required]
        public int Id { get; set; }
    }
}
