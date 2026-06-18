 ﻿using System.ComponentModel.DataAnnotations;

namespace Cavex.Principal.Models.EmpDatosAcademicos
{
    public class EmpDatosAcademicosEditDto : EmpDatosAcademicosSaveDto
    {
        [Required]
        public int Id { get; set; }
    }
}
