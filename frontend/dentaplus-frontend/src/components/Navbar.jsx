import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Calendar, Stethoscope, Users } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-[var(--border)] sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1126px] mx-auto px-6 py-5 flex items-center justify-between">
        
        {/* Логотип + Новое название */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
            🦷
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-h)] tracking-tight">Dental Clinic</h1>
            <p className="text-sm text-[var(--text)] -mt-1">Стоматология премиум класса</p>
          </div>
        </div>

        {/* Меню */}
        <div className="flex items-center gap-8 text-lg font-medium">
          <Link to="/" className="hover:text-[var(--accent)] transition-colors">Главная</Link>
          <Link to="/appointments" className="flex items-center gap-2 hover:text-[var(--accent)] transition-colors">
            <Calendar className="w-5 h-5" /> Записи
          </Link>
          <Link to="/procedures" className="flex items-center gap-2 hover:text-[var(--accent)] transition-colors">
            <Stethoscope className="w-5 h-5" /> Процедуры
          </Link>
          <Link to="/users" className="flex items-center gap-2 hover:text-[var(--accent)] transition-colors">
            <Users className="w-5 h-5" /> Пользователи
          </Link>
        </div>

        {/* Пользователь / Войти */}
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-[var(--accent-bg)] px-5 py-2.5 rounded-2xl border border-[var(--accent-border)]">
              <User className="w-6 h-6 text-[var(--accent)]" />
              <div>
                <p className="font-medium text-[var(--text-h)]">{user.name}</p>
                <p className="text-xs text-[var(--text)]">{user.role?.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-3 hover:bg-red-100 rounded-2xl text-red-600 hover:text-red-700 transition"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <Link 
            to="/login" 
            className="px-8 py-3 bg-[var(--accent)] text-white font-medium rounded-2xl hover:bg-violet-700 transition"
          >
            Войти
          </Link>
        )}
      </div>
    </nav>
  );
}