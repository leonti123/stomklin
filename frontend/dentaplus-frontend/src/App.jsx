import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Procedures from './pages/Procedures';
import Appointments from './pages/Appointments';
import DoctorSchedule from './pages/DoctorSchedule';
import Reports from './pages/Reports';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const isAuthenticated = localStorage.getItem('token') !== null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles.length === 0) return children;
  return children; // можно усилить позже
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
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
                <Route path="/doctor-schedule" element={<ProtectedRoute><DoctorSchedule /></ProtectedRoute>} />
                
                <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
                <Route path="/procedures" element={<ProtectedRoute><Procedures /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              </Routes>
            </ErrorBoundary>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;