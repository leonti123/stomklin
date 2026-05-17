using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NaumovStomKlin.API.Data;
using NaumovStomKlin.API.Models;
using System.Security.Cryptography;
using System.Text;

namespace NaumovStomKlin.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // ====================== РЕГИСТРАЦИЯ ======================
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.email) || string.IsNullOrWhiteSpace(dto.password))
                return BadRequest(new { message = "Email и пароль обязательны" });

            if (await _context.Users.AnyAsync(u => u.email == dto.email))
                return BadRequest(new { message = "Пользователь с таким email уже существует" });

            var roleExists = await _context.Rols.AnyAsync(r => r.id == dto.role_id);
            if (!roleExists)
                return BadRequest(new { message = "Указанная роль не существует" });

            var user = new User
            {
                name = dto.name,
                email = dto.email,
                phone_number = dto.phone_number,
                address = dto.address,
                role_id = dto.role_id,
                password_hash = HashPassword(dto.password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Регистрация прошла успешно!" });
        }

        // ====================== ЛОГИН ======================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users
                .Include(u => u.role)
                .FirstOrDefaultAsync(u => u.email == dto.email);

            if (user == null || user.password_hash != HashPassword(dto.password))
                return Unauthorized(new { message = "Неверный email или пароль" });

            return Ok(new
            {
                message = "Вход выполнен успешно",
                user
            });
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToHexString(bytes);
        }
    }

    // DTO классы
    public class RegisterDto
    {
        public string name { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public string phone_number { get; set; }
        public string address { get; set; } = "";
        public int role_id { get; set; }
    }

    public class LoginDto
    {
        public string email { get; set; }
        public string password { get; set; }
    }
}