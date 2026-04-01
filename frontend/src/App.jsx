import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Staff from './pages/Staff';
import Memberships from './pages/Memberships';
import Subscriptions from './pages/Subscriptions';
import Attendance from './pages/Attendance';
import Schedules from './pages/Schedules';
import Equipment from './pages/Equipment';
import Payments from './pages/Payments';
import Workouts from './pages/Workouts';
import MemberProgress from './pages/MemberProgress';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/"              element={<Dashboard />} />
            <Route path="/members"       element={<Members />} />
            <Route path="/staff"         element={<Staff />} />
            <Route path="/memberships"   element={<Memberships />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/attendance"    element={<Attendance />} />
            <Route path="/schedules"     element={<Schedules />} />
            <Route path="/equipment"     element={<Equipment />} />
            <Route path="/payments"      element={<Payments />} />
            <Route path="/workouts"      element={<Workouts />} />
            <Route path="/progress"      element={<MemberProgress />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
