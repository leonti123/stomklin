using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    }
}