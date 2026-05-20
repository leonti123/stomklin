import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Calendar } from 'lucide-react';

const API_BASE = 'http://localhost:7057/api';

const STATUS_COLORS = {
  'Ожидается': 'bg-amber-500/20 text-amber-400',
  'Врач принимает': 'bg-blue-500/20 text-blue-400',
  'Завершен': 'bg-emerald-500/20 text-emerald-400',
  'Отменен': 'bg-red-500/20 text-red-400',
};

export default function Cabinet() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadMyAppointments();
  }, [user]);

  const loadMyAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE}/AppointmentContr`);
      const all = await res.json();
      const mine = all
        .filter(a => a.patient_id === user.id)
        .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
      setAppointments(mine);
    } catch { console.error('Ошибка загрузки'); }
    setLoading(false);
  };

  if (loading) return <div className="text-center py-20">Загрузка...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <User className="w-8 h-8 text-violet-400" />
        Личный кабинет
      </h1>
      <p className="text-slate-400 mb-8">Здравствуйте, {user?.name}!</p>

      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        История приёмов
      </h2>

      {appointments.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>У вас пока нет записей</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map(app => (
            <div key={app.id} className="bg-slate-900/70 border border-slate-700 rounded-xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    {new Date(app.appointment_date).toLocaleString('ru-RU', {
                      day: '2-digit', month: 'long', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">Врач: {app.doctor?.name || '—'}</p>
                  {app.appointment_procedures?.length > 0 && (
                    <p className="text-xs text-slate-500 mt-1">
                      {app.appointment_procedures.map(ap => ap.procedure?.name).join(', ')}
                    </p>
                  )}
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full ${STATUS_COLORS[app.status] || 'text-slate-400 bg-slate-800'}`}>
                    {app.status}
                  </span>
                  {app.total_price > 0 && (
                    <p className="text-lg font-bold text-violet-400">{app.total_price} ₽</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
