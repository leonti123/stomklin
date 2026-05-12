using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NaumovStomKlin.API.Data;
using NaumovStomKlin.API.Models;

namespace NaumovStomKlin.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class ProcedursContr : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProcedursContr(AppDbContext context)

        { _context = context; }

        [HttpGet] // Убрал лишний подмаршрут "procedurs", чтобы путь был api/ProcedursContr
        public async Task<ActionResult<List<Procedure>>> GetAll()
        {
            // Используем ToListAsync для асинхронности
            return Ok(await _context.Procedurs.ToListAsync());
        }

        [HttpPost]
        public async Task<ActionResult<Procedure>> Create(Procedure procedure)
        {
            _context.Procedurs.Add(procedure);
            await _context.SaveChangesAsync();

            // Возвращаем CreatedAtAction — это стандарт для POST-запросов
            return CreatedAtAction(nameof(GetById), new { id = procedure.id }, procedure);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Procedure>> GetById(int id)
        {
            // Используем FindAsync
            var procedure = await _context.Procedurs.FindAsync(id);

            if (procedure == null)
            {
                return NotFound(new { message = $"Процедура с id {id} не найдена" });
            }

            return Ok(procedure);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            // ИСПРАВЛЕНО: Добавлен await и FindAsync для асинхронности
            var procedure = await _context.Procedurs.FindAsync(id);

            if (procedure == null)
            {
                return NotFound(new { message = "Невозможно удалить: процедура не найдена" });
            }

            _context.Procedurs.Remove(procedure);
            // ИСПРАВЛЕНО: Добавлен await SaveChangesAsync
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Процедура с id {id} успешно удалена" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProcedure(int id, Procedure procedure)
        {
            if (id != procedure.id)
            {
                return BadRequest();
            }

            _context.Entry(procedure).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }

            catch (DbUpdateConcurrencyException)
            {
                if (!ProcedureExists(id))
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
        private bool ProcedureExists(int id)
        {
            return _context.Procedurs.Any(e => e.id == id);
        }

    }
}