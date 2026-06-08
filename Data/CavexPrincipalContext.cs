using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Cavex.Principal.Models;

namespace Cavex.Principal.Data
{
    public class CavexPrincipalContext : DbContext
    {
        public CavexPrincipalContext(DbContextOptions<CavexPrincipalContext> options)
            : base(options)
        {
        }

        public DbSet<ServicioACliente> ServicioACliente { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ServicioACliente>().ToTable("catServicios");
        }
    }
}