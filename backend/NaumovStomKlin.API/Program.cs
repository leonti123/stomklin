using Microsoft.EntityFrameworkCore;
using NaumovStomKlin.API.Data;
using NaumovStomKlin.API.Models;
using System.Security.Cryptography;
using System.Text;

namespace NaumovStomKlin.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Автомиграция и заполнение данных при старте
            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                
                // Повторяем попытку подключения (SQL Server может не успеть стартовать)
                for (int i = 0; i < 10; i++)
                {
                    try
                    {
                        db.Database.Migrate();
                        SeedData(db);
                        break;
                    }
                    catch
                    {
                        Thread.Sleep(5000);
                    }
                }
            }

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("AllowAll");
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }

        private static void SeedData(AppDbContext db)
        {
            // Роли
            if (!db.Rols.Any())
            {
                db.Rols.AddRange(
                    new Role { name = "Пациент" },
                    new Role { name = "Врач" },
                    new Role { name = "Администратор" },
                    new Role { name = "Руководство" }
                );
                db.SaveChanges();
            }

            // Пользователи
            if (!db.Users.Any())
            {
                var roles = db.Rols.ToList();
                int пациент = roles.First(r => r.name == "Пациент").id;
                int врач = roles.First(r => r.name == "Врач").id;
                int админ = roles.First(r => r.name == "Администратор").id;
                int руководство = roles.First(r => r.name == "Руководство").id;

                db.Users.AddRange(
                    new User { name = "Администратор", email = "admin@dental.ru", phone_number = "+79000000000", address = "г. Москва", role_id = админ, password_hash = HashPassword("admin123") },
                    new User { name = "Руководитель", email = "boss@dental.ru", phone_number = "+79009999999", address = "г. Москва", role_id = руководство, password_hash = HashPassword("admin123") },
                    new User { name = "Иванов Иван Иванович", email = "doctor@dental.ru", phone_number = "+79001111111", address = "г. Москва", role_id = врач, password_hash = HashPassword("doctor123"), date_of_birth = new DateTime(1980, 5, 15) },
                    new User { name = "Петров Пётр Петрович", email = "patient@dental.ru", phone_number = "+79002222222", address = "г. Москва", role_id = пациент, password_hash = HashPassword("patient123"), date_of_birth = new DateTime(1990, 3, 20) }
                );
                db.SaveChanges();
            }

            // Процедуры
            if (!db.Procedurs.Any())
            {
                db.Procedurs.AddRange(
                    new Procedure { name = "Чистка зубов", price = 2500 },
                    new Procedure { name = "Пломбирование", price = 3500 },
                    new Procedure { name = "Удаление зуба", price = 2000 },
                    new Procedure { name = "Отбеливание", price = 5000 },
                    new Procedure { name = "Рентген", price = 800 }
                );
                db.SaveChanges();
            }
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToHexString(bytes);
        }
    }
}