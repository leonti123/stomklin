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
            base.OnModelCreating(modelBuilder);



            // Связь Пациент
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.patient)
                .WithMany(u => u.appointments_as_patient)
                .HasForeignKey(a => a.patient_id)
                .OnDelete(DeleteBehavior.Restrict);

            // Связь Врач
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.doctor)
                .WithMany(u => u.appointments_as_doctor)
                .HasForeignKey(a => a.doctor_id)
                .OnDelete(DeleteBehavior.Restrict);

            // Связь Пользователь → Роль
            modelBuilder.Entity<User>()
                .HasOne(u => u.role)
                .WithMany(r => r.users)
                .HasForeignKey(u => u.role_id);

            // Настройка поля даты рождения
            modelBuilder.Entity<User>()
                .Property(u => u.date_of_birth)
                .HasColumnType("date");

            // Настройка точности цены
            modelBuilder.Entity<Procedure>()
                .Property(p => p.price)
                .HasColumnType("decimal(18,2)");

            // Можно раскомментировать, если хочешь композитный ключ
            // modelBuilder.Entity<Appointment_procedure>()
            //     .HasKey(ap => new { ap.appointment_id, ap.procedure_id });
        }
    }
}