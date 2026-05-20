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
                 .Include(a => a.appointment_procedures!)
                    .ThenInclude(ap => ap.procedure)
                 .ToListAsync();
            return Ok(appointments);
        }

        [HttpPost]
        public async Task<ActionResult<Appointment>> Create([FromBody] AppointmentCreateDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Данные приёма пусты" });

            // Проверка существования пациента и врача
            var patientExists = await _context.Users.AnyAsync(u => u.id == dto.patient_id);
            var doctorExists = await _context.Users.AnyAsync(u => u.id == dto.doctor_id);

            if (!patientExists || !doctorExists)
                return BadRequest(new { message = "Пациент или врач не найден" });

            // Проверка двойной записи (уже было — оставляем)
            var isDoubleBooking = await _context.Appointments.AnyAsync(a =>
                a.doctor_id == dto.doctor_id &&
                a.appointment_date == dto.appointment_date &&
                a.status != "Отменен");

            if (isDoubleBooking)
                return BadRequest(new { message = "Врач уже занят на это время. Выберите другое время." });

            // Создаём Appointment
            var appointment = new Appointment
            {
                patient_id = dto.patient_id,
                doctor_id = dto.doctor_id,
                appointment_date = dto.appointment_date,
                status = dto.status ?? "Запланирован"
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();        // Сохраняем, чтобы получить ID

            // Сохраняем выбранные услуги в Appointment_procedure
            if (dto.procedure_ids != null && dto.procedure_ids.Any())
            {
                foreach (var procId in dto.procedure_ids)
                {
                    _context.Appointment_procedurs.Add(new Appointment_procedure
                    {
                        appointment_id = appointment.id,
                        procedure_id = procId
                    });
                }
                await _context.SaveChangesAsync();
            }

            // Возвращаем полную запись с подгруженными данными
            var created = await _context.Appointments
                .Include(a => a.patient)
                .Include(a => a.doctor)
                .Include(a => a.appointment_procedures!)
                    .ThenInclude(ap => ap.procedure)
                .FirstOrDefaultAsync(a => a.id == appointment.id);

            return CreatedAtAction(nameof(GetById), new { id = appointment.id }, created);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetById(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.patient)
                .Include(a => a.doctor)
                .Include(a => a.appointment_procedures!)
                    .ThenInclude(ap => ap.procedure)
                .FirstOrDefaultAsync(a => a.id == id);

            if (appointment == null) return NotFound(new { message = $"Запись с id {id} не найдена" });

            return Ok(appointment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppointment(int id, Appointment appointment)
        {
            if (id != appointment.id) return BadRequest(new { message = "ID не совпадают" });

            // Исправлено: объединили проверку и добавили null-safety (!)
            var patientExists = await _context.Users.AnyAsync(u => u.id == appointment.patient_id && u.role!.name == "Пациент");
            var doctorExists = await _context.Users.AnyAsync(u => u.id == appointment.doctor_id);

            if (!patientExists || !doctorExists)
            {
                return BadRequest(new
                {
                    message = "Ошибка обновления: Указан несуществующий пациент или врач.",
                    details = new { patient_found = patientExists, doctor_found = doctorExists }
                });
            }

            _context.Entry(appointment).State = EntityState.Modified;

            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentExists(id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return NotFound(new { message = "Запись не найдена" });

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Запись {id} успешно удалена" });
        }

        private bool AppointmentExists(int id)
        {
            return _context.Appointments.Any(e => e.id == id);
        }
    }
}