using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NaumovStomKlin.API.Data;
using NaumovStomKlin.API.Models;

namespace NaumovStomKlin.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersContr : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersContr(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<User>>> GetAll()
        {
            var users = await _context.Users
                .Include(u => u.role)
                .ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetById(int id)
        {
            var user = await _context.Users
                .Include(u => u.role)
                .FirstOrDefaultAsync(u => u.id == id);

            if (user == null)
            {
                return NotFound(new { message = $"Пользователь с id {id} не найден" });
            }

            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<User>> Create(User user)
        {
            if (user == null) return BadRequest(new { message = "Данные пусты" });

            // 1. Проверяем существование роли
            var roleExists = await _context.Rols.AnyAsync(r => r.id == user.role_id);
            if (!roleExists)
            {
                return BadRequest(new { message = "Указанная роль не существует" });
            }

            // 2. Проверяем уникальность Email (вместо логина)
            if (await _context.Users.AnyAsync(u => u.email == user.email))
            {
                return BadRequest(new { message = "Пользователь с таким email уже зарегистрирован" });
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = user.id }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.id)
            {
                return BadRequest(new { message = "ID не совпадают" });
            }

            // Проверка роли при обновлении
            var roleExists = await _context.Rols.AnyAsync(r => r.id == user.role_id);
            if (!roleExists)
            {
                return BadRequest(new { message = "Указанная роль не существует" });
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Пользователь не найден" });
            }

            // ВАЖНО: Проверяем, нет ли у этого пользователя (врача) записей на прием
            // Это предотвратит ошибку Foreign Key в базе данных
            var hasAppointments = await _context.Appointments.AnyAsync(a => a.doctor_id == id);
            if (hasAppointments)
            {
                return BadRequest(new { message = "Нельзя удалить сотрудника, у которого есть записи на прием. Сначала удалите или перенесите приемы." });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Пользователь с id {id} успешно удалён" });
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.id == id);
        }
    }
}