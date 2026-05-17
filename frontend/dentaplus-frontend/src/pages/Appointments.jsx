import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Plus, Edit2, Trash2 } from 'lucide-react';

const API_BASE = 'http://localhost:5274/api';

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    appointment_date: '',
    patient_id: '',
    doctor_id: '',
    status: 'Запланирован'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appRes, procRes, userRes] = await Promise.all([
        fetch(`${API_BASE}/AppointmentContr`),
        fetch(`${API_BASE}/ProcedursContr`),
        fetch(`${API_BASE}/UsersContr`)
      ]);

      setAppointments(await appRes.json());
      setProcedures(await procRes.json());
      setUsers(await userRes.json());
    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки данных');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `${API_BASE}/AppointmentContr/${editingId}` 
        : `${API_BASE}/AppointmentContr`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setShowModal(false);
        setEditingId(null);
        setForm({ appointment_date: '', patient_id: '', doctor_id: '', status: 'Запланирован' });
        loadData();
      } else {
        alert('Ошибка сохранения');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка соединения');
    }
  };

  const deleteAppointment = async (id) => {
    if (!confirm('Удалить запись?')) return;
    await fetch(`${API_BASE}/AppointmentContr/${id}`, { method: 'DELETE' });
    loadData();
  };

  const editAppointment = (app) => {
    setForm({
      appointment_date: app.appointment_date.slice(0, 16),
      patient_id: app.patient_id,
      doctor_id: app.doctor_id,
      status: app.status
    });
    setEditingId(app.id);
    setShowModal(true);
  };

  return (
    <div className="max-w-[1126px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold text-[var(--text-h)]">Записи на приём</h1>
        <button
          onClick={() => { 
            setEditingId(null); 
            setForm({ appointment_date: '', patient_id: '', doctor_id: '', status: 'Запланирован' }); 
            setShowModal(true); 
          }}
          className="flex items-center gap-3 bg-[var(--accent)] text-white px-6 py-3 rounded-2xl hover:bg-violet-600 transition"
        >
          <Plus className="w-5 h-5" /> Новая запись
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-5 text-left">Дата и время</th>
              <th className="p-5 text-left">Пациент</th>
              <th className="p-5 text-left">Врач</th>
              <th className="p-5 text-left">Статус</th>
              <th className="p-5 text-center">Действия</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app.id} className="border-t border-[var(--border)] hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-5">{new Date(app.appointment_date).toLocaleString('ru-RU')}</td>
                <td className="p-5">{app.patient?.name || '—'}</td>
                <td className="p-5">{app.doctor?.name || '—'}</td>
                <td className="p-5">
                  <span className="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                    {app.status}
                  </span>
                </td>
                <td className="p-5 text-center space-x-3">
                  <button onClick={() => editAppointment(app)} className="text-blue-600 hover:text-blue-700">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => deleteAppointment(app.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl w-full max-w-lg border border-[var(--border)]">
            <h2 className="text-3xl font-semibold mb-8">
              {editingId ? 'Редактировать запись' : 'Новая запись'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="datetime-local"
                value={form.appointment_date}
                onChange={e => setForm({...form, appointment_date: e.target.value})}
                className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl"
                required
              />

              <select 
                value={form.patient_id} 
                onChange={e => setForm({...form, patient_id: +e.target.value})} 
                className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl" 
                required
              >
                <option value="">Выберите пациента</option>
                {users.filter(u => u.role?.name === "Пациент").map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>

              <select 
                value={form.doctor_id} 
                onChange={e => setForm({...form, doctor_id: +e.target.value})} 
                className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl" 
                required
              >
                <option value="">Выберите врача</option>
                {users.filter(u => u.role?.name !== "Пациент").map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>

              <button 
                type="submit" 
                className="w-full bg-[var(--accent)] text-white py-4 rounded-2xl text-lg font-medium hover:bg-violet-600"
              >
                {editingId ? 'Сохранить изменения' : 'Создать запись'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                className="w-full py-4 text-[var(--text)] hover:bg-gray-100 rounded-2xl"
              >
                Отмена
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}