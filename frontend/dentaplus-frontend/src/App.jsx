import React, { useState, useEffect } from 'react';

// ВАЖНО: Проверь порт своего запущенного ASP.NET бэкенда в Visual Studio
const API_BASE = 'http://localhost:5000/api'; 

export default function App() {
  const [currentTab, setCurrentTab] = useState('users');
  
  // Хранилища данных из API (Шаг 4: JSON)
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Состояния для управления формами (двустороннее связывание)
  const [userForm, setUserForm] = useState({ name: '', email: '', phone_number: '', address: '', role_id: '' });
  const [procForm, setProcForm] = useState({ name: '', price: '' });
  const [appForm, setAppForm] = useState({ patient_id: '', doctor_id: '', appointment_date: '', status: 'Запланировано', total_price: 0 });

  // Метод для загрузки всех данных из твоего API
  const loadAllData = async () => {
    try {
      const [rRes, uRes, pRes, aRes] = await Promise.all([
        fetch(`${API_BASE}/RolsContr`),
        fetch(`${API_BASE}/UsersContr`),
        fetch(`${API_BASE}/ProcedursContr`),
        fetch(`${API_BASE}/AppointmentContr`)
      ]);
      
      if (rRes.ok) setRoles(await rRes.json());
      if (uRes.ok) setUsers(await uRes.json());
      if (pRes.ok) setProcedures(await pRes.json());
      if (aRes.ok) setAppointments(await aRes.json());
    } catch (err) {
      console.error("Критическая ошибка связи с API. Проверь CORS в Program.cs!", err);
    }
  };

  // Вызывается автоматически при открытии страницы в браузере
  useEffect(() => {
    loadAllData();
  }, []);

  // Шаг 1: Отправка POST-запроса на создание Пользователя
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/UsersContr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userForm, role_id: Number(userForm.role_id) })
      });
      if (response.ok) {
        setUserForm({ name: '', email: '', phone_number: '', address: '', role_id: '' });
        loadAllData(); // Обновляем таблицы
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Отправка POST-запроса на создание Услуги
  const handleCreateProcedure = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/ProcedursContr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...procForm, price: Number(procForm.price) })
      });
      if (response.ok) {
        setProcForm({ name: '', price: '' });
        loadAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Отправка POST-запроса на создание Записи на прием
  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      const isoDate = new Date(appForm.appointment_date).toISOString();
      const response = await fetch(`${API_BASE}/AppointmentContr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...appForm, 
          patient_id: Number(appForm.patient_id), 
          doctor_id: Number(appForm.doctor_id),
          appointment_date: isoDate 
        })
      });
      if (response.ok) {
        setAppForm({ patient_id: '', doctor_id: '', appointment_date: '', status: 'Запланировано', total_price: 0 });
        loadAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Отправка DELETE-запроса на удаление
  const handleDeleteUser = async (id) => {
    if (window.confirm("Удалить пользователя из базы данных клиники?")) {
      const response = await fetch(`${API_BASE}/UsersContr/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errData = await response.json();
        alert(errData.message || "Ошибка при удалении");
      }
      loadAllData();
    }
  };

  const handleDeleteProcedure = async (id) => {
    if (window.confirm("Удалить услугу из прайс-листа?")) {
      await fetch(`${API_BASE}/ProcedursContr/${id}`, { method: 'DELETE' });
      loadAllData();
    }
  };

  return (
    <div style={styles.container}>
      
      {/* Слой Frontend: Боковое навигационное меню */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>🦷 DentaPlus CRM</div>
        <nav style={styles.nav}>
          <button onClick={() => setCurrentTab('users')} style={{...styles.navBtn, backgroundColor: currentTab === 'users' ? '#4f46e5' : 'transparent'}}>👥 Пользователи</button>
          <button onClick={() => setCurrentTab('procedures')} style={{...styles.navBtn, backgroundColor: currentTab === 'procedures' ? '#4f46e5' : 'transparent'}}>💰 Прайс услуг</button>
          <button onClick={() => setCurrentTab('appointments')} style={{...styles.navBtn, backgroundColor: currentTab === 'appointments' ? '#4f46e5' : 'transparent'}}>📅 Журнал приемов</button>
        </nav>
        <div style={styles.footer}>React + Vite Client</div>
      </div>

      {/* Основной контент */}
      <div style={styles.mainContent}>
        
        {/* ВКЛАДКА: ПОЛЬЗОВАТЕЛИ */}
        {currentTab === 'users' && (
          <div>
            <h1 style={styles.title}>Управление персоналом и пациентами</h1>
            
            <form onSubmit={handleCreateUser} style={styles.form}>
              <h3>Добавить нового человека</h3>
              <div style={styles.grid}>
                <input type="text" placeholder="ФИО полностью" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} style={styles.input} required />
                <input type="email" placeholder="Email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} style={styles.input} required />
                <input type="text" placeholder="Телефон" value={userForm.phone_number} onChange={e => setUserForm({...userForm, phone_number: e.target.value})} style={styles.input} />
                <input type="text" placeholder="Адрес" value={userForm.address} onChange={e => setUserForm({...userForm, address: e.target.value})} style={styles.input} />
                <select value={userForm.role_id} onChange={e => setUserForm({...userForm, role_id: e.target.value})} style={styles.input} required>
                  <option value="" disabled>Выберите роль из базы данных</option>
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <button type="submit" style={styles.submitBtn}>Отправить POST в бэкенд</button>
            </form>

            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>ФИО</th>
                  <th style={styles.th}>Контакты</th>
                  <th style={styles.th}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={styles.tableRow}>
                    <td style={styles.td}>#{u.id}</td>
                    <td style={{...styles.td, fontWeight: 'bold'}}>{u.name}</td>
                    <td style={styles.td}>{u.email}<br/><span style={{fontSize:'12px', color:'#64748b'}}>{u.phone_number}</span></td>
                    <td style={styles.td}>
                      <button onClick={() => handleDeleteUser(u.id)} style={styles.deleteBtn}>Удалить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ВКЛАДКА: УСЛУГИ */}
        {currentTab === 'procedures' && (
          <div>
            <h1 style={styles.title}>Стоматологический прайс-лист</h1>
            
            <form onSubmit={handleCreateProcedure} style={styles.form}>
              <h3>Новая позиция услуг</h3>
              <div style={{display: 'flex', gap: '15px'}}>
                <input type="text" placeholder="Название процедуры" value={procForm.name} onChange={e => setProcForm({...procForm, name: e.target.value})} style={{...styles.input, flex: 1}} required />
                <input type="number" placeholder="Стоимость (руб)" value={procForm.price} onChange={e => setProcForm({...procForm, price: e.target.value})} style={{...styles.input, width: '200px'}} required />
                <button type="submit" style={{...styles.submitBtn, margin: 0}}>Добавить</button>
              </div>
            </form>

            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Название стоматологической услуги</th>
                  <th style={styles.th}>Цена</th>
                  <th style={styles.th}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {procedures.map(p => (
                  <tr key={p.id} style={styles.tableRow}>
                    <td style={styles.td}>#{p.id}</td>
                    <td style={styles.td}>{p.name}</td>
                    <td style={{...styles.td, color: '#10b981', fontWeight: 'bold'}}>{p.price} ₽</td>
                    <td style={styles.td}>
                      <button onClick={() => handleDeleteProcedure(p.id)} style={styles.deleteBtn}>Удалить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ВКЛАДКА: ЗАПИСИ */}
        {currentTab === 'appointments' && (
          <div>
            <h1 style={styles.title}>Журнал визитов пациентов</h1>
            
            <form onSubmit={handleCreateAppointment} style={styles.form}>
              <h3>Записать на прием</h3>
              <div style={styles.grid}>
                <select value={appForm.patient_id} onChange={e => setAppForm({...appForm, patient_id: e.target.value})} style={styles.input} required>
                  <option value="" disabled>Выберите Пациента</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                <select value={appForm.doctor_id} onChange={e => setAppForm({...appForm, doctor_id: e.target.value})} style={styles.input} required>
                  <option value="" disabled>Выберите Врача</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                <input type="datetime-local" value={appForm.appointment_date} onChange={e => setAppForm({...appForm, appointment_date: e.target.value})} style={styles.input} required />
              </div>
              <button type="submit" style={styles.submitBtn}>Запланировать прием</button>
            </form>

            <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
              {appointments.map(a => (
                <div key={a.id} style={styles.card}>
                  <div style={{display:'flex', justifyContent:'space-between', color:'#94a3b8', fontSize:'12px', marginBottom:'10px'}}>
                    <span>ПРИЕМ №{a.id}</span>
                    <span style={{background:'#fef3c7', color:'#92400e', padding:'2px 6px', borderRadius:'4px', fontWeight:'bold'}}>{a.status || 'Активен'}</span>
                  </div>
                  <p style={{margin:'4px 0'}}><strong>Пациент:</strong> {a.patient?.name || `ID ${a.patient_id}`}</p>
                  <p style={{margin:'4px 0'}}><strong>Врач:</strong> {a.doctor?.name || `ID ${a.doctor_id}`}</p>
                  <p style={{margin:'4px 0', color:'#6366f1'}}><strong>Дата:</strong> {new Date(a.appointment_date).toLocaleString()}</p>
                  <div style={{borderTop:'1px solid #f1f5f9', marginTop:'15px', paddingTop:'10px', textAlign:'right', fontWeight:'black', fontSize:'18px'}}>
                    {a.total_price} ₽
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Стили оформления (внутрикомпонентный CSS, чтобы всё запустилось сразу)
const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif', margin: 0 },
  sidebar: { width: '260px', backgroundColor: '#0f172a', color: 'white', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 10px rgba(0,0,0,0.05)' },
  logo: { fontSize: '22px', fontWeight: '900', color: '#818cf8', letterSpacing: '1px', marginBottom: '35px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  navBtn: { textAlignment: 'left', padding: '12px 16px', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.2s', textAlign: 'left' },
  footer: { fontSize: '11px', color: '#475569', textAlign: 'center', paddingTop: '15px', borderTop: '1px solid #1e293b' },
  mainContent: { flex: 1, padding: '40px', overflowY: 'auto' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: '0 0 25px 0' },
  form: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' },
  submitBtn: { backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '11px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: '0.2s', marginTop: '10px' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' },
  tableHead: { backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' },
  th: { padding: '14px', textAlignment: 'left', fontSize: '12px', fontWeight: '700', color: '#475569', textAlign: 'left', textTransform: 'uppercase' },
  tableRow: { borderBottom: '1px solid #e2e8f0', transition: '0.15s' },
  td: { padding: '14px', fontSize: '14px', color: '#334155' },
  deleteBtn: { color: '#ef4444', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', textTransform: 'uppercase' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', borderLeft: '5px solid #6366f1', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }
};