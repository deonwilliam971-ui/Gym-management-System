import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import './PageShared.css';

const BLANK = { member: '', plan: '', start_date: '', end_date: '', status: 'Active', amount_paid: '' };

export default function Subscriptions() {
  const [items, setItems] = useState([]);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchAll(); fetchRefs(); }, []);
  const fetchAll = async () => { try { const r = await api.get('subscriptions/'); setItems(r.data); } catch(e) { console.error(e); } };
  const fetchRefs = async () => {
    try {
      const [m, p] = await Promise.all([api.get('members/'), api.get('membership-plans/')]);
      setMembers(m.data); setPlans(p.data);
    } catch(e) { console.error(e); }
  };
  const openAdd = () => { setForm(BLANK); setEditId(null); setShowModal(true); };
  const openEdit = (item) => { setForm({...item, member: item.member, plan: item.plan}); setEditId(item.id); setShowModal(true); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`subscriptions/${editId}/`, form);
      else await api.post('subscriptions/', form);
      setShowModal(false); fetchAll();
    } catch(e) { console.error(e); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subscription?')) return;
    try { await api.delete(`subscriptions/${id}/`); fetchAll(); } catch(e) { console.error(e); }
  };
  const sf = items.filter(i => (i.member_name||'').toLowerCase().includes(search.toLowerCase()) || (i.plan_name||'').toLowerCase().includes(search.toLowerCase()));

  const statusColor = { Active: 'active', Expired: 'inactive', Cancelled: 'inactive' };

  return (
    <div className="page-container">
      <header className="page-header">
        <div><h1 className="page-title">Subscriptions</h1><p className="text-muted">Track member plan subscriptions and renewals.</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18}/> New Subscription</button>
      </header>
      <div className="glass-card">
        <div className="search-bar"><Search size={18} className="search-icon"/><input placeholder="Search by member or plan..." value={search} onChange={e => setSearch(e.target.value)}/></div>
        <div className="table-responsive">
          <table className="data-table">
            <thead><tr><th>Member</th><th>Plan</th><th>Start</th><th>End</th><th>Amount Paid</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {sf.map(i => (
                <tr key={i.id}>
                  <td>{i.member_name}</td>
                  <td>{i.plan_name}</td>
                  <td>{i.start_date}</td>
                  <td>{i.end_date}</td>
                  <td className="amount">₹{parseFloat(i.amount_paid||0).toLocaleString()}</td>
                  <td><span className={`badge status-${(i.status||'').toLowerCase()}`}>{i.status}</span></td>
                  <td><div className="action-btns">
                    <button className="icon-btn edit" onClick={() => openEdit(i)}><Pencil size={16}/></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(i.id)}><Trash2 size={16}/></button>
                  </div></td>
                </tr>
              ))}
              {sf.length === 0 && <tr><td colSpan="7" className="empty-state">No subscriptions found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <div className="modal-header"><h3>{editId ? 'Edit Subscription' : 'New Subscription'}</h3><button className="icon-btn" onClick={() => setShowModal(false)}><X size={18}/></button></div>
            <form onSubmit={handleSubmit} className="crud-form">
              <div className="form-row">
                <div className="form-group"><label>Member</label>
                  <select required value={form.member} onChange={e => setForm({...form, member: e.target.value})}>
                    <option value="">Select member...</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Plan</label>
                  <select required value={form.plan} onChange={e => setForm({...form, plan: e.target.value})}>
                    <option value="">Select plan...</option>
                    {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Start Date</label><input required type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})}/></div>
                <div className="form-group"><label>End Date</label><input required type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})}/></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Amount Paid (₹)</label><input required type="number" min="0" step="0.01" value={form.amount_paid} onChange={e => setForm({...form, amount_paid: e.target.value})}/></div>
                <div className="form-group"><label>Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    {['Active','Expired','Cancelled'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
