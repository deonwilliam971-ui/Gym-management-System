import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import './PageShared.css';

const BLANK = { name: '', category: 'Other', description: '', duration_minutes: 30, calories_burned: 0, difficulty: 'Beginner' };

export default function Workouts() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchAll(); }, []);
  const fetchAll = async () => { try { const r = await api.get('workouts/'); setItems(r.data); } catch(e) { console.error(e); } };
  const openAdd = () => { setForm(BLANK); setEditId(null); setShowModal(true); };
  const openEdit = (item) => { setForm({...item}); setEditId(item.id); setShowModal(true); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`workouts/${editId}/`, form);
      else await api.post('workouts/', form);
      setShowModal(false); fetchAll();
    } catch(e) { console.error(e); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workout?')) return;
    try { await api.delete(`workouts/${id}/`); fetchAll(); } catch(e) { console.error(e); }
  };
  const sf = items.filter(i => (i.name||'').toLowerCase().includes(search.toLowerCase()) || (i.category||'').toLowerCase().includes(search.toLowerCase()));
  const diffColor = { Beginner: 'active', Intermediate: 'warn', Advanced: 'inactive' };

  return (
    <div className="page-container">
      <header className="page-header">
        <div><h1 className="page-title">Workouts</h1><p className="text-muted">Manage workout library used for member progress tracking.</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18}/> Add Workout</button>
      </header>
      <div className="glass-card">
        <div className="search-bar"><Search size={18} className="search-icon"/><input placeholder="Search by name or category..." value={search} onChange={e => setSearch(e.target.value)}/></div>
        <div className="table-responsive">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Category</th><th>Duration</th><th>Calories</th><th>Difficulty</th><th>Actions</th></tr></thead>
            <tbody>
              {sf.map(i => (
                <tr key={i.id}>
                  <td><strong>{i.name}</strong></td>
                  <td><span className="badge badge-day">{i.category}</span></td>
                  <td>{i.duration_minutes} min</td>
                  <td>{i.calories_burned} kcal</td>
                  <td><span className={`status-dot ${diffColor[i.difficulty]}`}/>{i.difficulty}</td>
                  <td><div className="action-btns">
                    <button className="icon-btn edit" onClick={() => openEdit(i)}><Pencil size={16}/></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(i.id)}><Trash2 size={16}/></button>
                  </div></td>
                </tr>
              ))}
              {sf.length === 0 && <tr><td colSpan="6" className="empty-state">No workouts found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <div className="modal-header"><h3>{editId ? 'Edit Workout' : 'Add Workout'}</h3><button className="icon-btn" onClick={() => setShowModal(false)}><X size={18}/></button></div>
            <form onSubmit={handleSubmit} className="crud-form">
              <div className="form-row">
                <div className="form-group"><label>Name</label><input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}/></div>
                <div className="form-group"><label>Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {['Cardio','Strength','Flexibility','HIIT','Yoga','CrossFit','Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Duration (min)</label><input type="number" min="1" value={form.duration_minutes} onChange={e => setForm({...form, duration_minutes: e.target.value})}/></div>
                <div className="form-group"><label>Calories Burned</label><input type="number" min="0" value={form.calories_burned} onChange={e => setForm({...form, calories_burned: e.target.value})}/></div>
              </div>
              <div className="form-group"><label>Difficulty</label>
                <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}>
                  {['Beginner','Intermediate','Advanced'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3}/></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Add Workout'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
