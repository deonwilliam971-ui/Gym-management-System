import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import './PageShared.css';

const BLANK = { member: '', subscription: '', amount: '', method: 'Cash', status: 'Paid', notes: '' };

export default function Payments() {
  const [items, setItems] = useState([]);
  const [members, setMembers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchAll(); fetchRefs(); }, []);
  const fetchAll = async () => { try { const r = await api.get('payments/'); setItems(r.data); } catch(e) { console.error(e); } };
  const fetchRefs = async () => {
    try {
      const [m, s] = await Promise.all([api.get('members/'), api.get('subscriptions/')]);
      setMembers(m.data); setSubscriptions(s.data);
    } catch(e) { console.error(e); }
  };
  const openAdd = () => { setForm(BLANK); setEditId(null); setShowModal(true); };
  const openEdit = (item) => { setForm({...item, subscription: item.subscription||''}); setEditId(item.id); setShowModal(true); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, subscription: form.subscription || null };
    try {
      if (editId) await api.put(`payments/${editId}/`, payload);
      else await api.post('payments/', payload);
      setShowModal(false); fetchAll();
    } catch(e) { console.error(e); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payment?')) return;
    try { await api.delete(`payments/${id}/`); fetchAll(); } catch(e) { console.error(e); }
  };
  const totalRevenue = items.filter(i => i.status === 'Paid').reduce((sum, i) => sum + parseFloat(i.amount||0), 0);
  const sf = items.filter(i => (i.member_name||'').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-container">
      <header className="page-header">
        <div><h1 className="page-title">Payments</h1><p className="text-muted">Track all transactions and revenue.</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18}/> Record Payment</button>
      </header>

      <div className="stats-row">
        <div className="glass-card stat-mini"><span className="stat-label">Total Revenue</span><span className="stat-value green">₹{totalRevenue.toLocaleString()}</span></div>
        <div className="glass-card stat-mini"><span className="stat-label">Transactions</span><span className="stat-value">{items.length}</span></div>
        <div className="glass-card stat-mini"><span className="stat-label">Pending</span><span className="stat-value yellow">{items.filter(i=>i.status==='Pending').length}</span></div>
      </div>

      <div className="glass-card">
        <div className="search-bar"><Search size={18} className="search-icon"/><input placeholder="Search by member..." value={search} onChange={e => setSearch(e.target.value)}/></div>
        <div className="table-responsive">
          <table className="data-table">
            <thead><tr><th>Member</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th><th>Notes</th><th>Actions</th></tr></thead>
            <tbody>
              {sf.map(i => (
                <tr key={i.id}>
                  <td>{i.member_name}</td>
                  <td className="amount">₹{parseFloat(i.amount).toLocaleString()}</td>
                  <td>{i.method}</td>
                  <td>{i.payment_date}</td>
                  <td><span className={`badge status-${(i.status||'').toLowerCase()}`}>{i.status}</span></td>
                  <td>{i.notes || '—'}</td>
                  <td><div className="action-btns">
                    <button className="icon-btn edit" onClick={() => openEdit(i)}><Pencil size={16}/></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(i.id)}><Trash2 size={16}/></button>
                  </div></td>
                </tr>
              ))}
              {sf.length === 0 && <tr><td colSpan="7" className="empty-state">No payments found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <div className="modal-header"><h3>{editId ? 'Edit Payment' : 'Record Payment'}</h3><button className="icon-btn" onClick={() => setShowModal(false)}><X size={18}/></button></div>
            <form onSubmit={handleSubmit} className="crud-form">
              <div className="form-row">
                <div className="form-group"><label>Member</label>
                  <select required value={form.member} onChange={e => setForm({...form, member: e.target.value})}>
                    <option value="">Select member...</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Amount (₹)</label><input required type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}/></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Method</label>
                  <select value={form.method} onChange={e => setForm({...form, method: e.target.value})}>
                    {['Cash','Card','Online','UPI'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    {['Paid','Pending','Refunded'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Subscription (optional)</label>
                <select value={form.subscription} onChange={e => setForm({...form, subscription: e.target.value})}>
                  <option value="">None</option>
                  {subscriptions.map(s => <option key={s.id} value={s.id}>{s.member_name} – {s.plan_name}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Notes</label><input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}/></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Record'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
