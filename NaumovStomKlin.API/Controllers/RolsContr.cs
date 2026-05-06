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

        [HttpGet("rols")]

        public ActionResult<List<Role>> GetAll()
        {
            return Ok(_context.Rols.ToList());
        }

        [HttpPost]
        public ActionResult<Role> Create(Role role)
        {
            _context.Rols.Add(role);
            _context.SaveChanges();
            return Ok(role);
        }

        [HttpGet("{id}")]
        public ActionResult<Role> GetById(int id)
        {
            var role = _context.Rols.Find(id);

            if (role == null)
            {
                return NotFound(new { message = $"Роль с id {id} не найден" });
            }

            return Ok(role);

        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var role = _context.Rols.Find(id);

            if (role == null)
            {
                return NotFound(new { message = "Невозможно удалить: роль не найдена" });
            }

            _context.Rols.Remove(role);
            _context.SaveChanges();

            return Ok(new { message = $"Роль с id {id} успешно удалёна" });
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

            catch (DbUpdateException)
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
