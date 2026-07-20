using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cavex.Principal.Models
{
    [Table("EmpTelefono")]
    public class EmpleadoTelefono
    {
        [Key]
        public int Id { get; set; }

        public long BigNumeroFijo { get; set; }

        public long? BigNumeroCelular { get; set; }

        [ForeignKey("EmpEmpleado")]
        public int IdEmpEmpleado { get; set; }
    }
}
