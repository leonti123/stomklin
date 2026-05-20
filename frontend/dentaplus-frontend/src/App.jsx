import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Procedures from './pages/Procedures';
import Reports from './pages/Reports';
import Cabinet from './pages/Cabinet';
import AdminPanel from './pages/AdminPanel';
import DoctorPanel from './pages/DoctorPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role?.name)) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/procedures" element={<Procedures />} />

          {/* Запись — пациент И админ */}
          <Route path="/appointments" element={
            <ProtectedRoute roles={['Пациент', 'Администратор', 'Руководство']}>
              <Appointments />
            </ProtectedRoute>
          } />

          <Route path="/cabinet" element={
            <ProtectedRoute roles={['Пациент']}>
              <Cabinet />
            </ProtectedRoute>
          } />

          <Route path="/doctor" element={
            <ProtectedRoute roles={['Врач']}>
              <DoctorPanel />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute roles={['Администратор', 'Руководство']}>
              <AdminPanel />
            </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute roles={['Администратор', 'Руководство']}>
              <Reports />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
