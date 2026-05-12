using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NaumovStomKlin.API.Data;
using NaumovStomKlin.API.Models;
using System.Threading.Tasks;

namespace NaumovStomKlin.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]


    public class AppointmentContr : ControllerBase
    {
        private readonly AppDbContext _context;

        public AppointmentContr(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Appointment>>> GetAll()
        {

            var appointments = await _context.Appointments
                 .Include(a => a.patient)
                 .Include(a => a.doctor)
                 .Include(a => a.appointment_procedurs!)
                 .ThenInclude(ap => ap.procedure)
                 .ToListAsync();
            return Ok(appointments);
        }

        [HttpPost]
        public async Task<ActionResult<Appointment>> Create(Appointment appointment)
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = appointment.Id }, appointment);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetById(int id)
        {
            // Используем FirstOrDefaultAsync с Include, чтобы получить полную инфу
            var appointment = await _context.Appointments
                .Include(a => a.patient)
                .Include(a => a.doctor)
                .Include(a => a.appointment_procedurs!)
                    .ThenInclude(ap => ap.procedure)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
            {
                return NotFound(new { message = $"Запись на приём с id {id} не найдена" });
            }

            return Ok(appointment);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            // ИСПРАВЛЕНО: Добавлен await и FindAsync
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
            {
                return NotFound(new { message = "Невозможно удалить: запись на приём не найдена" });
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Запись на приём с id {id} успешно удалёна" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppointment(int id, Appointment appointment)
        {
            if (id != appointment.Id)
            {
                return BadRequest();
            }

            _context.Entry(appointment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }

            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentExists(id))
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
        private bool AppointmentExists(int id)
        {
            return _context.Appointments.Any(e => e.Id == id);
        }

    }
}




        

    

