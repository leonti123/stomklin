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
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment_procedure>>> GetAll()
        {
            return await _context.Appointment_procedurs
                .Include(ap => ap.procedure)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Appointment_procedure>> Create(Appointment_procedure appointment_procedure)
        {
            if (appointment_procedure == null)
            {
                return BadRequest(new { message = "Данные запроса пусты" });
            }

            // Валидация внешних ключей
            var appointmentExists = await _context.Appointments.AnyAsync(a => a.id == appointment_procedure.appointment_id);
            var procedureExists = await _context.Procedurs.AnyAsync(p => p.id == appointment_procedure.procedure_id);

            if (!appointmentExists || !procedureExists)
            {
                return BadRequest(new
                {
                    message = "Ошибка: Указан несуществующий ID приема или процедуры.",
                    details = new { appointment_found = appointmentExists, procedure_found = procedureExists }
                });
            }

            _context.Appointment_procedurs.Add(appointment_procedure);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = appointment_procedure.id }, appointment_procedure);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment_procedure>> GetById(int id)
        {
            var appointment_procedure = await _context.Appointment_procedurs
                .Include(ap => ap.procedure)
                .FirstOrDefaultAsync(ap => ap.id == id);

            if (appointment_procedure == null)
            {
                return NotFound(new { message = $"Запись на процедуру с id {id} не найдена" });
            }

            return Ok(appointment_procedure);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var appointment_procedure = await _context.Appointment_procedurs.FindAsync(id);

            if (appointment_procedure == null)
            {
                return NotFound(new { message = "Невозможно удалить: запись на процедуру не найдена" });
            }

            _context.Appointment_procedurs.Remove(appointment_procedure);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Запись на процедуру с id {id} успешно удалена" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppointment_procedure(int id, Appointment_procedure appointment_procedure)
        {
            if (id != appointment_procedure.id)
            {
                return BadRequest(new { message = "ID в пути и в теле запроса не совпадают" });
            }

            // ДОБАВЛЕНО: Валидация внешних ключей при обновлении
            var appointmentExists = await _context.Appointments.AnyAsync(a => a.id == appointment_procedure.appointment_id);
            var procedureExists = await _context.Procedurs.AnyAsync(p => p.id == appointment_procedure.procedure_id);

            if (!appointmentExists || !procedureExists)
            {
                return BadRequest(new
                {
                    message = "Ошибка обновления: Указан несуществующий ID приема или процедуры.",
                    details = new { appointment_found = appointmentExists, procedure_found = procedureExists }
                });
            }

            _context.Entry(appointment_procedure).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
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
            return _context.Appointment_procedurs.Any(e => e.id == id);
        }
    }
}