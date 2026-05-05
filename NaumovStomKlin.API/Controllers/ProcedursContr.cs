using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    }
}