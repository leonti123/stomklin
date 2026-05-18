import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Shield, Clock, Users } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-8 pt-28 pb-20 text-center">
        <h1 className="text-7xl font-bold leading-tight mb-6">
          Идеальная улыбка<br />начинается здесь
        </h1>
        <p className="text-2xl text-slate-300 max-w-3xl mx-auto mb-12">
          Современная стоматологическая клиника с заботливым подходом, 
          опытными врачами и технологиями мирового уровня
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link 
            to="/appointments"
            className="group bg-white text-slate-950 px-10 py-5 rounded-2xl text-xl font-semibold flex items-center gap-3 hover:bg-violet-100 transition-all"
          >
            Записаться на приём
            <ArrowRight className="group-hover:translate-x-1 transition" />
          </Link>

          <a href="tel:+79001234567" 
             className="border border-white/30 hover:bg-white/10 px-10 py-5 rounded-2xl text-xl font-medium flex items-center gap-3 transition">
            ☎️ +7 (900) 123-45-67
          </a>
        </div>
      </div>

      {/* Почему мы */}
      <div className="bg-slate-900/70 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Почему выбирают Dental Clinic</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-violet-500/10 rounded-3xl flex items-center justify-center mb-8">
                <Shield className="w-12 h-12 text-violet-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Гарантия результата</h3>
              <p className="text-slate-400">Только проверенные материалы и современное оборудование</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-8">
                <Clock className="w-12 h-12 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Без боли и страха</h3>
              <p className="text-slate-400">Комфортное лечение с седацией и анестезией последнего поколения</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mb-8">
                <Users className="w-12 h-12 text-amber-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Опытные специалисты</h3>
              <p className="text-slate-400">Врачи с опытом более 10 лет и постоянным обучением</p>
            </div>
          </div>
        </div>
      </div>

      {/* Финальный призыв */}
      <div className="py-24 text-center">
        <h2 className="text-5xl font-bold mb-6">Готовы к новой улыбке?</h2>
        <p className="text-xl text-slate-400 mb-10">Первая консультация бесплатно</p>
        
        <Link 
          to="/appointments"
          className="inline-flex items-center gap-4 bg-violet-600 hover:bg-violet-500 px-12 py-6 rounded-3xl text-2xl font-semibold transition"
        >
          Записаться на консультацию
          <ArrowRight className="w-8 h-8" />
        </Link>
      </div>
    </div>
  );
}