import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Гость';
  const role = user?.role?.name;

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Текст */}
          <div className="space-y-8">
            <h1 className="text-6xl lg:text-7xl font-bold leading-none tracking-tighter">
              Улыбайтесь<br />с уверенностью
            </h1>

            <p className="text-xl text-slate-400 max-w-lg">
              Современная стоматология в комфортной атмосфере.{' '}
              {user
                ? <>Добро пожаловать, <span className="text-violet-400">{firstName}</span>!</>
                : 'Войдите, чтобы записаться на приём.'}
            </p>

            <div className="flex flex-wrap gap-4">
              {/* Пациент */}
              {role === 'Пациент' && (
                <Link to="/appointments" className="flex items-center gap-3 bg-white text-slate-900 hover:bg-violet-100 px-8 py-5 rounded-2xl text-xl font-semibold transition-all hover:scale-105 shadow-xl">
                  Записаться на приём <ArrowRight className="w-6 h-6" />
                </Link>
              )}

              {/* Врач */}
              {role === 'Врач' && (
                <Link to="/doctor" className="flex items-center gap-3 bg-white text-slate-900 hover:bg-violet-100 px-8 py-5 rounded-2xl text-xl font-semibold transition-all hover:scale-105 shadow-xl">
                  Мои приёмы <ArrowRight className="w-6 h-6" />
                </Link>
              )}

              {/* Админ */}
              {(role === 'Администратор' || role === 'Руководство') && (
                <Link to="/admin" className="flex items-center gap-3 bg-white text-slate-900 hover:bg-violet-100 px-8 py-5 rounded-2xl text-xl font-semibold transition-all hover:scale-105 shadow-xl">
                  Панель управления <ArrowRight className="w-6 h-6" />
                </Link>
              )}

              {/* Не авторизован */}
              {!user && (
                <Link to="/login" className="flex items-center gap-3 bg-violet-600 hover:bg-violet-700 px-8 py-5 rounded-2xl text-xl font-semibold transition-all hover:scale-105 shadow-xl">
                  Войти в систему <ArrowRight className="w-6 h-6" />
                </Link>
              )}
            </div>

            <div className="flex items-center gap-8 text-sm pt-6 border-t border-white/10">
              <div>
                <div className="text-amber-400">★★★★☆</div>
                <p className="text-slate-400">4.98 из 5</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <p className="text-slate-400">Более 4500 счастливых улыбок</p>
            </div>
          </div>

          {/* Визуал */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-amber-400 rounded-[4rem] rotate-12 shadow-2xl flex items-center justify-center text-[220px] opacity-95">
                🦷
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white text-slate-900 rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-3">
                <div className="text-4xl">😁</div>
                <div>
                  <p className="font-semibold">Ваша улыбка —</p>
                  <p className="text-slate-500 text-sm">наша главная забота</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
