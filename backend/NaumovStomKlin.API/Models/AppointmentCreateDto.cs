namespace NaumovStomKlin.API.Models
{
    public class AppointmentCreateDto
    {
        public int patient_id { get; set; }
        public int doctor_id { get; set; }
        public DateTime appointment_date { get; set; }
        public string? status { get; set; } = "Запланирован";

        // Список ID выбранных услуг
        public List<int> procedure_ids { get; set; } = new List<int>();
    }
}