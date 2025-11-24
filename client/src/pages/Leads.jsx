import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import api from '../services/api';
import LeadsTable from '../components/LeadsTable';
import LeadModal from '../components/LeadModal';
import ConfirmModal from '../components/ConfirmModal';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [selectedLead, setSelectedLead] = useState(null); // for edit
  const [showModal, setShowModal] = useState(false);
  const [confirm, setConfirm] = useState({ open:false, leadId:null, message:'' });

  const fetchLeads = useCallback(async (opts={}) => {
    try {
      setLoading(true);
      const q = opts.q !== undefined ? opts.q : searchQ;
      const p = opts.page || page;
      const res = await api.get(`/leads?search=${encodeURIComponent(q || '')}&page=${p}&limit=${limit}`);
      // API returns { data, total, page, limit } or raw array
      const data = res.data?.data ?? res.data;
      const tot = res.data?.total ?? (Array.isArray(res.data) ? res.data.length : 0);
      setLeads(data);
      setTotal(tot);
      setPage(p);
    } catch (err) {
      console.error('fetchLeads', err);
      // optionally show toast
    } finally {
      setLoading(false);
    }
  }, [searchQ, page, limit]);

  useEffect(()=> {
    fetchLeads({ page:1 });
  }, [fetchLeads]);

  const onSearch = (q) => {
    setSearchQ(q);
    fetchLeads({ q, page:1 });
  };

  const openAdd = () => {
    setSelectedLead(null);
    setShowModal(true);
  };

  const openEdit = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLead(null);
  };

const handleSave = async (payload, isEdit=false) => {
  try {
    if (payload instanceof FormData) {
      if (isEdit) {
        // FormData must be sent to PUT /leads/:id
        const id = payload.get('_id') || (selectedLead && selectedLead._id);
        // remove _id from FormData if present
        if (id) {
          // send FormData with PUT; axios supports FormData
          await api.put(`/leads/${id}`, payload, { headers: { 'Content-Type': 'multipart/form-data' }});
        } else {
          await api.post('/leads', payload, { headers: { 'Content-Type': 'multipart/form-data' }});
        }
      } else {
        await api.post('/leads', payload, { headers: { 'Content-Type': 'multipart/form-data' }});
      }
    } else {
      if (isEdit) {
        await api.put(`/leads/${payload._id}`, payload);
      } else {
        await api.post('/leads', payload);
      }
    }
    closeModal();
    fetchLeads({ q: searchQ, page: 1 });
  } catch (err) {
    console.error('save lead', err);
    throw err;
  }
};


  const handleDeleteRequest = (lead) => {
    setConfirm({ open:true, leadId: lead._id, message: `Are you sure you want to delete ${lead.company}?`});
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/leads/${confirm.leadId}`);
      setConfirm({ open:false, leadId:null, message:'' });
      fetchLeads({ q: searchQ, page: 1 });
    } catch (err) {
      console.error('delete lead', err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/leads/${id}/status`, { status });
      fetchLeads({ q: searchQ, page });
    } catch (err) {
      console.error('status change', err);
    }
  };

  const handleAssign = async (id, employeeId) => {
    try {
      await api.patch(`/leads/${id}/assign`, { employeeId });
      fetchLeads({ q: searchQ, page });
    } catch (err) {
      console.error('assign', err);
    }
  };

  return (
    <div className="min-h-screen bg-softbg flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <Topbar onSearch={onSearch} />
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Leads</h1>
              <button onClick={openAdd} className="bg-accent text-white px-4 py-2 rounded-lg">+ New Lead</button>
            </div>

            <div className="mt-4">
              <LeadsTable
                leads={leads}
                loading={loading}
                onEdit={openEdit}
                onDelete={handleDeleteRequest}
                onStatusChange={handleStatusChange}
                onAssign={handleAssign}
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">Showing {(page-1)*limit + 1} - {Math.min(page*limit, total)} of {total}</div>
              <div className="flex items-center gap-2">
                <button disabled={page<=1} onClick={()=>fetchLeads({ page: page-1 })} className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
                <button disabled={page*limit>=total} onClick={()=>fetchLeads({ page: page+1 })} className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <LeadModal
          lead={selectedLead}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {confirm.open && (
        <ConfirmModal
          title="Delete Lead"
          message={confirm.message}
          onConfirm={handleDelete}
          onCancel={()=>setConfirm({ open:false, leadId:null, message:'' })}
          confirmText="Delete"
        />
      )}
    </div>
  );
}
