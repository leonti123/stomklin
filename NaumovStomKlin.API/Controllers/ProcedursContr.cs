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

        [HttpGet("procedurs")]

        public ActionResult<List<Procedure>> GetAll()
        {
            return Ok(_context.Procedurs.ToList());
        }

        [HttpPost]
        public ActionResult<Procedure> Create(Procedure procedure)
        {
            _context.Procedurs.Add(procedure);
            _context.SaveChanges();
            return Ok(procedure);
        }

        [HttpGet("{id}")]
        public ActionResult<Procedure> GetById(int id)
        {
            var procedure = _context.Procedurs.Find(id);

            if (procedure == null)
            {
                return NotFound(new { message = $"Процедура с id {id} не найден" });
            }

            return Ok(procedure);

        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var procedure = _context.Procedurs.Find(id);

            if (procedure == null)
            {
                return NotFound(new { message = "Невозможно удалить: процедура не найдена" });
            }

            _context.Procedurs.Remove(procedure);
            _context.SaveChanges();

            return Ok(new { message = $"Процедура с id {id} успешно удалёна" });
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

            catch (DbUpdateException)
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
            return _context.Rols.Any(e => e.id == id);
        }

    }
}