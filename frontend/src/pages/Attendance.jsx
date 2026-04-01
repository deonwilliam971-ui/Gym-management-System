import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import './PageShared.css';

const BLANK = { member: '', check_in: '', check_out: '', notes: '' };

export default function Attendance() {
  const [items, setItems] = useState([]);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchAll(); fetchMembers(); }, []);
  const fetchAll = async () => { try { const r = await api.get('attendance/'); setItems(r.data); } catch(e) { console.error(e); } };
  const fetchMembers = async () => { try { const r = await api.get('members/'); setMembers(r.data); } catch(e) { console.error(e); } };
  const openAdd = () => { setForm(BLANK); setEditId(null); setShowModal(true); };
  const openEdit = (item) => { setForm({...item}); setEditId(item.id); setShowModal(true); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, check_out: form.check_out || null };
    try {
      if (editId) await api.put(`attendance/${editId}/`, payload);
      else await api.post('attendance/', payload);
      setShowModal(false); fetchAll();
    } catch(e) { console.error(e); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this attendance record?')) return;
    try { await api.delete(`attendance/${id}/`); fetchAll(); } catch(e) { console.error(e); }
  };
  const formatDT = (dt) => dt ? new Date(dt).toLocaleString() : '—';
  const sf = items.filter(i => (i.member_name||'').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-container">
      <header className="page-header">
        <div><h1 className="page-title">Attendance</h1><p className="text-muted">Track member check-ins and check-outs.</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18}/> Log Attendance</button>
      </header>
      <div className="glass-card">
        <div className="search-bar"><Search size={18} className="search-icon"/><input placeholder="Search by member..." value={search} onChange={e => setSearch(e.target.value)}/></div>
        <div className="table-responsive">
          <table className="data-table">
            <thead><tr><th>Member</th><th>Check In</th><th>Check Out</th><th>Notes</th><th>Actions</th></tr></thead>
            <tbody>
              {sf.map(i => (
                <tr key={i.id}>
                  <td>{i.member_name}</td>
                  <td>{formatDT(i.check_in)}</td>
                  <td>{formatDT(i.check_out)}</td>
                  <td>{i.notes || '—'}</td>
                  <td><div className="action-btns">
                    <button className="icon-btn edit" onClick={() => openEdit(i)}><Pencil size={16}/></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(i.id)}><Trash2 size={16}/></button>
                  </div></td>
                </tr>
              ))}
              {sf.length === 0 && <tr><td colSpan="5" className="empty-state">No attendance records found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <div className="modal-header"><h3>{editId ? 'Edit Record' : 'Log Attendance'}</h3><button className="icon-btn" onClick={() => setShowModal(false)}><X size={18}/></button></div>
            <form onSubmit={handleSubmit} className="crud-form">
              <div className="form-group"><label>Member</label>
                <select required value={form.member} onChange={e => setForm({...form, member: e.target.value})}>
                  <option value="">Select member...</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Check In</label><input required type="datetime-local" value={form.check_in ? form.check_in.slice(0,16) : ''} onChange={e => setForm({...form, check_in: e.target.value})}/></div>
                <div className="form-group"><label>Check Out</label><input type="datetime-local" value={form.check_out ? form.check_out.slice(0,16) : ''} onChange={e => setForm({...form, check_out: e.target.value})}/></div>
              </div>
              <div className="form-group"><label>Notes</label><input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}/></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Log'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
