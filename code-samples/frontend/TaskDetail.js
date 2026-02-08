// ========================================
// TASK DETAIL PAGE - Detalii task + propuneri
// ========================================

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
  getTaskById,
  createProposal,
  getProposalsByTask,
  acceptProposal,
  rejectProposal,
  completeTask,
} from '../api';

const TaskDetail = () => {
  const { id } = useParams(); // ID task din URL
  const { user } = useContext(AuthContext);
  const [task, setTask] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form pentru propunere nouă
  const [proposalData, setProposalData] = useState({
    message: '',
    price: '',
    estimatedDays: '',
  });

  // Încărcăm task-ul
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await getTaskById(id);
        setTask(response.data.data.task);

        // Dacă ești proprietar task, ia propunerile
        if (response.data.data.task.clientId === user?.id) {
          const propResponse = await getProposalsByTask(id);
          setProposals(propResponse.data.data.proposals);
        }
      } catch (err) {
        console.error('Eroare:', err);
        setError('Task-ul nu a fost găsit');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, user]);

  // Trimite propunere
  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProposal({
        taskId: id,
        ...proposalData,
      });
      setProposalData({ message: '', price: '', estimatedDays: '' });
      alert('Propunere trimisă cu succes! ✅');
    } catch (err) {
      setError(err.response?.data?.message || 'Eroare');
    }
  };

  // Accepta propunere
  const handleAccept = async (proposalId) => {
    try {
      await acceptProposal(proposalId);
      alert('Propunere acceptată! ✅');
      // Re-fetch task
      const response = await getTaskById(id);
      setTask(response.data.data.task);
      const propResponse = await getProposalsByTask(id);
      setProposals(propResponse.data.data.proposals);
    } catch (err) {
      setError(err.response?.data?.message || 'Eroare');
    }
  };

  // Respinge propunere
  const handleReject = async (proposalId) => {
    try {
      await rejectProposal(proposalId);
      alert('Propunere respinsă');
      const propResponse = await getProposalsByTask(id);
      setProposals(propResponse.data.data.proposals);
    } catch (err) {
      setError(err.response?.data?.message || 'Eroare');
    }
  };

  // Finalizăm task
  const handleComplete = async () => {
    try {
      await completeTask(id);
      alert('Task finalizat! Acum poți scrie review. ✅');
      const response = await getTaskById(id);
      setTask(response.data.data.task);
    } catch (err) {
      setError(err.response?.data?.message || 'Eroare');
    }
  };

  // Loading
  if (loading) return <p style={styles.loading}>Se încărcă...</p>;

  // Error
  if (error) return <p style={styles.loading}>❌ {error}</p>;

  // Ești proprietar task?
  const isOwner = task?.clientId === user?.id;

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <Link to="/" style={styles.logo}>
          FacTot
        </Link>
        <Link to="/tasks" style={styles.backBtn}>
          ← Înapoi
        </Link>
      </nav>

      {/* CONTENT */}
      <div style={styles.content}>
        {/* TASK DETAILS */}
        <div style={styles.card}>
          <div style={styles.taskHeader}>
            <h1 style={styles.taskTitle}>{task.title}</h1>
            <span
              style={styles[`status_${task.status}`] || styles.statusDefault}
            >
              {task.status}
            </span>
          </div>

          <p style={styles.taskDesc}>{task.description}</p>

          <div style={styles.taskInfo}>
            <span>
              📍 {task.city}, {task.country}
            </span>
            <span>
              💰 {task.budgetMin} - {task.budgetMax} {task.currency}
            </span>
            {task.isRemote && <span>🌐 Remote</span>}
          </div>

          {/* Buton Finalizare (proprietar + assigned) */}
          {isOwner && task.status === 'assigned' && (
            <button style={styles.completeBtn} onClick={handleComplete}>
              ✅ Finalizăm Task
            </button>
          )}
        </div>

        {/* PROPUNERI SECTION */}
        {/* Proprietar vede propunerile */}
        {isOwner && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              📝 Propuneri ({proposals.length})
            </h2>
            {proposals.length === 0 ? (
              <p style={styles.noData}>Nu sunt propuneri încă.</p>
            ) : (
              proposals.map((proposal) => (
                <div key={proposal.id} style={styles.proposalCard}>
                  <div style={styles.proposalHeader}>
                    <span style={styles.proposalName}>
                      {proposal.freelancer?.firstName}{' '}
                      {proposal.freelancer?.lastName}
                    </span>
                    <span
                      style={
                        styles[`status_${proposal.status}`] ||
                        styles.statusDefault
                      }
                    >
                      {proposal.status}
                    </span>
                  </div>
                  <p style={styles.proposalMessage}>{proposal.message}</p>
                  <div style={styles.proposalInfo}>
                    <span>
                      💰 {proposal.price} {task.currency}
                    </span>
                    {proposal.estimatedDays && (
                      <span>📅 {proposal.estimatedDays} zile</span>
                    )}
                  </div>
                  {/* Butoane Accept/Reject (dacă pending) */}
                  {proposal.status === 'pending' && (
                    <div style={styles.proposalActions}>
                      <button
                        style={styles.acceptBtn}
                        onClick={() => handleAccept(proposal.id)}
                      >
                        ✅ Accepta
                      </button>
                      <button
                        style={styles.rejectBtn}
                        onClick={() => handleReject(proposal.id)}
                      >
                        ❌ Refuza
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Non-proprietar vede form propunere (dacă task open) */}
        {!isOwner && task.status === 'open' && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>📝 Trimite Propunere</h2>
            <form onSubmit={handleProposalSubmit}>
              <div style={styles.group}>
                <label style={styles.label}>Mesaj</label>
                <textarea
                  value={proposalData.message}
                  onChange={(e) =>
                    setProposalData({
                      ...proposalData,
                      message: e.target.value,
                    })
                  }
                  placeholder="Descrie de ce ești potrivit..."
                  style={styles.textarea}
                  required
                />
              </div>
              <div style={styles.row}>
                <div style={styles.group}>
                  <label style={styles.label}>Preț</label>
                  <input
                    type="number"
                    value={proposalData.price}
                    onChange={(e) =>
                      setProposalData({
                        ...proposalData,
                        price: e.target.value,
                      })
                    }
                    placeholder="350"
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.group}>
                  <label style={styles.label}>Zile estimat</label>
                  <input
                    type="number"
                    value={proposalData.estimatedDays}
                    onChange={(e) =>
                      setProposalData({
                        ...proposalData,
                        estimatedDays: e.target.value,
                      })
                    }
                    placeholder="2"
                    style={styles.input}
                  />
                </div>
              </div>
              <button type="submit" style={styles.submitBtn}>
                📤 Trimite Propunere
              </button>
            </form>
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
    backgroundColor: '#f0f2f5',
  },
  navbar: {
    backgroundColor: '#2563eb',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '24px',
    fontWeight: '700',
  },
  backBtn: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '15px',
  },
  content: {
    maxWidth: '750px',
    margin: '30px auto',
    padding: '0 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  taskTitle: {
    margin: 0,
    color: '#1f2937',
    fontSize: '22px',
  },
  taskDesc: {
    color: '#4b5563',
    fontSize: '15px',
    lineHeight: '1.6',
  },
  taskInfo: {
    display: 'flex',
    gap: '20px',
    color: '#6b7280',
    fontSize: '14px',
    marginTop: '12px',
  },
  status_open: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  status_assigned: {
    backgroundColor: '#dbeafe',
    color: '#2563eb',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  status_completed: {
    backgroundColor: '#e0e7ff',
    color: '#4f46e5',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  status_pending: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  status_accepted: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  status_rejected: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  statusDefault: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
  },
  completeBtn: {
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  sectionTitle: {
    color: '#1f2937',
    marginBottom: '15px',
    fontSize: '18px',
  },
  noData: {
    color: '#6b7280',
    textAlign: 'center',
    padding: '20px',
  },
  proposalCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '18px',
    marginBottom: '12px',
  },
  proposalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  proposalName: {
    fontWeight: '600',
    color: '#1f2937',
  },
  proposalMessage: {
    color: '#4b5563',
    fontSize: '14px',
    margin: '8px 0',
  },
  proposalInfo: {
    display: 'flex',
    gap: '15px',
    color: '#6b7280',
    fontSize: '13px',
  },
  proposalActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '12px',
  },
  acceptBtn: {
    padding: '8px 18px',
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  rejectBtn: {
    padding: '8px 18px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  row: {
    display: 'flex',
    gap: '15px',
  },
  group: {
    marginBottom: '15px',
    flex: 1,
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#374151',
    fontWeight: '600',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    minHeight: '100px',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    color: '#6b7280',
    fontSize: '18px',
  },
};

export default TaskDetail;
