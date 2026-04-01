import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCog, CreditCard, RefreshCw,
  CalendarCheck, Calendar, Dumbbell, DollarSign, TrendingUp, Zap
} from 'lucide-react';
import './Sidebar.css';

const NAV = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/members',     icon: Users,           label: 'Members' },
  { to: '/staff',       icon: UserCog,         label: 'Staff & Trainers' },
  { to: '/memberships', icon: CreditCard,      label: 'Membership Plans' },
  { to: '/subscriptions', icon: RefreshCw,     label: 'Subscriptions' },
  { to: '/attendance',  icon: CalendarCheck,   label: 'Attendance' },
  { to: '/schedules',   icon: Calendar,        label: 'Schedules' },
  { to: '/equipment',   icon: Dumbbell,        label: 'Equipment' },
  { to: '/payments',    icon: DollarSign,      label: 'Payments' },
  { to: '/workouts',    icon: Zap,             label: 'Workouts' },
  { to: '/progress',    icon: TrendingUp,      label: 'Member Progress' },
];

const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar-header">
      <Dumbbell className="logo-icon" size={30} />
      <h2>FitManage</h2>
    </div>
    <nav className="sidebar-nav">
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          <Icon size={18} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
    <div className="sidebar-footer">
      <div className="user-profile">
        <div className="avatar">A</div>
        <div className="user-info">
          <span className="user-name">Admin</span>
          <span className="user-role">Manager</span>
        </div>
      </div>
    </div>
  </aside>
);

export default Sidebar;
