import React from 'react';
import { NavLink } from 'react-router-dom';

const Icon = ({name, className='w-5 h-5'}) => {
  const icons = {
    connect: (<svg className={className} viewBox="0 0 24 24" fill="none"><path d="M12 3v3M12 18v3M4.2 6.2l2.2 2.2M17.6 15.6l2.2 2.2M3 12h3M18 12h3M6.2 17.8l2.2-2.2M15.6 6.4l2.2-2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>),
    dashboard: (<svg className={className} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" /></svg>),
    leads: (<svg className={className} viewBox="0 0 24 24" fill="none"><path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
    employee: (<svg className={className} viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 100-8 4 4 0 000 8zM6 20a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.5"/></svg>),
    logout: (<svg className={className} viewBox="0 0 24 24" fill="none"><path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 4h8v16H4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>)
  };
  return icons[name] || null;
};

const LinkItem = ({to, icon, label}) => (
  <NavLink
    to={to}
    className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
      isActive ? 'bg-red-50 text-accent font-medium' : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="w-72 bg-white h-screen p-5 border-r border-gray-100">
      <button className="bg-accent text-white px-4 py-2 rounded-lg mb-6 w-full text-sm flex items-center justify-center gap-2">
        <span className="inline-block -mt-[1px]">{Icon({name:'connect', className:'w-4 h-4'})}</span>
        Connect CRM
      </button>

      <nav className="space-y-1">
        <div className="text-sm text-gray-400 mb-2">Menu</div>
        <LinkItem to="/" icon={Icon({name:'dashboard'})} label="Dashboard" />
        <LinkItem to="/leads" icon={Icon({name:'leads'})} label="Leads" />
        <LinkItem to="/employees" icon={Icon({name:'employee'})} label="Employee" />
        <button onClick={() => { localStorage.removeItem('token'); window.location.href='/login'; }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 mt-6 hover:bg-gray-50 w-full text-left">
          <span className="text-lg">{Icon({name:'logout'})}</span>
          Logout
        </button>
      </nav>
    </aside>
  );
}
