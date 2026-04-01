// Base API URL
const API_URL = import.meta.e || 'http://localhost:3000/api';

// DOM Elements
const membersTableBody = document.getElementById('members-table-body');
const planSelect = document.getElementById('plan_id');
const addMemberModal = document.getElementById('addMemberModal');
const addMemberForm = document.getElementById('add-member-form');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// Dashboard Elements
const totalMembersCount = document.getElementById('total-members-count');
const activePlansCount = document.getElementById('active-plans-count');
const revenueEstimate = document.getElementById('revenue-estimate');

// State
let members = [];
let plans = [];

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    loadPlans();
    loadMembers();
});

// Modal Controls
function openModal() {
    addMemberModal.classList.add('active');
}

function closeModal() {
    addMemberModal.classList.remove('active');
    addMemberForm.reset();
}

// Toast Notification
function showToast(message, isError = false) {
    toastMessage.textContent = message;
    if (isError) {
        toast.classList.add('error');
    } else {
        toast.classList.remove('error');
    }
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Fetch API requests
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'API Error');
        }
        return data;
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
}

// Load Plans
async function loadPlans() {
    try {
        plans = await fetchAPI('/plans');

        // Update Select Dropdown
        planSelect.innerHTML = '<option value="">-- Choose a Plan --</option>';
        plans.forEach(plan => {
            const option = document.createElement('option');
            option.value = plan.id;
            option.textContent = `${plan.name} - $${plan.price}`;
            planSelect.appendChild(option);
        });

        updateDashboard();
    } catch (error) {
        showToast('Failed to load plans', true);
    }
}

// Load Members
async function loadMembers() {
    try {
        membersTableBody.innerHTML = `<tr><td colspan="7" class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Loading...</td></tr>`;
        members = await fetchAPI('/members');
        renderMembersTable();
        updateDashboard();
    } catch (error) {
        membersTableBody.innerHTML = `<tr><td colspan="7" class="loading-state">Failed to load members. Is the backend and database running?</td></tr>`;
        showToast('Failed to load members', true);
    }
}

// Add New Member
addMemberForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        plan_id: document.getElementById('plan_id').value || null
    };

    const btn = document.getElementById('save-member-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Saving...';
    btn.disabled = true;

    try {
        await fetchAPI('/members', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        showToast('Member added successfully!');
        closeModal();
        loadMembers(); // Refresh List
    } catch (error) {
        showToast(error.message, true);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
});

// Delete Member
async function deleteMember(id) {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
        await fetchAPI(`/members/${id}`, { method: 'DELETE' });
        showToast('Member removed successfully');
        loadMembers(); // Refresh List
    } catch (error) {
        showToast(error.message, true);
    }
}

// Render Table
function renderMembersTable() {
    if (members.length === 0) {
        membersTableBody.innerHTML = `<tr><td colspan="7" class="loading-state">No members found. Add one to get started!</td></tr>`;
        return;
    }

    membersTableBody.innerHTML = '';

    members.forEach(member => {
        const date = new Date(member.join_date).toLocaleDateString();
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="avatar" style="width:30px;height:30px;font-size:12px;">
                        ${member.first_name.charAt(0)}${member.last_name.charAt(0)}
                    </div>
                    <strong>${member.first_name} ${member.last_name}</strong>
                </div>
            </td>
            <td style="color: var(--text-secondary)">${member.email}</td>
            <td>${member.phone || '-'}</td>
            <td>${date}</td>
            <td><span style="color: var(--primary-color); font-weight: 500;">${member.plan_name || 'No Plan'}</span></td>
            <td><span class="status-badge ${member.status.toLowerCase()}">${member.status}</span></td>
            <td>
                <button class="btn-danger-sm" onclick="deleteMember(${member.id})" title="Remove">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        membersTableBody.appendChild(tr);
    });
}

// Update Dashboard Statistics
function updateDashboard() {
    totalMembersCount.textContent = members.length;

    // Count members who have a plan
    const activePlans = members.filter(m => m.plan_id !== null).length;
    activePlansCount.textContent = activePlans;

    // Calculate estimated revenue (simplified based on plan prices)
    let revenue = 0;
    if (plans.length > 0) {
        members.forEach(member => {
            if (member.plan_id) {
                const plan = plans.find(p => p.id === member.plan_id);
                if (plan) {
                    revenue += parseFloat(plan.price);
                }
            }
        });
    }

    revenueEstimate.textContent = `$${revenue.toFixed(2)}`;
}
