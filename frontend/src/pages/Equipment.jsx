import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import './PageShared.css';

const BLANK = { name: '', category: '', quantity: 1, condition: 'Good', status: 'Available', purchase_date: '', last_maintenance: '', notes: '' };

export default function Equipment() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchAll(); }, []);
  const fetchAll = async () => { try { const r = await api.get('equipment/'); setItems(r.data); } catch(e) { console.error(e); } };
  const openAdd = () => { setForm(BLANK); setEditId(null); setShowModal(true); };
  const openEdit = (item) => { setForm({...item}); setEditId(item.id); setShowModal(true); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, purchase_date: form.purchase_date || null, last_maintenance: form.last_maintenance || null };
    try {
      if (editId) await api.put(`equipment/${editId}/`, payload);
      else await api.post('equipment/', payload);
      setShowModal(false); fetchAll();
    } catch(e) { console.error(e); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this equipment?')) return;
    try { await api.delete(`equipment/${id}/`); fetchAll(); } catch(e) { console.error(e); }
  };
  const condColor = { Excellent: 'active', Good: 'active', Fair: 'warn', Poor: 'inactive' };
  const sf = items.filter(i => (i.name||'').toLowerCase().includes(search.toLowerCase()) || (i.category||'').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-container">
      <header className="page-header">
        <div><h1 className="page-title">Equipment</h1><p className="text-muted">Manage gym equipment inventory and maintenance.</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18}/> Add Equipment</button>
      </header>
      <div className="glass-card">
        <div className="search-bar"><Search size={18} className="search-icon"/><input placeholder="Search by name or category..." value={search} onChange={e => setSearch(e.target.value)}/></div>
        <div className="table-responsive">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Category</th><th>Qty</th><th>Condition</th><th>Status</th><th>Last Maintenance</th><th>Actions</th></tr></thead>
            <tbody>
              {sf.map(i => (
                <tr key={i.id}>
                  <td><strong>{i.name}</strong></td>
                  <td>{i.category || '—'}</td>
                  <td>{i.quantity}</td>
                  <td><span className={`status-dot ${condColor[i.condition] || 'warn'}`}/>{i.condition}</td>
                  <td><span className={`badge status-${(i.status||'').toLowerCase().replace(' ','-')}`}>{i.status}</span></td>
                  <td>{i.last_maintenance || '—'}</td>
                  <td><div className="action-btns">
                    <button className="icon-btn edit" onClick={() => openEdit(i)}><Pencil size={16}/></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(i.id)}><Trash2 size={16}/></button>
                  </div></td>
                </tr>
              ))}
              {sf.length === 0 && <tr><td colSpan="7" className="empty-state">No equipment found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <div className="modal-header"><h3>{editId ? 'Edit Equipment' : 'Add Equipment'}</h3><button className="icon-btn" onClick={() => setShowModal(false)}><X size={18}/></button></div>
            <form onSubmit={handleSubmit} className="crud-form">
              <div className="form-row">
                <div className="form-group"><label>Name</label><input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}/></div>
                <div className="form-group"><label>Category</label><input value={form.category} onChange={e => setForm({...form, category: e.target.value})}/></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Quantity</label><input type="number" min="1" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})}/></div>
                <div className="form-group"><label>Condition</label>
                  <select value={form.condition} onChange={e => setForm({...form, condition: e.target.value})}>
                    {['Excellent','Good','Fair','Poor'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  {['Available','In Use','Under Maintenance','Retired'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Purchase Date</label><input type="date" value={form.purchase_date||''} onChange={e => setForm({...form, purchase_date: e.target.value})}/></div>
                <div className="form-group"><label>Last Maintenance</label><input type="date" value={form.last_maintenance||''} onChange={e => setForm({...form, last_maintenance: e.target.value})}/></div>
              </div>
              <div className="form-group"><label>Notes</label><textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2}/></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
