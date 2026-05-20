import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Calendar, Stethoscope, FileText, Home, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const role = user?.role?.name;
  const isAdmin = role === 'Администратор' || role === 'Руководство';
  const isDoctor = role === 'Врач';
  const isPatient = role === 'Пациент';

  const navLink = (to, icon, label) => {
    const active = location.pathname === to;
    return (
      <Link to={to} className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${active ? 'bg-violet-600 text-white' : 'hover:text-violet-400'}`}>
        {icon}{label}
      </Link>
    );
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center text-lg">🦷</div>
          <span className="text-xl font-bold">ДентаПлюс</span>
        </Link>

        <div className="flex items-center gap-1 text-sm font-medium">
          {navLink('/', <Home className="w-4 h-4" />, 'Главная')}
          {navLink('/procedures', <Stethoscope className="w-4 h-4" />, 'Услуги')}

          {isPatient && navLink('/appointments', <Calendar className="w-4 h-4" />, 'Запись')}
          {isPatient && navLink('/cabinet', <User className="w-4 h-4" />, 'Кабинет')}

          {isDoctor && navLink('/doctor', <LayoutDashboard className="w-4 h-4" />, 'Мои приёмы')}

          {/* Админ видит И запись И управление */}
          {isAdmin && navLink('/appointments', <Calendar className="w-4 h-4" />, 'Запись')}
          {isAdmin && navLink('/admin', <LayoutDashboard className="w-4 h-4" />, 'Управление')}
          {isAdmin && navLink('/reports', <FileText className="w-4 h-4" />, 'Отчёты')}
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl">
              <User className="w-4 h-4 text-violet-400" />
              <div>
                <p className="text-sm font-medium leading-tight">{user.name}</p>
                <p className="text-xs text-slate-400">{user.role?.name}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-red-900/30 rounded-xl text-red-400 transition-colors" title="Выйти">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <Link to="/login" className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-xl text-sm font-medium transition">Войти</Link>
        )}
      </div>
    </nav>
  );
}
