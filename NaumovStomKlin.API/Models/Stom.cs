namespace NaumovStomKlin.API.Models
{
    public class Stom
    {
        public int Id { get; set; }
        public string medicine { get; set; }
        public string specific_medicine { get; set; }
        public int expiration_date { get; set; }
        public decimal Price { get; set; }
    }
}
