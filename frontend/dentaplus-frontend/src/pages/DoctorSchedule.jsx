import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, User } from 'lucide-react';

const API_BASE = 'http://localhost:7057/api';

export default function DoctorSchedule() {
  const { user } = useAuth();
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadTodayAppointments();
  }, [user]);

  const loadTodayAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE}/AppointmentContr`);
      const all = await res.json();
      
      const today = new Date().toISOString().split('T')[0];
      const myAppointments = all.filter(a => 
        a.doctor_id === user.id && 
        a.appointment_date.startsWith(today)
      );

      setTodayAppointments(myAppointments);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-[1126px] mx-auto">
      <h1 className="text-4xl font-semibold mb-8 flex items-center gap-3">
        <Clock className="w-9 h-9" /> Мой график на сегодня
      </h1>

      {loading ? (
        <p>Загрузка расписания...</p>
      ) : todayAppointments.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-xl">
          На сегодня приёмов нет
        </div>
      ) : (
        <div className="grid gap-6">
          {todayAppointments.map(app => (
            <div key={app.id} className="bg-white rounded-3xl p-8 border border-[var(--border)] flex items-center gap-6">
              <div className="text-5xl font-mono font-bold text-[var(--accent)] w-28">
                {new Date(app.appointment_date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="flex-1">
                <p className="text-2xl font-medium">{app.patient?.name}</p>
                <p className="text-[var(--text)]">{app.patient?.phone_number}</p>
              </div>
              <div className="text-right">
                <span className="px-5 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}