import React from "react";

export default function EmployeesTable({ employees, loading, onEdit, onDelete, onStatusToggle }) {
  if (loading) return <div className="p-6 text-sm text-gray-500">Loading employees...</div>;
  if (!employees || employees.length === 0) return <div className="p-6 text-sm text-gray-500">No employees yet.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-left text-gray-500 bg-gray-50">
          <tr>
            <th className="p-3"><input type="checkbox" /></th>
            <th className="p-3">Ser no</th>
            <th className="p-3">Company / Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Position</th>
            <th className="p-3">Number of leads</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, idx) => (
            <tr key={emp._id} className="border-t hover:bg-gray-50">
              <td className="p-3"><input type="checkbox" /></td>
              <td className="p-3">{idx + 1}</td>
              <td className="p-3 text-accent font-medium">{emp.name}</td>
              <td className="p-3">{emp.email}</td>
              <td className="p-3">{emp.phone}</td>
              <td className="p-3">{emp.position}</td>
              <td className="p-3">{emp.numLeads ?? 0}</td>
              <td className="p-3">
                <select
                  value={emp.status}
                  onChange={(e) => onStatusToggle(emp._id, e.target.value)}
                  className="text-xs border rounded px-2 py-1"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => onEdit(emp)} className="text-gray-700">✏️</button>
                  <button onClick={() => onDelete(emp)} className="text-red-500">🗑️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
