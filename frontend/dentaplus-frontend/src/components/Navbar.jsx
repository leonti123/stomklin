import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Calendar, Stethoscope, Users, BarChart3 } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-[var(--border)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-violet-600 rounded-2xl flex items-center justify-center text-3xl text-white">
            🦷
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-h)]">Dental Clinic</h1>
            <p className="text-sm text-gray-500 -mt-1">Стоматология премиум класса</p>
          </div>
        </div>

        <div className="flex items-center gap-9 text-[17px]">
          <Link to="/" className="hover:text-violet-600 transition">Главная</Link>
          <Link to="/appointments" className="flex items-center gap-2 hover:text-violet-600 transition">
            <Calendar className="w-5 h-5" /> Записи
          </Link>
          <Link to="/procedures" className="flex items-center gap-2 hover:text-violet-600 transition">
            <Stethoscope className="w-5 h-5" /> Процедуры
          </Link>

          {user && (user.role?.name === 'Администратор' || user.role?.name === 'Руководство') && (
            <>
              <Link to="/users" className="flex items-center gap-2 hover:text-violet-600 transition">
                <Users className="w-5 h-5" /> Пользователи
              </Link>
              <Link to="/reports" className="flex items-center gap-2 hover:text-violet-600 transition">
                <BarChart3 className="w-5 h-5" /> Отчёты
              </Link>
            </>
          )}
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-violet-50 dark:bg-violet-900/30 px-5 py-3 rounded-2xl">
              <User className="w-6 h-6 text-violet-600" />
              <div className="text-left">
                <p className="font-medium text-[var(--text-h)]">{user.name}</p>
                <p className="text-sm text-gray-500">{user.role?.name}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="p-3 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-2xl text-red-600">
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <Link to="/login" className="px-8 py-3 bg-violet-600 text-white rounded-2xl font-medium hover:bg-violet-700 transition">
            Войти
          </Link>
        )}
      </div>
    </nav>
  );
}