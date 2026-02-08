// ========================================
// DASHBOARD PAGE - Pagina principale după login
// ========================================

import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { getTasks } from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Încarcam task-urile
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks({ status: 'open' });
        setTasks(response.data.data.tasks);
      } catch (err) {
        console.error('Eroare:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>FacTot</h1>
        <div style={styles.navRight}>
          <span style={styles.userName}>
            Hei, {user?.firstName}! 👋
          </span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={styles.content}>
        {/* STATS CARDS */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statNumber}>{tasks.length}</p>
            <p style={styles.statLabel}>Task-uri disponibile</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statNumber}>{user?.rating || 0}</p>
            <p style={styles.statLabel}>Rating tău ⭐</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statNumber}>{user?.userType}</p>
            <p style={styles.statLabel}>Tip utilizator</p>
          </div>
        </div>

        {/* BUTOANE QUICK ACTION */}
        <div style={styles.actionsRow}>
        {/* Creăte Task - doar pentru client sau both */}
        {(user?.userType === 'client' || user?.userType === 'both') && (
          <Link to="/tasks/create" style={styles.actionBtn}>
      ➕ Creăte Task
      </Link>
      )}
  
  {/* Vede Task-uri - toți */}
  <Link to="/tasks" style={styles.actionBtnSecondary}>
    📋 Vede Task-uri
  </Link>
  
  {/* Propunerile Mele - doar pentru freelancer sau both */}
  {(user?.userType === 'freelancer' || user?.userType === 'both') && (
    <Link to="/proposals/my" style={styles.actionBtnSecondary}>
      📝 Propunerile Mele
    </Link>
  )}
</div>

        {/* TASK-URI RECENTE */}
        <h2 style={styles.sectionTitle}>📌 Task-uri Disponibile</h2>

        {loading ? (
          <p style={styles.loading}>Se încărcă...</p>
        ) : tasks.length === 0 ? (
          <p style={styles.noData}>Nu sunt task-uri disponibile momentan.</p>
        ) : (
          <div style={styles.tasksList}>
            {tasks.slice(0, 5).map((task) => (
              <Link
                key={task.id}
                to={`/tasks/${task.id}`}
                style={styles.taskCard}
              >
                <div style={styles.taskHeader}>
                  <h3 style={styles.taskTitle}>{task.title}</h3>
                  <span style={styles.taskBudget}>
                    {task.budgetMin} - {task.budgetMax} {task.currency}
                  </span>
                </div>
                <p style={styles.taskDesc}>{task.description}</p>
                <div style={styles.taskFooter}>
                  <span style={styles.taskCity}>📍 {task.city}, {task.country}</span>
                  <span style={styles.taskStatus}>🟢 {task.status}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ========================================
// STYLES
// ========================================
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5'
  },
  navbar: {
    backgroundColor: '#2563eb',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    color: 'white',
    margin: 0,
    fontSize: '24px'
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  userName: {
    color: 'white',
    fontSize: '15px'
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  content: {
    maxWidth: '900px',
    margin: '30px auto',
    padding: '0 20px'
  },
  statsRow: {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px'
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    flex: 1,
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2563eb',
    margin: '0 0 5px 0'
  },
  statLabel: {
    color: '#6b7280',
    fontSize: '13px',
    margin: 0
  },
  actionsRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '30px'
  },
  actionBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#2563eb',
    color: 'white',
    borderRadius: '10px',
    textDecoration: 'none',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '15px'
  },
  actionBtnSecondary: {
    flex: 1,
    padding: '12px',
    backgroundColor: 'white',
    color: '#2563eb',
    borderRadius: '10px',
    textDecoration: 'none',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '15px',
    border: '2px solid #2563eb'
  },
  sectionTitle: {
    color: '#1f2937',
    marginBottom: '15px',
    fontSize: '20px'
  },
  loading: {
    textAlign: 'center',
    color: '#6b7280',
    padding: '40px'
  },
  noData: {
    textAlign: 'center',
    color: '#6b7280',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '12px'
  },
  tasksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    textDecoration: 'none',
    color: 'inherit',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s'
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  taskTitle: {
    margin: 0,
    color: '#1f2937',
    fontSize: '17px'
  },
  taskBudget: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: '14px'
  },
  taskDesc: {
    color: '#6b7280',
    fontSize: '14px',
    margin: '0 0 10px 0'
  },
  taskFooter: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  taskCity: {
    color: '#9ca3af',
    fontSize: '13px'
  },
  taskStatus: {
    color: '#16a34a',
    fontSize: '13px',
    fontWeight: '600'
  }
};

export default Dashboard;