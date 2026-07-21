using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.VehRefaccionesUsadas
{
    public class VehRefaccionesUsadasDto
    {
        public int Id { get; set; }

        public int IdVehServicioDetalle { get; set; }

        [Display(Name = "Detalle")]
        public string StrVehServicioDetalle { get; set; } = string.Empty;

        public int IdVehCatRefacciones { get; set; }

        [Display(Name = "Refaccion")]
        public string StrVehCatRefacciones { get; set; } = string.Empty;
    }
}
