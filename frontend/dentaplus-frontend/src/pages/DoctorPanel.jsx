import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, ChevronDown, ChevronUp, User } from 'lucide-react';

const API_BASE = 'http://localhost:7057/api';

const STATUS_COLORS = {
  'Ожидается': 'bg-amber-500/20 text-amber-400',
  'Врач принимает': 'bg-blue-500/20 text-blue-400',
  'Завершен': 'bg-emerald-500/20 text-emerald-400',
  'Отменен': 'bg-red-500/20 text-red-400',
};

export default function DoctorPanel() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null); // patient_id
  const [search, setSearch] = useState('');

  useEffect(() => { loadAppointments(); }, []);

  const loadAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE}/AppointmentContr`);
      const all = await res.json();
      setAppointments(all.filter(a => a.doctor_id === user.id));
    } catch { alert('Ошибка загрузки'); }
    setLoading(false);
  };

  // Группируем по пациентам
  const patientMap = {};
  appointments.forEach(a => {
    const id = a.patient_id;
    if (!patientMap[id]) {
      patientMap[id] = { patient: a.patient, visits: [] };
    }
    patientMap[id].visits.push(a);
  });

  // Сортируем визиты каждого пациента по дате (новые первые)
  Object.values(patientMap).forEach(p => {
    p.visits.sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
  });

  const patients = Object.values(patientMap).filter(p =>
    !search || p.patient?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center py-20">Загрузка...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <Stethoscope className="w-8 h-8 text-violet-400" />
        Мои пациенты
      </h1>
      <p className="text-slate-400 mb-8">Добро пожаловать, {user?.name}</p>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{patients.length}</p>
          <p className="text-xs text-slate-400 mt-1">Пациентов</p>
        </div>
        <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{appointments.length}</p>
          <p className="text-xs text-slate-400 mt-1">Всего приёмов</p>
        </div>
        <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{appointments.filter(a => a.status === 'Завершен').length}</p>
          <p className="text-xs text-slate-400 mt-1">Завершено</p>
        </div>
      </div>

      {/* Поиск */}
      <input
        type="text"
        placeholder="Поиск пациента..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white mb-4 focus:outline-none focus:border-violet-500"
      />

      {/* Список пациентов */}
      {patients.length === 0 ? (
        <p className="text-center text-slate-500 py-12">Пациентов не найдено</p>
      ) : (
        <div className="space-y-3">
          {patients.map(({ patient, visits }) => {
            const isOpen = expanded === patient?.id;
            const lastVisit = visits[0];
            return (
              <div key={patient?.id} className="bg-slate-900/70 border border-slate-700 rounded-xl overflow-hidden">
                {/* Заголовок пациента */}
                <button
                  onClick={() => setExpanded(isOpen ? null : patient?.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-800/50 transition text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-violet-900/50 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="font-semibold">{patient?.name || '—'}</p>
                      <p className="text-xs text-slate-400">
                        Последний визит: {lastVisit ? new Date(lastVisit.appointment_date).toLocaleDateString('ru-RU') : '—'}
                        {' · '}{visits.length} {visits.length === 1 ? 'визит' : visits.length < 5 ? 'визита' : 'визитов'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[lastVisit?.status] || 'text-slate-400 bg-slate-800'}`}>
                      {lastVisit?.status}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {/* История визитов */}
                {isOpen && (
                  <div className="border-t border-slate-700 divide-y divide-slate-800">
                    {visits.map(v => (
                      <div key={v.id} className="px-5 py-4 flex justify-between items-start bg-slate-800/30">
                        <div>
                          <p className="text-sm font-medium">
                            {new Date(v.appointment_date).toLocaleString('ru-RU', {
                              day: '2-digit', month: 'long', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                          {v.appointment_procedures?.length > 0 && (
                            <p className="text-xs text-slate-400 mt-1">
                              {v.appointment_procedures.map(ap => ap.procedure?.name).join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[v.status] || 'text-slate-400 bg-slate-800'}`}>
                            {v.status}
                          </span>
                          {v.total_price > 0 && (
                            <p className="text-sm font-bold text-violet-400">{v.total_price} ₽</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
