import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

export default function LeadDetail(){
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    let mounted = true;
    (async ()=> {
      try {
        const res = await api.get(`/leads/${id}`);
        if (!mounted) return;
        setLead(res.data.data ?? res.data);
      } catch (e) { console.error(e); }
      finally { if(mounted) setLoading(false); }
    })();
    return ()=> mounted = false;
  }, [id]);

  return (
    <div className="min-h-screen bg-softbg flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl border p-6">
          {loading && <div>Loading...</div>}
          {!loading && !lead && <div>Lead not found</div>}
          {!loading && lead && (
            <>
              <h2 className="text-xl font-semibold">{lead.company}</h2>
              <p className="text-sm text-gray-500">{lead.email} • {lead.phone}</p>
              <div className="mt-4">
                <img src={lead.imageUrl || '/images/dashboard.png'} alt={lead.company} className="w-64 h-40 object-cover rounded-md" onError={(e)=> e.currentTarget.src='/images/dashboard.png'} />
              </div>
              <div className="mt-3">Status: <strong>{lead.status}</strong></div>
              <div>Assigned: <strong>{lead.assignedTo?.name ?? 'Unassigned'}</strong></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
