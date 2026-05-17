import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-xl w-full max-w-md border border-[var(--border)]">
        <h2 className="text-3xl font-semibold text-center mb-8 text-[var(--text-h)]">
          Вход в систему
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl focus:outline-none focus:border-[var(--accent)]"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-4 border border-[var(--border)] rounded-2xl focus:outline-none focus:border-[var(--accent)]"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent)] hover:bg-violet-600 text-white font-medium py-4 rounded-2xl transition disabled:opacity-70"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p className="text-center mt-6 text-[var(--text)]">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-[var(--accent)] hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}