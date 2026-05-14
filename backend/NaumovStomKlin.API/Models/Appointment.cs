using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace NaumovStomKlin.API.Models
{
    public class Appointment
    {
        public int id { get; set; }
        public DateTime appointment_date { get; set; }

        // Явное указание внешних ключей помогает EF правильно строить связи
        public int patient_id { get; set; }
        [ForeignKey("patient_id")]
        public User? patient { get; set; }

        public int doctor_id { get; set; }
        [ForeignKey("doctor_id")]
        public User? doctor { get; set; }

        public string status { get; set; } = string.Empty;

        // Список инициализирован, поэтому он не будет null
        public List<Appointment_procedure> appointment_procedures { get; set; } = [];

        // Расчетное поле
        [NotMapped]
        public decimal total_price
        {
            get
            {
                // Убираем лишнюю проверку на null для списка и суммируем
                // Предполагаем, что ap.procedure.price теперь тоже decimal
                return appointment_procedures.Sum(ap => ap.procedure?.price ?? 0m);
            }
        }
    }
}