import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const API_BASE = 'https://localhost:7057/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    role_id: 1
  });

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    const res = await fetch(`${API_BASE}/UsersContr`);
    setUsers(await res.json());
  };

  const loadRoles = async () => {
    const res = await fetch(`${API_BASE}/RolsContr`);
    setRoles(await res.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing 
        ? `${API_BASE}/UsersContr/${editing.id}` 
        : `${API_BASE}/UsersContr`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setShowModal(false);
        setEditing(null);
        setForm({ name: '', email: '', phone_number: '', address: '', role_id: 1 });
        loadUsers();
      } else {
        alert('Ошибка сохранения');
      }
    } catch (err) {
      alert('Ошибка соединения');
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Удалить пользователя?')) return;
    await fetch(`${API_BASE}/UsersContr/${id}`, { method: 'DELETE' });
    loadUsers();
  };

  const editUser = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      address: user.address,
      role_id: user.role_id
    });
    setEditing(user);
    setShowModal(true);
  };

  return (
    <div className="max-w-[1126px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold text-[var(--text-h)]">Пользователи</h1>
        <button
          onClick={() => { 
            setEditing(null); 
            setForm({ name: '', email: '', phone_number: '', address: '', role_id: 1 }); 
            setShowModal(true); 
          }}
          className="flex items-center gap-3 bg-[var(--accent)] text-white px-6 py-3 rounded-2xl hover:bg-violet-600 transition"
        >
          <Plus className="w-5 h-5" /> Добавить пользователя
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-5 text-left">Имя</th>
              <th className="p-5 text-left">Email</th>
              <th className="p-5 text-left">Телефон</th>
              <th className="p-5 text-left">Роль</th>
              <th className="p-5 text-center">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t border-[var(--border)] hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-5 font-medium">{user.name}</td>
                <td className="p-5">{user.email}</td>
                <td className="p-5">{user.phone_number}</td>
                <td className="p-5">
                  <span className="px-4 py-1 bg-violet-100 text-violet-700 rounded-full text-sm">
                    {user.role?.name || '—'}
                  </span>
                </td>
                <td className="p-5 text-center space-x-3">
                  <button onClick={() => editUser(user)} className="text-blue-600 hover:text-blue-700">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модальное окно */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl w-full max-w-lg border border-[var(--border)]">
            <h2 className="text-3xl font-semibold mb-8">
              {editing ? 'Редактировать пользователя' : 'Новый пользователь'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" placeholder="ФИО" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl" />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl" />
              <input type="text" placeholder="Телефон" value={form.phone_number} onChange={e => setForm({...form, phone_number: e.target.value})} className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl" />
              <input type="text" placeholder="Адрес" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl" />
              
              <select value={form.role_id} onChange={e => setForm({...form, role_id: +e.target.value})} className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl">
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>

              <button type="submit" className="w-full bg-[var(--accent)] text-white py-4 rounded-2xl text-lg font-medium">
                {editing ? 'Сохранить изменения' : 'Создать пользователя'}
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="w-full py-4 text-[var(--text)]">Отмена</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}