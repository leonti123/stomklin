using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NaumovStomKlin.API.Data;
using NaumovStomKlin.API.Models;

namespace NaumovStomKlin.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class UsersContr : ControllerBase
    {
        private readonly AppDbContext _context; 
        
        public UsersContr(AppDbContext context)

        {  _context = context; }

        [HttpGet("users")]

        public ActionResult<List<User>> GetAll()
        {
            return Ok(_context.Users.ToList());
        }

        [HttpPost]
        public ActionResult<User> Create(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok(user);
        }
    }
}
