import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Stethoscope } from 'lucide-react';

const API_BASE = 'http://localhost:7057/api';

export default function Procedures() {
  const { user } = useAuth();
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    duration: ''
  });

  useEffect(() => {
    loadProcedures();
  }, []);

  const loadProcedures = async () => {
    try {
      const res = await fetch(`${API_BASE}/ProcedursContr`);
      const data = await res.json();
      setProcedures(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing 
      ? `${API_BASE}/ProcedursContr/${editing.id}` 
      : `${API_BASE}/ProcedursContr`;

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setShowModal(false);
      setEditing(null);
      setForm({ name: '', description: '', price: '', duration: '' });
      loadProcedures();
    } catch (err) {
      alert('Ошибка сохранения');
    }
  };

  const deleteProcedure = async (id) => {
    if (!confirm('Удалить процедуру?')) return;
    await fetch(`${API_BASE}/ProcedursContr/${id}`, { method: 'DELETE' });
    loadProcedures();
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-4">
            <Stethoscope className="w-10 h-10" /> Процедуры
          </h1>
          <p className="text-slate-400 mt-2">Управление услугами клиники</p>
        </div>

        {(user?.role?.name === 'Администратор' || user?.role?.name === 'Руководство') && (
          <button
            onClick={() => { setEditing(null); setForm({ name: '', description: '', price: '', duration: '' }); setShowModal(true); }}
            className="flex items-center gap-3 bg-violet-600 hover:bg-violet-500 px-6 py-3 rounded-2xl text-white font-medium transition"
          >
            <Plus className="w-5 h-5" /> Добавить процедуру
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-center text-slate-400 py-20">Загрузка...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {procedures.map(proc => (
            <div key={proc.id} className="bg-slate-900 border border-slate-700 rounded-3xl p-8 hover:border-violet-500 transition">
              <h3 className="text-2xl font-semibold text-white mb-3">{proc.name}</h3>
              <p className="text-slate-400 mb-6 line-clamp-3">{proc.description}</p>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-bold text-violet-400">{proc.price} ₽</p>
                  <p className="text-sm text-slate-500">{proc.duration} мин</p>
                </div>

                {(user?.role?.name === 'Администратор' || user?.role?.name === 'Руководство') && (
                  <div className="flex gap-3">
                    <button onClick={() => { setEditing(proc); setForm(proc); setShowModal(true); }} className="p-3 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => deleteProcedure(proc.id)} className="p-3 hover:bg-red-900/30 rounded-xl text-red-400 hover:text-red-300">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-10 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-8 text-white">
              {editing ? 'Редактировать процедуру' : 'Новая процедура'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" placeholder="Название" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white" required />
              <textarea placeholder="Описание" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white h-32" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Цена (₽)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white" required />
                <input type="number" placeholder="Длительность (мин)" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white" required />
              </div>

              <div className="flex gap-4 mt-8">
                <button type="submit" className="flex-1 bg-violet-600 py-4 rounded-2xl text-white font-medium">Сохранить</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 border border-slate-700 rounded-2xl">Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}