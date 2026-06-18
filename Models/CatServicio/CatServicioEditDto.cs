using Cavex.Principal.Models.ServicioAClientes;
using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.CatServicio
{
    public class CatServicioEditDto : CatServicioSaveDto
    {
        [Required]
        public int Id { get; set; }
    }
}
