
import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatsCard from '../components/StatsCard';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const designPublicPath = '/images/dashboard.png'; 
export default function Dashboard() {
  const [counts, setCounts] = useState({ leads: 0, employees: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const [leadsRes, employeesRes] = await Promise.all([
        api.get('/leads?limit=6&page=1').catch(()=>null),
        api.get('/employees').catch(()=>null)
      ]);

      const totalLeads = leadsRes?.data?.total ?? (Array.isArray(leadsRes?.data) ? leadsRes.data.length : 0);
      const employeesList = employeesRes?.data?.data ?? employeesRes?.data ?? [];
      setCounts({ leads: totalLeads, employees: employeesList.length });

      const leadsList = leadsRes?.data?.data ?? leadsRes?.data ?? [];
      setRecent(leadsList);
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(()=> { load(); const id=setInterval(load,60000); return ()=>clearInterval(id); }, [load]);

  const onSearch = (q) => { if(!q) return; navigate(`/leads?search=${encodeURIComponent(q)}`); };

  return (
    <div className="min-h-screen bg-softbg flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <Topbar onSearch={onSearch} />
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">CRM Admin Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Total number of Subadmin in CRM.</p>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={load} className="px-3 py-1 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">Refresh</button>
                <div className="text-xs text-gray-400">Updated: {new Date().toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatsCard title="Leads" subtitle="Total number of leads in CRM." value={loading ? '...' : counts.leads.toLocaleString()} />
              <StatsCard title="Employees" subtitle="Total number of employees in CRM." value={loading ? '...' : counts.employees} />
            </div>

           

          </div>
        </div>
      </div>
    </div>
  );
}
