import { createContext, useContext, useState } from 'react';

const API_BASE = 'http://localhost:7057/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Неверный email или пароль');
    }

    const data = await res.json();
    localStorage.setItem('token', 'true');
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAdmin = () => user?.role?.name === 'Администратор' || user?.role?.name === 'Руководство';
  const isDoctor = () => user?.role?.name === 'Врач';
  const isPatient = () => user?.role?.name === 'Пациент';

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      isAdmin,
      isDoctor,
      isPatient 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);