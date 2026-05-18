import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Procedures from './pages/Procedures';
import Appointments from './pages/Appointments';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAdmin, isDoctor, isPatient } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles.length === 0) return children;

  const userRole = user.role?.name;
  if (allowedRoles.includes(userRole)) return children;

  return <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div id="root">
          <Navbar />
          <main className="flex-1 p-6 bg-[var(--bg)] min-h-[calc(100vh-64px)]">
            <ErrorBoundary>
              <Routes>             
                <Route path="/doctor-schedule" element={<ProtectedRoute allowedRoles={['Врач']}><DoctorSchedule /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute allowedRoles={['Администратор', 'Руководство']}><Reports /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
                
                {/* Только для Администратора и Руководства */}
                <Route path="/users" element={<ProtectedRoute allowedRoles={['Администратор', 'Руководство']}><Users /></ProtectedRoute>} />
                <Route path="/procedures" element={<ProtectedRoute allowedRoles={['Администратор', 'Руководство']}><Procedures /></ProtectedRoute>} />
                
                {/* Для Врача можно добавить позже */}
              </Routes>
            </ErrorBoundary>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;