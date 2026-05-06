using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NaumovStomKlin.API.Data;
using NaumovStomKlin.API.Models;

namespace NaumovStomKlin.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class Appointment_procedursContr : ControllerBase
    {
        private readonly AppDbContext _context;

        public Appointment_procedursContr(AppDbContext context)

        { _context = context; }

        [HttpGet("appoinment_procedurs")]

        public ActionResult<List<Appointment_procedure>> GetAll()
        {
            return Ok(_context.Appointment_procedurs.ToList());
        }

        

        [HttpPost]
        public ActionResult<Appointment_procedure> Create(Appointment_procedure appointment_procedure)
        {
            _context.Appointment_procedurs.Add(appointment_procedure);
            _context.SaveChanges();
            return Ok(appointment_procedure);
        }

        [HttpGet("{id}")]
        public ActionResult<Appointment_procedure> GetById(int id)
        {
            var appointment_procedure = _context.Appointment_procedurs.Find(id);

            if (appointment_procedure == null)
            {
                return NotFound(new { message = $"Запись на процедуру с id {id} не найден" });
            }

            return Ok(appointment_procedure);

        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var appointment_procedure = _context.Appointment_procedurs.Find(id);

            if (appointment_procedure == null)
            {
                return NotFound(new { message = "Невозможно удалить: запись на процедуру не найдена" });
            }

            _context.Appointment_procedurs.Remove(appointment_procedure);
            _context.SaveChanges();

            return Ok(new { message = $"Запись на процедуру с id {id} успешно удалёна" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppointment_procedure(int id, Appointment_procedure appointment_procedure)
        {
            if (id != appointment_procedure.id)
            {
                return BadRequest();
            }

            _context.Entry(appointment_procedure).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }

            catch (DbUpdateException)
            {
                if (!Appointment_procedureExists(id))
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
        private bool Appointment_procedureExists(int id)
        {
            return _context.Rols.Any(e => e.id == id);
        }

    }
}