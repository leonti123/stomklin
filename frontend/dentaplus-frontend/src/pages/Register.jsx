import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
    date_of_birth: '',
    role_id: 1
  });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_BASE = 'http://localhost:7057/api';

  useEffect(() => {
    setRoles([
      { id: 1, name: "Пациент" },
      { id: 2, name: "Врач" },
      { id: 3, name: "Администратор" },
      { id: 4, name: "Руководство" }
    ]);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Временный вариант — создаём пользователя напрямую
      const res = await fetch(`${API_BASE}/UsersContr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone_number: form.phone_number,
          address: form.address,
          role_id: parseInt(form.role_id),
          password_hash: "123456"   // временно, потом будет хэш
        })
      });

      if (res.ok) {
        alert('✅ Регистрация прошла успешно! Теперь можете войти.');
        navigate('/login');
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Ошибка регистрации');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-[var(--border)]">
        <h2 className="text-3xl font-semibold text-center mb-8">Регистрация в Dental Clinic</h2>

        {error && <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" name="name" placeholder="ФИО" value={form.name} onChange={handleChange} required className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl" />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl" />
          <input type="password" name="password" placeholder="Пароль" value={form.password} onChange={handleChange} required className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl" />
          <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl" />
          <input type="text" name="phone_number" placeholder="Телефон" value={form.phone_number} onChange={handleChange} className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl" />
          <input type="text" name="address" placeholder="Адрес" value={form.address} onChange={handleChange} className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl" />

          <select name="role_id" value={form.role_id} onChange={handleChange} className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl" required>
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          <button type="submit" disabled={loading} className="w-full bg-[var(--accent)] hover:bg-violet-600 text-white font-medium py-4 rounded-2xl transition disabled:opacity-70">
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="text-center mt-6">
          Уже есть аккаунт? <Link to="/login" className="text-[var(--accent)] hover:underline">Войти</Link>
        </p>
      </div>
    </div>
  );
}