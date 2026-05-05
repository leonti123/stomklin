namespace NaumovStomKlin.API.Models
{
    public class Appointment_procedure
    {
        public int id { get; set; }

        public int appointment_id { get; set; }
        public Appointment appointment { get; set; }

        public int procedure_id { get; set; }
        public Procedure procedure { get; set; }

    }
}
