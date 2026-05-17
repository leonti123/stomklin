import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Ошибка в компоненте:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="bg-red-50 border border-red-300 rounded-3xl p-10 max-w-lg text-center">
            <h2 className="text-2xl font-semibold text-red-700 mb-4">Что-то пошло не так</h2>
            <p className="text-red-600 mb-6">
              {this.state.error?.message || 'Неизвестная ошибка'}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 text-white px-8 py-3 rounded-2xl hover:bg-red-700 transition"
            >
              Перезагрузить страницу
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
export default ErrorBoundary;