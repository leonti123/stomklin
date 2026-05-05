using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NaumovStomKlin.API.Data;
using NaumovStomKlin.API.Models;

namespace NaumovStomKlin.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]


    public class StomContr : ControllerBase
    {
        private readonly AppDbContext _context;

        public StomContr(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]

        public ActionResult<List<Stom>> GetAll()
        {
            return Ok(_context.Stoms.ToList());
        }

        [HttpPost]
        public ActionResult<Stom> Create(Stom stom)
        {
            _context.Stoms.Add(stom);
            _context.SaveChanges();
            return Ok(stom);
        }
    }
}




        

    

