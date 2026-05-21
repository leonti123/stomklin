import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

const API_BASE = 'http://localhost:7057/api';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
    date_of_birth: '',
    role_id: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/RolsContr`)
      .then(r => r.json())
      .then(data => {
        const patientRole = data.find(r => r.name === 'Пациент');
        if (patientRole) {
          setForm(f => ({ ...f, role_id: patientRole.id }));
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    if (password.length < 8) return 'Пароль должен содержать минимум 8 символов';
    if (!/[A-Z]/.test(password)) return 'Пароль должен содержать хотя бы одну заглавную букву';
    if (!/[0-9]/.test(password)) return 'Пароль должен содержать хотя бы одну цифру';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/Auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role_id: parseInt(form.role_id) })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Ошибка регистрации');
      }

      alert('✅ Регистрация прошла успешно! Теперь войдите в систему.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#0f172a]">
      <div className="bg-slate-900 p-12 rounded-3xl shadow-2xl w-full max-w-md border border-slate-700">
        <div className="flex justify-center mb-8">
          <Stethoscope className="w-16 h-16 text-violet-400" />
        </div>
        <h2 className="text-4xl font-bold text-center mb-10">Регистрация</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-400 rounded-2xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" name="name" placeholder="ФИО" onChange={handleChange} required
            className="w-full px-6 py-5 bg-slate-800 border border-slate-700 rounded-3xl focus:outline-none focus:border-violet-500 text-lg" />

          <input type="email" name="email" placeholder="Email" onChange={handleChange} required
            className="w-full px-6 py-5 bg-slate-800 border border-slate-700 rounded-3xl focus:outline-none focus:border-violet-500 text-lg" />

          <div className="space-y-2">
            <input type="password" name="password" placeholder="Пароль" onChange={handleChange} required
              className="w-full px-6 py-5 bg-slate-800 border border-slate-700 rounded-3xl focus:outline-none focus:border-violet-500 text-lg" />
            <p className="text-slate-500 text-sm px-2">Минимум 8 символов, заглавная буква и цифра</p>
          </div>

          <input type="tel" name="phone_number" placeholder="Телефон" onChange={handleChange}
            className="w-full px-6 py-5 bg-slate-800 border border-slate-700 rounded-3xl focus:outline-none focus:border-violet-500 text-lg" />

          <input type="text" name="address" placeholder="Адрес" onChange={handleChange}
            className="w-full px-6 py-5 bg-slate-800 border border-slate-700 rounded-3xl focus:outline-none focus:border-violet-500 text-lg" />

          <input type="date" name="date_of_birth" onChange={handleChange}
            className="w-full px-6 py-5 bg-slate-800 border border-slate-700 rounded-3xl focus:outline-none focus:border-violet-500 text-lg" />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-violet-600 hover:bg-violet-700 rounded-3xl text-2xl font-semibold transition-all"
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-400">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-violet-400 hover:underline">Войти</Link>
        </p>
      </div>
    </div>
  );
}