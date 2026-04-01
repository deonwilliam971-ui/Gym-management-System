import React, { useState, useEffect } from 'react';
import api from '../api';
import { UserPlus, Pencil, Trash2, Search, X } from 'lucide-react';
import './PageShared.css';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone_number: '', membership_type: 'Basic', is_active: true
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get('members/');
      setMembers(res.data);
    } catch (error) {
      console.error("Error fetching members", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`members/${editId}/`, formData);
      } else {
        await api.post('members/', formData);
      }
      setShowModal(false);
      setEditId(null);
      setFormData({ first_name: '', last_name: '', email: '', phone_number: '', membership_type: 'Basic', is_active: true });
      fetchMembers();
    } catch (error) {
      console.error("Error saving member", error);
    }
  };

  const handleEdit = (member) => {
    setFormData(member);
    setEditId(member.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await api.delete(`members/${id}/`);
        fetchMembers();
      } catch (error) {
        console.error("Error deleting", error);
      }
    }
  };

  const filteredMembers = members.filter(m => 
    `${m.first_name} ${m.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="members-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Members Directory</h1>
          <p className="text-muted">Manage your gym members and subscriptions here.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditId(null); setShowModal(true); }}>
          <UserPlus size={20} />
          Add Member
        </button>
      </header>

      <div className="glass-card members-card">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="members-table">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Contact</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.id}>
                  <td>
                    <div className="member-name-cell">
                      <div className="mini-avatar">{member.first_name[0]}{member.last_name[0]}</div>
                      <span className="name-text">{member.first_name} {member.last_name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <span className="email">{member.email}</span>
                      <span className="phone">{member.phone_number}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge plan-${member.membership_type.toLowerCase()}`}>
                      {member.membership_type}
                    </span>
                  </td>
                  <td>
                    <span className={`status-dot ${member.is_active ? 'active' : 'inactive'}`}></span>
                    {member.is_active ? 'Active' : 'Inactive'}
                  </td>
                  <td>{member.join_date}</td>
                  <td>
                    <div className="action-btns">
                      <button className="icon-btn edit" onClick={() => handleEdit(member)}><Pencil size={18} /></button>
                      <button className="icon-btn delete" onClick={() => handleDelete(member.id)}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center empty-state">No members found. Add some to get started!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <h3>{editId ? 'Edit Member' : 'New Member'}</h3>
            <form onSubmit={handleSubmit} className="member-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input required type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input required type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Membership</label>
                  <select value={formData.membership_type} onChange={e => setFormData({...formData, membership_type: e.target.value})}>
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} />
                    Active Member
                  </label>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Create Member'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
