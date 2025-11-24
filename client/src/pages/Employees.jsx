import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import EmployeesTable from "../components/EmployeesTable";
import EmployeeModal from "../components/EmployeeModal";
import ConfirmModal from "../components/ConfirmModal";
import api from "../services/api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null, message: "" });
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchEmployees = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/employees?page=${p}&limit=${limit}`);
      const arr = res.data?.data ?? res.data ?? [];
      setEmployees(arr);
      setTotal(res.data?.total ?? arr.length);
      setPage(p);
    } catch (err) {
      console.error("fetch employees", err);
      setErrorMessage(err?.response?.data?.message || err.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEmployees(1); }, [fetchEmployees]);

  const openAdd = () => { setSelected(null); setShowModal(true); };
  const openEdit = (emp) => { setSelected(emp); setShowModal(true); };
  const closeModal = () => { setSelected(null); setShowModal(false); };

 const handleSave = async (payload, isEdit = false) => {
  try {
    if (payload instanceof FormData) {
      if (isEdit) {
        if (!selected || !selected._id) throw new Error("Missing id for edit");
        await api.put(`/employees/${selected._id}`, payload);
      } else {
        await api.post('/employees', payload);
      }
    } else {
      if (isEdit) {
        const id = payload._id ?? selected?._id;
        if (!id) throw new Error("Missing id for edit");
        await api.put(`/employees/${id}`, payload);
      } else {
        await api.post('/employees', payload);
      }
    }
    await fetchEmployees(1);
  } catch (err) {
    console.error("save employee error", err);
    throw err;
  }
};

  const requestDelete = (emp) => {
    setConfirm({ open: true, id: emp._id, message: `Are you sure you want to delete ${emp.name}?` });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/employees/${confirm.id}`);
      setConfirm({ open: false, id: null, message: "" });
      fetchEmployees(1);
    } catch (err) {
      console.error("delete employee", err);
      setErrorMessage(err?.response?.data?.message || err.message || "Failed to delete");
    }
  };

  const toggleStatus = async (id, newStatus) => {
    try {
      await api.put(`/employees/${id}`, { status: newStatus });
      fetchEmployees(page);
    } catch (err) {
      console.error("toggle status", err);
      setErrorMessage(err?.response?.data?.message || err.message || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-softbg flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <Topbar onSearch={() => {}} />
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Employee list</h1>
              <button onClick={openAdd} className="bg-accent text-white px-4 py-2 rounded-lg">+ Add employee</button>
            </div>

            {errorMessage && <div className="mt-3 text-sm text-red-600">{errorMessage}</div>}

            <div className="mt-4">
              <EmployeesTable
                employees={employees}
                loading={loading}
                onEdit={openEdit}
                onDelete={requestDelete}
                onStatusToggle={toggleStatus}
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">Showing {employees.length} of {total}</div>
              <div className="flex items-center gap-2">
                <button disabled={page <= 1} onClick={() => fetchEmployees(page - 1)} className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
                <button disabled={page * limit >= total} onClick={() => fetchEmployees(page + 1)} className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <EmployeeModal
          employee={selected}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {confirm.open && (
        <ConfirmModal
          title="Delete Employee"
          message={confirm.message}
          onConfirm={handleDelete}
          onCancel={() => setConfirm({ open:false, id:null, message:"" })}
          confirmText="Delete"
        />
      )}
    </div>
  );
}
