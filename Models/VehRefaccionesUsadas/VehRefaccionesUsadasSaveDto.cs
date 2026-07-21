using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.VehRefaccionesUsadas
{
    public class VehRefaccionesUsadasSaveDto
    {
        [Required(ErrorMessage = "El detalle")]
        [Display(Name = "Servicio")]
        public int IdVehServicioDetalle { get; set; }

        [Required(ErrorMessage = "La refaccion es obligatoria.")]
        [Display(Name = "Refaccion")]
        public int IdVehCatRefacciones { get; set; }
    }
}
