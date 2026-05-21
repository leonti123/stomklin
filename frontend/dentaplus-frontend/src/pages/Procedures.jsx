import { useState, useEffect } from 'react';
import { Stethoscope, X } from 'lucide-react';

const API_BASE = 'http://localhost:7057/api';

const serviceDescriptions = {
  'Чистка зубов': 'Профессиональная гигиена полости рта, снятие зубного камня и налёта ультразвуковым методом.',
  'Пломбирование': 'Комплексное лечение кариеса с использованием современных световых пломбировочных материалов.',
  'Удаление зуба': 'Удаление зуба под местной анестезией с минимальным травматизмом и быстрым восстановлением.',
  'Отбеливание': 'Профессиональное отбеливание зубов системой Beyond или Zoom. Результат — до 8 тонов светлее.',
  'Рентген': 'Панорамный снимок челюсти (ОПТГ) для полной диагностики состояния зубов и костной ткани.',
};

export default function Procedures() {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/ProcedursContr`)
      .then(res => res.json())
      .then(data => {
        setProcedures(data);
        setLoading(false);
      })
      .catch(() => {
        alert('Ошибка загрузки услуг');
        setLoading(false);
      });
  }, []);

  const openModal = (proc) => {
    setSelectedService(proc);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  if (loading) {
    return <div className="text-center py-20 text-2xl">Загрузка услуг...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 flex items-center gap-3">
        <Stethoscope className="w-9 h-9 text-violet-400" />
        Услуги клиники
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {procedures.map(proc => (
          <div
            key={proc.id}
            onClick={() => openModal(proc)}
            className="bg-slate-900/70 border border-slate-700 rounded-3xl p-8 hover:border-violet-400 transition-all cursor-pointer group"
          >
            <h3 className="text-xl font-semibold mb-3 group-hover:text-violet-400 transition">{proc.name}</h3>
            <p className="text-4xl font-bold text-violet-400 mb-6">
              {proc.price} ₽
            </p>
            <p className="text-sm text-slate-400">Нажмите, чтобы узнать подробнее</p>
          </div>
        ))}
      </div>

      {/* Модальное окно */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={closeModal}>
          <div
            className="bg-slate-900 rounded-3xl max-w-lg w-full mx-4 p-8 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-semibold mb-2">{selectedService.name}</h2>
            <p className="text-4xl font-bold text-violet-400 mb-8">
              {selectedService.price} ₽
            </p>

            <p className="text-slate-300 leading-relaxed text-lg">
              {serviceDescriptions[selectedService.name] || 'Подробное описание услуги будет добавлено позже.'}
            </p>

            <button
              onClick={closeModal}
              className="mt-10 w-full py-4 bg-violet-600 hover:bg-violet-700 rounded-2xl text-lg font-medium"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}