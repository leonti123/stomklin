using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NaumovStomKlin.API.Data;
using NaumovStomKlin.API.Models;

namespace NaumovStomKlin.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class RolsContr : ControllerBase
    {
        private readonly AppDbContext _context;

        public RolsContr(AppDbContext context)

        { _context = context; }

        [HttpGet] // Убрал "rols", чтобы путь был стандартным: api/RolsContr
        public async Task<ActionResult<List<Role>>> GetAll()
        {
            // Сделал метод асинхронным
            return Ok(await _context.Rols.ToListAsync());
        }

        [HttpPost]
        public async Task<ActionResult<Role>> Create(Role role)
        {
            _context.Rols.Add(role);
            await _context.SaveChangesAsync();

            // Заменил Ok на CreatedAtAction для соблюдения стандартов POST
            return CreatedAtAction(nameof(GetById), new { id = role.id }, role);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Role>> GetById(int id)
        {
            // Сделал метод асинхронным
            var role = await _context.Rols.FindAsync(id);

            if (role == null)
            {
                return NotFound(new { message = $"Роль с id {id} не найдена" });
            }

            return Ok(role);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            // ИСПРАВЛЕНО: Добавлен await и FindAsync
            var role = await _context.Rols.FindAsync(id);

            if (role == null)
            {
                return NotFound(new { message = "Невозможно удалить: роль не найдена" });
            }

            _context.Rols.Remove(role);
            // ИСПРАВЛЕНО: Добавлен await SaveChangesAsync
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Роль с id {id} успешно удалена" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutRole(int id, Role role)
        {
            if (id != role.id)
            {
                return BadRequest();
            }

            _context.Entry(role).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }

            catch (DbUpdateConcurrencyException)
            {
                if (!RoleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }



            }
            return NoContent();
        }
        private bool RoleExists(int id)
        {
            return _context.Rols.Any(e => e.id == id);
        }

    }
}
