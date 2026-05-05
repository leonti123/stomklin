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

        [HttpGet("{id}")]
        public ActionResult<User> GetById(int id) 
        {
            var user = _context.Users.Find(id);

            if (user == null) 
            {
                return NotFound(new { message = $"Пользователь с id {id} не найден" });
            }

            return Ok(user);
        
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id) 
        {
            var user = _context.Users.Find(id);

            if (user == null)
            {
                return NotFound(new { message = "Невозможно удалить: пользователь не найден" });
            }

            _context.Users.Remove(user);
            _context.SaveChanges();

            return Ok(new { message = $"Пользователь с id {id} успешно удалён" });
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
