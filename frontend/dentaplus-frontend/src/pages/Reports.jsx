import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Download } from 'lucide-react';

const API_BASE = 'http://localhost:7057/api';

export default function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month'); // day | month | year

  useEffect(() => {
    loadReport();
  }, [period]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/AppointmentContr/report?period=${period}`);
      // Если у тебя ещё нет такого метода — покажем хотя бы статистику из Appointments
      if (!res.ok) {
        const allApps = await fetch(`${API_BASE}/AppointmentContr`).then(r => r.json());
        const completed = allApps.filter(a => a.status === "Завершен");
        const totalRevenue = completed.reduce((sum, a) => sum + (a.total_price || 0), 0);

        setReports([{
          period: period === 'month' ? 'Текущий месяц' : period === 'day' ? 'Сегодня' : 'Год',
          totalAppointments: allApps.length,
          completedAppointments: completed.length,
          totalRevenue: totalRevenue,
          avgCheck: completed.length > 0 ? (totalRevenue / completed.length).toFixed(0) : 0
        }]);
      } else {
        setReports(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-[1126px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold text-[var(--text-h)] flex items-center gap-3">
          <BarChart3 className="w-9 h-9" /> Отчёты и аналитика
        </h1>
        <div className="flex gap-3">
          {['day', 'month', 'year'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-5 py-2 rounded-2xl transition ${period === p ? 'bg-[var(--accent)] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {p === 'day' ? 'Сегодня' : p === 'month' ? 'Месяц' : 'Год'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Загрузка отчёта...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reports.map((r, i) => (
            <div key={i} className="bg-white rounded-3xl border border-[var(--border)] p-8">
              <h3 className="text-xl font-medium mb-6">{r.period}</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-[var(--text)]">Всего записей</p>
                  <p className="text-5xl font-semibold text-[var(--text-h)]">{r.totalAppointments}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text)]">Завершено приёмов</p>
                  <p className="text-5xl font-semibold text-emerald-600">{r.completedAppointments}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text)]">Общая выручка</p>
                  <p className="text-5xl font-semibold text-[var(--accent)]">{r.totalRevenue} ₽</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text)]">Средний чек</p>
                  <p className="text-4xl font-semibold">{r.avgCheck} ₽</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 text-center text-[var(--text)]">
        <p>Отчёты будут расширены после доработки бэкенда</p>
      </div>
    </div>
  );
}