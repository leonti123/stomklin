using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    }
}




        

    

