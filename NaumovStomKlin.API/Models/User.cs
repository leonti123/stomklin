namespace NaumovStomKlin.API.Models
{
    public class User
    {
        public int id { get; set; }

        public string name { get; set; }

        public string email { get; set; }   

        public string phone_number { get; set; }

        public string address { get; set; }

        public int role_id { get; set; }

        public Role? role { get; set; }

        public List<Appointment>? appointments_as_patient { get; set; } = new();

        public List<Appointment>? appointments_as_doctor { get; set; } = new();
    }
}
