import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import './PageShared.css';

const BLANK = { title: '', trainer: '', day_of_week: 'Monday', start_time: '', end_time: '', max_capacity: 20, location: '' };
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export default function Schedules() {
  const [items, setItems] = useState([]);
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchAll(); fetchStaff(); }, []);
  const fetchAll = async () => { try { const r = await api.get('schedules/'); setItems(r.data); } catch(e) { console.error(e); } };
  const fetchStaff = async () => { try { const r = await api.get('staff/'); setStaff(r.data); } catch(e) { console.error(e); } };
  const openAdd = () => { setForm(BLANK); setEditId(null); setShowModal(true); };
  const openEdit = (item) => { setForm({...item, trainer: item.trainer || ''}); setEditId(item.id); setShowModal(true); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, trainer: form.trainer || null };
    try {
      if (editId) await api.put(`schedules/${editId}/`, payload);
      else await api.post('schedules/', payload);
      setShowModal(false); fetchAll();
    } catch(e) { console.error(e); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this schedule?')) return;
    try { await api.delete(`schedules/${id}/`); fetchAll(); } catch(e) { console.error(e); }
  };
  const sf = items.filter(i => (i.title||'').toLowerCase().includes(search.toLowerCase()) || (i.day_of_week||'').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-container">
      <header className="page-header">
        <div><h1 className="page-title">Class Schedules</h1><p className="text-muted">Manage weekly class timetable and trainer assignments.</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18}/> Add Schedule</button>
      </header>
      <div className="glass-card">
        <div className="search-bar"><Search size={18} className="search-icon"/><input placeholder="Search by class or day..." value={search} onChange={e => setSearch(e.target.value)}/></div>
        <div className="table-responsive">
          <table className="data-table">
            <thead><tr><th>Class</th><th>Day</th><th>Time</th><th>Trainer</th><th>Capacity</th><th>Location</th><th>Actions</th></tr></thead>
            <tbody>
              {sf.map(i => (
                <tr key={i.id}>
                  <td><strong>{i.title}</strong></td>
                  <td><span className="badge badge-day">{i.day_of_week}</span></td>
                  <td>{i.start_time} – {i.end_time}</td>
                  <td>{i.trainer_name || '—'}</td>
                  <td>{i.max_capacity}</td>
                  <td>{i.location || '—'}</td>
                  <td><div className="action-btns">
                    <button className="icon-btn edit" onClick={() => openEdit(i)}><Pencil size={16}/></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(i.id)}><Trash2 size={16}/></button>
                  </div></td>
                </tr>
              ))}
              {sf.length === 0 && <tr><td colSpan="7" className="empty-state">No schedules found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <div className="modal-header"><h3>{editId ? 'Edit Schedule' : 'New Schedule'}</h3><button className="icon-btn" onClick={() => setShowModal(false)}><X size={18}/></button></div>
            <form onSubmit={handleSubmit} className="crud-form">
              <div className="form-group"><label>Class Title</label><input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}/></div>
              <div className="form-row">
                <div className="form-group"><label>Day</label>
                  <select value={form.day_of_week} onChange={e => setForm({...form, day_of_week: e.target.value})}>
                    {DAYS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Trainer</label>
                  <select value={form.trainer} onChange={e => setForm({...form, trainer: e.target.value})}>
                    <option value="">None</option>
                    {staff.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Start Time</label><input required type="time" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})}/></div>
                <div className="form-group"><label>End Time</label><input required type="time" value={form.end_time} onChange={e => setForm({...form, end_time: e.target.value})}/></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Capacity</label><input type="number" min="1" value={form.max_capacity} onChange={e => setForm({...form, max_capacity: e.target.value})}/></div>
                <div className="form-group"><label>Location</label><input value={form.location} onChange={e => setForm({...form, location: e.target.value})}/></div>
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
