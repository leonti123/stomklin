import { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = 'http://localhost:7057/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Неверный email или пароль');
    }

    const data = await res.json();
    
    // Сохраняем только пользователя
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);

    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = () => user?.role?.name === 'Администратор' || user?.role?.name === 'Руководство';
  const isDoctor = () => user?.role?.name === 'Врач';
  const isPatient = () => user?.role?.name === 'Пациент';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isDoctor, isPatient }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth должен использоваться внутри AuthProvider');
  return context;
};