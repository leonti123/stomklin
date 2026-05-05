namespace NaumovStomKlin.API.Models
{
    public class Stom
    {
        public int Id { get; set; }
        public string medicine_category { get; set; }
        public string medicine_name { get; set; }
        public int DATE_OF_MANUFACTURE { get; set; }
        public decimal Price { get; set; }
    }
}
