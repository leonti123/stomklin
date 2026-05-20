import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Неверный email или пароль');
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
        <h2 className="text-4xl font-bold text-center mb-10">Вход в систему</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-400 rounded-2xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-5 bg-slate-800 border border-slate-700 rounded-3xl focus:outline-none focus:border-violet-500 text-lg"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-5 bg-slate-800 border border-slate-700 rounded-3xl focus:outline-none focus:border-violet-500 text-lg"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-violet-600 hover:bg-violet-700 rounded-3xl text-2xl font-semibold transition-all"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-400">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-violet-400 hover:underline">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}