using Microsoft.EntityFrameworkCore;
using NaumovStomKlin.API.Models;


namespace NaumovStomKlin.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Appointment> Appointments { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Role> Rols { get; set; }

        public DbSet<Procedure> Procedurs { get; set; }

        public DbSet<Appointment_procedure> Appointment_procedurs { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.patient)
                .WithMany(u => u.appointments_as_patient)
                .HasForeignKey(a => a.user_id)
                .OnDelete(DeleteBehavior.Restrict); 


            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.doctor)
                .WithMany(u => u.appointments_as_doctor)
                .HasForeignKey(a => a.doctor_id)
                .OnDelete(DeleteBehavior.Restrict);
           
            modelBuilder.Entity<User>()
                .HasOne(u => u.role)
                .WithMany(r => r.users)
                .HasForeignKey(u => u.role_id);
            
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Procedure>()
                .Property(s => s.price)
                .HasColumnType("decimal(18,2)");
        }
    }
}
