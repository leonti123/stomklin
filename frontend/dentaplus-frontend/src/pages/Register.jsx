import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
    date_of_birth: '',     // ← Новое поле
    role_id: 1
  });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_BASE = 'http://localhost:7057/api';   // ← убедись, что порт правильный

  useEffect(() => {
    fetch(`${API_BASE}/RolsContr`)
      .then(res => res.json())
      .then(setRoles)
      .catch(() => console.error("Не удалось загрузить роли"));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/Auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Ошибка регистрации');
      }

      alert('✅ Регистрация прошла успешно!');
      navigate('/login');
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

          <select 
            name="role_id" 
            value={form.role_id} 
            onChange={handleChange} 
            className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl"
            required
          >
            <option value="">Выберите роль</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent)] hover:bg-violet-600 text-white font-medium py-4 rounded-2xl transition disabled:opacity-70"
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="text-center mt-6">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-[var(--accent)] hover:underline">Войти</Link>
        </p>
      </div>
    </div>
  );
}