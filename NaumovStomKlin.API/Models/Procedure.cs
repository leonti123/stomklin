namespace NaumovStomKlin.API.Models
{
    public class Procedure
    {
        public int id { get; set; }

        public string name { get; set; }

        public int price { get; set; }

        public List<Appointment_procedure>? appointment_procedures { get; set; } = new();
    }

}

