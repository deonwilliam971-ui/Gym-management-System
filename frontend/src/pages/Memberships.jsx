import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import './PageShared.css';

const BLANK = { name: '', description: '', duration_months: 1, price: '', is_active: true };

export default function Memberships() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchAll(); }, []);
  const fetchAll = async () => { try { const r = await api.get('membership-plans/'); setItems(r.data); } catch(e) { console.error(e); } };
  const openAdd = () => { setForm(BLANK); setEditId(null); setShowModal(true); };
  const openEdit = (item) => { setForm(item); setEditId(item.id); setShowModal(true); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`membership-plans/${editId}/`, form);
      else await api.post('membership-plans/', form);
      setShowModal(false); fetchAll();
    } catch(e) { console.error(e); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    try { await api.delete(`membership-plans/${id}/`); fetchAll(); } catch(e) { console.error(e); }
  };
  const sf = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-container">
      <header className="page-header">
        <div><h1 className="page-title">Membership Plans</h1><p className="text-muted">Configure plan tiers, pricing and durations.</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18}/> Add Plan</button>
      </header>
      <div className="glass-card">
        <div className="search-bar"><Search size={18} className="search-icon"/><input placeholder="Search plans..." value={search} onChange={e => setSearch(e.target.value)}/></div>
        <div className="table-responsive">
          <table className="data-table">
            <thead><tr><th>Plan Name</th><th>Duration</th><th>Price</th><th>Description</th><th>Active</th><th>Actions</th></tr></thead>
            <tbody>
              {sf.map(i => (
                <tr key={i.id}>
                  <td><strong>{i.name}</strong></td>
                  <td>{i.duration_months} month{i.duration_months > 1 ? 's' : ''}</td>
                  <td className="amount">₹{parseFloat(i.price).toLocaleString()}</td>
                  <td>{i.description || '—'}</td>
                  <td><span className={`status-dot ${i.is_active ? 'active' : 'inactive'}`}/>{i.is_active ? 'Yes' : 'No'}</td>
                  <td><div className="action-btns">
                    <button className="icon-btn edit" onClick={() => openEdit(i)}><Pencil size={16}/></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(i.id)}><Trash2 size={16}/></button>
                  </div></td>
                </tr>
              ))}
              {sf.length === 0 && <tr><td colSpan="6" className="empty-state">No membership plans found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <div className="modal-header"><h3>{editId ? 'Edit Plan' : 'New Plan'}</h3><button className="icon-btn" onClick={() => setShowModal(false)}><X size={18}/></button></div>
            <form onSubmit={handleSubmit} className="crud-form">
              <div className="form-group"><label>Plan Name</label><input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}/></div>
              <div className="form-row">
                <div className="form-group"><label>Duration (months)</label><input required type="number" min="1" value={form.duration_months} onChange={e => setForm({...form, duration_months: e.target.value})}/></div>
                <div className="form-group"><label>Price (₹)</label><input required type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})}/></div>
              </div>
              <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3}/></div>
              <div className="form-group checkbox-group"><label><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})}/> Active Plan</label></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Create Plan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
