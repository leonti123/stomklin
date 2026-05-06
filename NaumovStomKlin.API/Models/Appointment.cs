namespace NaumovStomKlin.API.Models
{
    public class Appointment
    {
        public int Id { get; set; }

        public int user_id { get; set; }

        public User patient { get; set; }

        public int doctor_id { get; set; }

        public User doctor { get; set; }

        public DateTime created_at { get; set; }

        public string status { get; set; }

        public List<Appointment_procedure>? appointment_procedurs { get; set; } = new();



    }
}
