using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NaumovStomKlin.API.Data;
using NaumovStomKlin.API.Models;

namespace NaumovStomKlin.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class RolsContr : ControllerBase
    {
        private readonly AppDbContext _context;

        public RolsContr(AppDbContext context)

        { _context = context; }

        [HttpGet("rols")]

        public ActionResult<List<Role>> GetAll()
        {
            return Ok(_context.Rols.ToList());
        }

        [HttpPost]
        public ActionResult<Role> Create(Role role)
        {
            _context.Rols.Add(role);
            _context.SaveChanges();
            return Ok(role);
        }
    }
}
