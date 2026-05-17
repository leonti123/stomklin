import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const API_BASE = 'http://localhost:5274/api';

export default function Procedures() {
  const [procedures, setProcedures] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', price: '' });

  useEffect(() => { 
    loadProcedures(); 
  }, []);

  const loadProcedures = async () => {
    try {
      const res = await fetch(`${API_BASE}/ProcedursContr`);
      setProcedures(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing 
        ? `${API_BASE}/ProcedursContr/${editing.id}` 
        : `${API_BASE}/ProcedursContr`;

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price) })
      });

      setShowModal(false);
      setEditing(null);
      setForm({ name: '', price: '' });
      loadProcedures();
    } catch (err) {
      alert('Ошибка сохранения');
    }
  };

  const deleteProc = async (id) => {
    if (!confirm('Удалить процедуру?')) return;
    await fetch(`${API_BASE}/ProcedursContr/${id}`, { method: 'DELETE' });
    loadProcedures();
  };

  return (
    <div className="max-w-[1126px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold text-[var(--text-h)]">Процедуры</h1>
        <button 
          onClick={() => {setEditing(null); setForm({name:'', price:''}); setShowModal(true);}} 
          className="flex items-center gap-3 bg-[var(--accent)] text-white px-6 py-3 rounded-2xl hover:bg-violet-600 transition"
        >
          <Plus className="w-5 h-5" /> Добавить процедуру
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {procedures.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-[var(--border)]">
            <h3 className="text-2xl font-medium mb-4">{p.name}</h3>
            <p className="text-4xl font-semibold text-[var(--accent)] mb-8">{p.price} ₽</p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => {setEditing(p); setForm({name: p.name, price: p.price}); setShowModal(true);}} 
                className="flex-1 py-3 border border-[var(--border)] rounded-2xl hover:bg-gray-50"
              >
                <Edit2 className="inline w-5 h-5" />
              </button>
              <button 
                onClick={() => deleteProc(p.id)} 
                className="flex-1 py-3 border border-red-300 text-red-600 rounded-2xl hover:bg-red-50"
              >
                <Trash2 className="inline w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl w-full max-w-md border border-[var(--border)]">
            <h2 className="text-3xl font-semibold mb-8">
              {editing ? 'Редактировать процедуру' : 'Новая процедура'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <input 
                type="text" 
                placeholder="Название процедуры" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                required 
                className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl" 
              />
              <input 
                type="number" 
                placeholder="Цена (руб)" 
                value={form.price} 
                onChange={e => setForm({...form, price: e.target.value})} 
                required 
                className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl" 
              />
              <button 
                type="submit" 
                className="w-full bg-[var(--accent)] text-white py-4 rounded-2xl text-lg font-medium hover:bg-violet-600"
              >
                Сохранить
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