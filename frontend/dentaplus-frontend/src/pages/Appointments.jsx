import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Save, AlertCircle, CheckCircle } from 'lucide-react';

const API_BASE = 'http://localhost:7057/api';

const TIME_SLOTS = [
  '08:00','08:15','08:30','08:45',
  '09:00','09:15','09:30','09:45',
  '10:00','10:15','10:30','10:45',
  '11:00','11:15','11:30','11:45',
  '12:00','12:15','12:30','12:45',
  '13:00','13:15','13:30','13:45',
  '14:00','14:15','14:30','14:45',
  '15:00','15:15','15:30','15:45',
  '16:00','16:15','16:30','16:45',
  '17:00','17:15','17:30','17:45',
  '18:00','18:15','18:30','18:45',
  '19:00','19:15','19:30','19:45'
];

export default function Appointments() {
  const { user } = useAuth();
  const [procedures, setProcedures] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [occupiedSlots, setOccupiedSlots] = useState([]); // занятые времена
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    date: '',
    time: '',
    doctor_id: '',
    procedure_ids: []
  });

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [procRes, userRes] = await Promise.all([
        fetch(`${API_BASE}/ProcedursContr`),
        fetch(`${API_BASE}/UsersContr`)
      ]);
      setProcedures(await procRes.json());
      const users = await userRes.json();
      setDoctors(users.filter(u => u.role?.name === 'Врач'));
    } catch {
      alert('Ошибка загрузки данных');
    }
    setLoading(false);
  };

  // Загружаем занятые слоты при изменении врача или даты
  useEffect(() => {
    if (form.doctor_id && form.date) {
      loadOccupiedSlots();
    } else {
      setOccupiedSlots([]);
    }
  }, [form.doctor_id, form.date]);

  const loadOccupiedSlots = async () => {
    try {
      const res = await fetch(`${API_BASE}/AppointmentContr`);
      const all = await res.json();
      
      const occupied = all
        .filter(a => 
          a.doctor_id === parseInt(form.doctor_id) &&
          a.appointment_date.startsWith(form.date)
        )
        .map(a => a.appointment_date.substring(11, 16)); // HH:mm

      setOccupiedSlots(occupied);
    } catch (err) {
      console.error('Не удалось загрузить занятые слоты');
    }
  };

  const toggleProcedure = (id, price) => {
    setForm(prev => {
      const exists = prev.procedure_ids.includes(id);
      const newIds = exists 
        ? prev.procedure_ids.filter(pid => pid !== id)
        : [...prev.procedure_ids, id];
      setTotalPrice(t => exists ? t - price : t + price);
      return { ...prev, procedure_ids: newIds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.doctor_id || !form.date || !form.time || form.procedure_ids.length === 0) {
      alert('Заполните все поля и выберите хотя бы одну услугу');
      return;
    }

    // Проверка занятости
    if (occupiedSlots.includes(form.time)) {
      alert('❌ Это время уже занято! Выберите другое время.');
      return;
    }

    const appointment_date = `${form.date}T${form.time}:00`;

    try {
      const res = await fetch(`${API_BASE}/AppointmentContr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointment_date,
          doctor_id: parseInt(form.doctor_id),
          patient_id: user.id,
          procedure_ids: form.procedure_ids,
          status: 'Ожидается'
        })
      });

      if (res.ok) {
        setSuccess(true);
        setForm({ date: '', time: '', doctor_id: '', procedure_ids: [] });
        setTotalPrice(0);
        setOccupiedSlots([]);
        setTimeout(() => setSuccess(false), 4000);
      } else {
        alert('Ошибка при создании записи');
      }
    } catch {
      alert('Ошибка соединения с сервером');
    }
  };

  if (loading) return <div className="text-center py-20 text-xl">Загрузка...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Calendar className="w-8 h-8 text-violet-400" />
        Запись на приём
      </h1>

      {success && (
        <div className="mb-6 flex items-center gap-3 bg-emerald-900/40 border border-emerald-500 text-emerald-400 px-6 py-4 rounded-2xl">
          <CheckCircle className="w-5 h-5" />
          Запись успешно создана!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900/70 border border-slate-700 rounded-3xl p-8 space-y-8">

        {/* Врач */}
        <div>
          <label className="block text-slate-400 mb-2">Врач</label>
          <select
            value={form.doctor_id}
            onChange={e => setForm({ ...form, doctor_id: e.target.value, time: '' })}
            className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-violet-500"
            required
          >
            <option value="">— Выберите врача —</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>{doc.name}</option>
            ))}
          </select>
        </div>

        {/* Дата */}
        <div>
          <label className="block text-slate-400 mb-2">Дата приёма</label>
          <input
            type="date"
            value={form.date}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => setForm({ ...form, date: e.target.value, time: '' })}
            className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-violet-500"
            required
          />
        </div>

        {/* Время */}
        <div>
          <label className="block text-slate-400 mb-2">Время приёма (шаг 15 мин)</label>
          <div className="grid grid-cols-6 gap-2">
            {TIME_SLOTS.map(slot => {
              const isOccupied = occupiedSlots.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isOccupied}
                  onClick={() => setForm({ ...form, time: slot })}
                  className={`py-3 text-sm font-medium rounded-xl transition-all ${
                    form.time === slot 
                      ? 'bg-violet-600 text-white' 
                      : isOccupied 
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                        : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          {occupiedSlots.length > 0 && (
            <p className="text-xs text-amber-400 mt-3 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Занятые слоты закрашены серым
            </p>
          )}
        </div>

        {/* Услуги */}
        <div>
          <label className="block text-slate-400 mb-3">Выберите услуги</label>
          <div className="grid grid-cols-2 gap-3">
            {procedures.map(proc => {
              const selected = form.procedure_ids.includes(proc.id);
              return (
                <div
                  key={proc.id}
                  onClick={() => toggleProcedure(proc.id, proc.price)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selected 
                      ? 'border-violet-500 bg-violet-900/30' 
                      : 'border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{proc.name}</p>
                      <p className="text-sm text-slate-400">{proc.price} ₽</p>
                    </div>
                    {selected && <span className="text-violet-400 text-xl">✓</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Итого */}
        <div className="bg-slate-800 rounded-2xl p-6 flex justify-between items-center">
          <span className="text-lg">Итого к оплате:</span>
          <span className="text-4xl font-bold text-violet-400">{totalPrice} ₽</span>
        </div>

        <button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-700 py-5 rounded-2xl text-xl font-medium flex items-center justify-center gap-2 transition"
        >
          <Save className="w-5 h-5" />
          Создать запись
        </button>
      </form>
    </div>
  );
}