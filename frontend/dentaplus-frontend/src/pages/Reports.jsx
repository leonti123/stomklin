import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Calendar, Users, DollarSign } from 'lucide-react';

const API_BASE = 'http://localhost:7057/api';

export default function Reports() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/AppointmentContr`);
      const allApps = await res.json();

      const filtered = allApps.filter(app => {
        const appDate = new Date(app.appointment_date);
        const now = new Date();
        if (period === 'day') return appDate.toDateString() === now.toDateString();
        if (period === 'month') return appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear();
        return true; // year
      });

      const completed = filtered.filter(a => a.status === "Завершен");
      const totalRevenue = completed.reduce((sum, a) => sum + (a.total_price || 0), 0);

      setStats({
        totalAppointments: filtered.length,
        completed: completed.length,
        revenue: totalRevenue,
        avgCheck: completed.length > 0 ? Math.round(totalRevenue / completed.length) : 0
      });

      setAppointments(filtered);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-[1126px] mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-semibold flex items-center gap-3">
          <BarChart3 className="w-10 h-10" /> Отчёты и аналитика
        </h1>
        
        <div className="flex gap-2">
          {['day', 'month', 'year'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-3 rounded-2xl font-medium transition ${
                period === p 
                  ? 'bg-[var(--accent)] text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {p === 'day' ? 'Сегодня' : p === 'month' ? 'Этот месяц' : 'За год'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-3xl p-8 border border-[var(--border)]">
          <p className="text-sm text-gray-500">Всего записей</p>
          <p className="text-5xl font-bold mt-3">{stats.totalAppointments}</p>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-[var(--border)]">
          <p className="text-sm text-gray-500">Завершено</p>
          <p className="text-5xl font-bold text-emerald-600 mt-3">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-[var(--border)]">
          <p className="text-sm text-gray-500">Выручка</p>
          <p className="text-5xl font-bold text-[var(--accent)] mt-3">{stats.revenue?.toLocaleString()} ₽</p>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-[var(--border)]">
          <p className="text-sm text-gray-500">Средний чек</p>
          <p className="text-5xl font-bold mt-3">{stats.avgCheck} ₽</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Приёмы за период</h2>
      <div className="bg-white rounded-3xl border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-5 text-left">Дата</th>
              <th className="p-5 text-left">Пациент</th>
              <th className="p-5 text-left">Врач</th>
              <th className="p-5 text-left">Статус</th>
              <th className="p-5 text-right">Сумма</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app.id} className="border-t border-[var(--border)]">
                <td className="p-5">{new Date(app.appointment_date).toLocaleDateString('ru-RU')}</td>
                <td className="p-5">{app.patient?.name}</td>
                <td className="p-5">{app.doctor?.name}</td>
                <td className="p-5">
                  <span className={`px-4 py-1 rounded-full text-sm ${app.status === 'Завершен' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {app.status}
                  </span>
                </td>
                <td className="p-5 text-right font-medium">{app.total_price} ₽</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}