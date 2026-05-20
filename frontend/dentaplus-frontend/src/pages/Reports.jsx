import { useState, useEffect } from 'react';
import { BarChart3, DollarSign, Calendar, Users, TrendingUp } from 'lucide-react';

const API_BASE = 'http://localhost:7057/api';

const getTotalPrice = (app) =>
  app.appointment_procedures?.reduce((sum, ap) => sum + (ap.procedure?.price ?? 0), 0) ?? 0;

export default function Reports() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await fetch(`${API_BASE}/AppointmentContr`);
      setAppointments(await res.json());
    } catch { alert('Ошибка загрузки'); }
    setLoading(false);
  };

  const getRange = () => {
    const now = new Date();
    if (period === 'day') {
      const start = new Date(now); start.setHours(0,0,0,0);
      const end = new Date(now); end.setHours(23,59,59,999);
      return [start, end];
    }
    if (period === 'month') {
      return [new Date(now.getFullYear(), now.getMonth(), 1), new Date(now.getFullYear(), now.getMonth()+1, 0, 23,59,59)];
    }
    if (period === 'year') {
      return [new Date(now.getFullYear(), 0, 1), new Date(now.getFullYear(), 11, 31, 23,59,59)];
    }
    if (period === 'custom' && customFrom && customTo) {
      return [new Date(customFrom), new Date(customTo + 'T23:59:59')];
    }
    return [new Date(0), new Date()];
  };

  const [from, to] = getRange();

  const filtered = appointments.filter(a => {
    const d = new Date(a.appointment_date);
    return d >= from && d <= to;
  });

  const completed = filtered.filter(a => a.status === 'Завершен');
  const totalRevenue = completed.reduce((s, a) => s + getTotalPrice(a), 0);
  const avgCheck = completed.length > 0 ? Math.round(totalRevenue / completed.length) : 0;

  // Выручка по врачам
  const byDoctor = {};
  completed.forEach(a => {
    const name = a.doctor?.name || 'Неизвестно';
    byDoctor[name] = (byDoctor[name] || 0) + getTotalPrice(a);
  });
  const doctorStats = Object.entries(byDoctor).sort((a, b) => b[1] - a[1]);

  if (loading) return <div className="text-center py-20">Загрузка...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-violet-400" />
        Отчёты и аналитика
      </h1>

      {/* Период */}
      <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4 mb-8 flex flex-wrap gap-3 items-center">
        <span className="text-slate-400 text-sm">Период:</span>
        {[
          { key: 'day', label: 'Сегодня' },
          { key: 'month', label: 'Этот месяц' },
          { key: 'year', label: 'Этот год' },
          { key: 'custom', label: 'Произвольный' },
        ].map(p => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === p.key ? 'bg-violet-600 text-white' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            {p.label}
          </button>
        ))}

        {period === 'custom' && (
          <div className="flex gap-2 items-center">
            <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500" />
            <span className="text-slate-500">—</span>
            <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500" />
          </div>
        )}
      </div>

      {/* Карточки */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-6">
          <DollarSign className="w-8 h-8 text-emerald-400 mb-3" />
          <p className="text-slate-400 text-sm">Выручка</p>
          <p className="text-3xl font-bold mt-1">{totalRevenue} ₽</p>
        </div>
        <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-6">
          <Calendar className="w-8 h-8 text-violet-400 mb-3" />
          <p className="text-slate-400 text-sm">Всего записей</p>
          <p className="text-3xl font-bold mt-1">{filtered.length}</p>
        </div>
        <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-6">
          <Users className="w-8 h-8 text-amber-400 mb-3" />
          <p className="text-slate-400 text-sm">Завершено</p>
          <p className="text-3xl font-bold mt-1">{completed.length}</p>
        </div>
        <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-6">
          <TrendingUp className="w-8 h-8 text-sky-400 mb-3" />
          <p className="text-slate-400 text-sm">Средний чек</p>
          <p className="text-3xl font-bold mt-1">{avgCheck} ₽</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Выручка по врачам */}
        <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Выручка по врачам</h2>
          {doctorStats.length === 0 ? (
            <p className="text-slate-500 text-sm">Нет данных</p>
          ) : doctorStats.map(([name, sum]) => (
            <div key={name} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{name}</span>
                <span className="font-bold text-emerald-400">{sum} ₽</span>
              </div>
              <div className="bg-slate-800 rounded-full h-2">
                <div
                  className="bg-violet-500 h-2 rounded-full"
                  style={{ width: `${totalRevenue > 0 ? (sum / totalRevenue * 100) : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Последние приёмы */}
        <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Последние приёмы</h2>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {filtered.slice(0, 10).map(app => {
              const price = getTotalPrice(app);
              return (
                <div key={app.id} className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                  <div>
                    <p className="font-medium">{app.patient?.name || '—'}</p>
                    <p className="text-slate-500 text-xs">{new Date(app.appointment_date).toLocaleDateString('ru-RU')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-bold">{price > 0 ? `${price} ₽` : '—'}</p>
                    <p className="text-xs text-slate-500">{app.status}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
