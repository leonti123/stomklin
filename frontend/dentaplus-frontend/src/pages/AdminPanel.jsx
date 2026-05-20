import { useState, useEffect } from 'react';
import { LayoutDashboard, RefreshCw } from 'lucide-react';

const API_BASE = 'http://localhost:7057/api';

const STATUSES = ['Ожидается', 'Врач принимает', 'Завершен', 'Отменен'];

const STATUS_COLORS = {
  'Ожидается': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Врач принимает': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Завершен': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Отменен': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const getTotalPrice = (app) =>
  app.appointment_procedures?.reduce((sum, ap) => sum + (ap.procedure?.price ?? 0), 0) ?? 0;

export default function AdminPanel() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Все');
  const [updating, setUpdating] = useState(null);

  useEffect(() => { loadAppointments(); }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/AppointmentContr`);
      const data = await res.json();
      setAppointments(data.sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)));
    } catch {
      alert('Ошибка загрузки');
    }
    setLoading(false);
  };

  const updateStatus = async (appointment, newStatus) => {
    setUpdating(appointment.id);
    try {
      const res = await fetch(`${API_BASE}/AppointmentContr/${appointment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...appointment, status: newStatus })
      });
      if (res.ok) {
        setAppointments(prev =>
          prev.map(a => a.id === appointment.id ? { ...a, status: newStatus } : a)
        );
      } else {
        alert('Ошибка обновления статуса');
      }
    } catch {
      alert('Ошибка соединения');
    }
    setUpdating(null);
  };

  const filtered = filter === 'Все'
    ? appointments
    : appointments.filter(a => a.status === filter);

  if (loading) return <div className="text-center py-20 text-xl">Загрузка...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-violet-400" />
          Панель управления
        </h1>
        <button
          onClick={loadAppointments}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm transition"
        >
          <RefreshCw className="w-4 h-4" />
          Обновить
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {['Ожидается', 'Врач принимает', 'Завершен', 'Отменен'].map(s => (
          <div key={s} className="bg-slate-900/70 border border-slate-700 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">{appointments.filter(a => a.status === s).length}</p>
            <p className="text-xs text-slate-400 mt-1">{s}</p>
          </div>
        ))}
      </div>

      {/* Фильтр */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['Все', ...STATUSES].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === s
                ? 'bg-violet-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Таблица */}
      <div className="bg-slate-900/70 border border-slate-700 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-400">
            <tr>
              <th className="p-4 text-left">Дата и время</th>
              <th className="p-4 text-left">Пациент</th>
              <th className="p-4 text-left">Врач</th>
              <th className="p-4 text-left">Услуги</th>
              <th className="p-4 text-right">Сумма</th>
              <th className="p-4 text-center">Статус</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">Нет записей</td>
              </tr>
            ) : filtered.map(app => {
              const price = getTotalPrice(app);
              return (
                <tr key={app.id} className="border-t border-slate-700/50 hover:bg-slate-800/30">
                  <td className="p-4">
                    <p className="font-medium">{new Date(app.appointment_date).toLocaleDateString('ru-RU')}</p>
                    <p className="text-slate-400">{new Date(app.appointment_date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="p-4">{app.patient?.name || '—'}</td>
                  <td className="p-4">{app.doctor?.name || '—'}</td>
                  <td className="p-4 text-slate-400 text-xs">
                    {app.appointment_procedures?.length > 0
                      ? app.appointment_procedures.map(ap => ap.procedure?.name).filter(Boolean).join(', ')
                      : '—'}
                  </td>
                  <td className="p-4 text-right font-bold text-emerald-400">
                    {price > 0 ? `${price} ₽` : '—'}
                  </td>
                  <td className="p-4">
                    <select
                      value={app.status}
                      disabled={updating === app.id}
                      onChange={e => updateStatus(app, e.target.value)}
                      className={`text-xs border rounded-lg px-2 py-1.5 font-medium focus:outline-none cursor-pointer bg-transparent ${STATUS_COLORS[app.status] || 'text-slate-400'}`}
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s} className="bg-slate-800 text-white">{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
