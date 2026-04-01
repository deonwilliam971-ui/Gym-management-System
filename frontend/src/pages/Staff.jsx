import React, { useState, useEffect } from 'react';
import api from '../api';
import { UserPlus, Pencil, Trash2, Search, X } from 'lucide-react';
import './PageShared.css';

const BLANK = { first_name: '', last_name: '', email: '', phone_number: '', role: 'Trainer', specialization: '', is_active: true };

export default function Staff() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try { const r = await api.get('staff/'); setItems(r.data); } catch(e) { console.error(e); }
  };

  const openAdd = () => { setForm(BLANK); setEditId(null); setShowModal(true); };
  const openEdit = (item) => { setForm(item); setEditId(item.id); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`staff/${editId}/`, form);
      else await api.post('staff/', form);
      setShowModal(false); fetchAll();
    } catch(e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this staff member?')) return;
    try { await api.delete(`staff/${id}/`); fetchAll(); } catch(e) { console.error(e); }
  };

  const sf = items.filter(i => `${i.first_name} ${i.last_name} ${i.role}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-container">
      <header className="page-header">
        <div><h1 className="page-title">Staff & Trainers</h1><p className="text-muted">Manage your team members and trainers.</p></div>
        <button className="btn btn-primary" onClick={openAdd}><UserPlus size={18}/> Add Staff</button>
      </header>

      <div className="glass-card">
        <div className="search-bar">
          <Search size={18} className="search-icon"/>
          <input placeholder="Search by name or role..." value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Role</th><th>Contact</th><th>Specialization</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {sf.map(i => (
                <tr key={i.id}>
                  <td><div className="name-cell"><div className="mini-avatar">{i.first_name[0]}{i.last_name[0]}</div><span>{i.first_name} {i.last_name}</span></div></td>
                  <td><span className={`badge role-${i.role.toLowerCase()}`}>{i.role}</span></td>
                  <td><div className="contact-info"><span>{i.email}</span><span className="phone">{i.phone_number}</span></div></td>
                  <td>{i.specialization || '—'}</td>
                  <td><span className={`status-dot ${i.is_active ? 'active' : 'inactive'}`}/>{i.is_active ? 'Active' : 'Inactive'}</td>
                  <td><div className="action-btns">
                    <button className="icon-btn edit" onClick={() => openEdit(i)}><Pencil size={16}/></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(i.id)}><Trash2 size={16}/></button>
                  </div></td>
                </tr>
              ))}
              {sf.length === 0 && <tr><td colSpan="6" className="empty-state">No staff found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <div className="modal-header"><h3>{editId ? 'Edit Staff' : 'Add Staff'}</h3><button className="icon-btn" onClick={() => setShowModal(false)}><X size={18}/></button></div>
            <form onSubmit={handleSubmit} className="crud-form">
              <div className="form-row">
                <div className="form-group"><label>First Name</label><input required value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})}/></div>
                <div className="form-group"><label>Last Name</label><input required value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})}/></div>
              </div>
              <div className="form-group"><label>Email</label><input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}/></div>
              <div className="form-row">
                <div className="form-group"><label>Phone</label><input value={form.phone_number} onChange={e => setForm({...form, phone_number: e.target.value})}/></div>
                <div className="form-group"><label>Role</label>
                  <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                    {['Trainer','Receptionist','Manager','Cleaner'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Specialization</label><input value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})}/></div>
              <div className="form-group checkbox-group"><label><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})}/> Active</label></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Add Staff'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
