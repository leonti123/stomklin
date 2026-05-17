import { useAuth } from '../context/AuthContext';
import { Calendar, Users, Stethoscope, Clock } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-[1126px] mx-auto">
      <div className="mb-10">
        <h1 className="text-5xl font-semibold text-[var(--text-h)] mb-3">
          Добро пожаловать, {user?.name?.split(' ')[0] || 'Пользователь'}!
        </h1>
        <p className="text-xl text-[var(--text)]">
          Стоматологическая клиника Наумова
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <span className="text-4xl font-semibold text-[var(--text-h)]">12</span>
          </div>
          <h3 className="text-xl font-medium">Записей сегодня</h3>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 bg-violet-100 dark:bg-violet-900/30 rounded-2xl">
              <Users className="w-8 h-8 text-violet-600" />
            </div>
            <span className="text-4xl font-semibold text-[var(--text-h)]">248</span>
          </div>
          <h3 className="text-xl font-medium">Пациентов всего</h3>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl">
              <Stethoscope className="w-8 h-8 text-emerald-600" />
            </div>
            <span className="text-4xl font-semibold text-[var(--text-h)]">18</span>
          </div>
          <h3 className="text-xl font-medium">Активных процедур</h3>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-2xl">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <span className="text-4xl font-semibold text-[var(--text-h)]">4</span>
          </div>
          <h3 className="text-xl font-medium">В очереди</h3>
        </div>
      </div>

      <div className="text-center text-[var(--text)] mt-16">
        <p>Система управления стоматологической клиникой Наумова © 2026</p>
      </div>
    </div>
  );
}