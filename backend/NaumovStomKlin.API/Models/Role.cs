namespace NaumovStomKlin.API.Models
{
    public class Role
    {
        public int id { get; set; }

        public string name { get; set; }

        public List<User> users { get; set; } = new();
    }
}

