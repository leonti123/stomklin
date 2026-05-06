using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NaumovStomKlin.API.Data;
using NaumovStomKlin.API.Models;

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

        public ActionResult<List<Appointment>> GetAll()
        {
            return Ok(_context.Appointments.ToList());
        }

        [HttpPost]
        public ActionResult<Appointment> Create(Appointment appointment)
        {
            _context.Appointments.Add(appointment);
            _context.SaveChanges();
            return Ok(appointment);
        }

        [HttpGet("{id}")]
        public ActionResult<Appointment> GetById(int id)
        {
            var appointment = _context.Appointments.Find(id);

            if (appointment == null)
            {
                return NotFound(new { message = $"запись на приём с id {id} не найден" });
            }

            return Ok(appointment);

        }
        
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var appointment = _context.Appointments.Find(id);

            if (appointment == null)
            {
                return NotFound(new { message = "Невозможно удалить: запись на приём не найдена" });
            }

            _context.Appointments.Remove(appointment);
            _context.SaveChanges();

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

            catch (DbUpdateException)
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
            return _context.Rols.Any(e => e.id == id);
        }

    }
}




        

    

