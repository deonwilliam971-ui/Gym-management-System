import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import './PageShared.css';

const BLANK = { member: '', workout: '', date: '', weight_kg: '', body_fat_pct: '', reps: '', sets: '', duration_minutes: '', notes: '' };

export default function MemberProgress() {
  const [items, setItems] = useState([]);
  const [members, setMembers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchAll(); fetchRefs(); }, []);
  const fetchAll = async () => { try { const r = await api.get('progress/'); setItems(r.data); } catch(e) { console.error(e); } };
  const fetchRefs = async () => {
    try {
      const [m, w] = await Promise.all([api.get('members/'), api.get('workouts/')]);
      setMembers(m.data); setWorkouts(w.data);
    } catch(e) { console.error(e); }
  };
  const openAdd = () => { setForm(BLANK); setEditId(null); setShowModal(true); };
  const openEdit = (item) => { setForm({...item, workout: item.workout||''}); setEditId(item.id); setShowModal(true); };
  const clean = (val) => val === '' ? null : val;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, weight_kg: clean(form.weight_kg), body_fat_pct: clean(form.body_fat_pct), reps: clean(form.reps), sets: clean(form.sets), duration_minutes: clean(form.duration_minutes), workout: form.workout || null };
    try {
      if (editId) await api.put(`progress/${editId}/`, payload);
      else await api.post('progress/', payload);
      setShowModal(false); fetchAll();
    } catch(e) { console.error(e); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try { await api.delete(`progress/${id}/`); fetchAll(); } catch(e) { console.error(e); }
  };
  const sf = items.filter(i => (i.member_name||'').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-container">
      <header className="page-header">
        <div><h1 className="page-title">Member Progress</h1><p className="text-muted">Log workout sessions and track physical progress over time.</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18}/> Log Progress</button>
      </header>
      <div className="glass-card">
        <div className="search-bar"><Search size={18} className="search-icon"/><input placeholder="Search by member..." value={search} onChange={e => setSearch(e.target.value)}/></div>
        <div className="table-responsive">
          <table className="data-table">
            <thead><tr><th>Member</th><th>Workout</th><th>Date</th><th>Weight</th><th>Body Fat %</th><th>Sets × Reps</th><th>Duration</th><th>Actions</th></tr></thead>
            <tbody>
              {sf.map(i => (
                <tr key={i.id}>
                  <td>{i.member_name}</td>
                  <td>{i.workout_name || '—'}</td>
                  <td>{i.date}</td>
                  <td>{i.weight_kg ? `${i.weight_kg} kg` : '—'}</td>
                  <td>{i.body_fat_pct ? `${i.body_fat_pct}%` : '—'}</td>
                  <td>{i.sets && i.reps ? `${i.sets} × ${i.reps}` : '—'}</td>
                  <td>{i.duration_minutes ? `${i.duration_minutes} min` : '—'}</td>
                  <td><div className="action-btns">
                    <button className="icon-btn edit" onClick={() => openEdit(i)}><Pencil size={16}/></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(i.id)}><Trash2 size={16}/></button>
                  </div></td>
                </tr>
              ))}
              {sf.length === 0 && <tr><td colSpan="8" className="empty-state">No progress records found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <div className="modal-header"><h3>{editId ? 'Edit Progress' : 'Log Progress'}</h3><button className="icon-btn" onClick={() => setShowModal(false)}><X size={18}/></button></div>
            <form onSubmit={handleSubmit} className="crud-form">
              <div className="form-row">
                <div className="form-group"><label>Member</label>
                  <select required value={form.member} onChange={e => setForm({...form, member: e.target.value})}>
                    <option value="">Select member...</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Workout (optional)</label>
                  <select value={form.workout} onChange={e => setForm({...form, workout: e.target.value})}>
                    <option value="">None</option>
                    {workouts.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Date</label><input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}/></div>
              <div className="form-row">
                <div className="form-group"><label>Weight (kg)</label><input type="number" step="0.01" value={form.weight_kg} onChange={e => setForm({...form, weight_kg: e.target.value})}/></div>
                <div className="form-group"><label>Body Fat %</label><input type="number" step="0.01" value={form.body_fat_pct} onChange={e => setForm({...form, body_fat_pct: e.target.value})}/></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Sets</label><input type="number" min="0" value={form.sets} onChange={e => setForm({...form, sets: e.target.value})}/></div>
                <div className="form-group"><label>Reps</label><input type="number" min="0" value={form.reps} onChange={e => setForm({...form, reps: e.target.value})}/></div>
                <div className="form-group"><label>Duration (min)</label><input type="number" min="0" value={form.duration_minutes} onChange={e => setForm({...form, duration_minutes: e.target.value})}/></div>
              </div>
              <div className="form-group"><label>Notes</label><textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2}/></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Log Progress'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
