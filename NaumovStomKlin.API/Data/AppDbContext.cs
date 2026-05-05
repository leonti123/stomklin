

using Microsoft.EntityFrameworkCore;
using NaumovStomKlin.API.Models;


namespace NaumovStomKlin.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Stom> Stoms { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Stom>().Property(p => p.Price).HasPrecision(18,2);
        }
    }
}
