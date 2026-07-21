using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.VehControlServicio
{
    public class VehControlServicioSaveDto
    {
        public string? StrUrlComprobantePago { get; set; }

        [Required(ErrorMessage = "El vehiculo es obligatorio.")]
        [Display(Name = "Vehiculo")]
        public int IdVehDatosGenerales { get; set; }


        [Required(ErrorMessage = "La fecha de servicio es obligatoria.")]
        [Display(Name = "Fecha de servicio")]
        public DateTime DteFechaServicio { get; set; }

        [Required(ErrorMessage = "El kilometraje actual es obligatorio.")]
        [Display(Name = "Kilometraje actual")]
        public decimal DecKilometrajeActual { get; set; }

        [Required(ErrorMessage = "El taller es obligatorio.")]
        [Display(Name = "Taller")]
        public int IdVehCatTaller { get; set; }

        [Required(ErrorMessage = "El encargado es obligatorio.")]
        [Display(Name = "Encargado")]
        public int IdEmpEmpleado { get; set; } = 0; 


    }
}

        