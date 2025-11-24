import React, { useEffect, useState } from "react";
import api from "../services/api";

function StatusBadge({ status }) {
  const base = "text-xs px-2 py-0.5 rounded-full border";

  if (status === "Contacted")
    return (
      <span
        className={`${base} bg-green-50 text-green-700 border-green-100`}
      >
        {status}
      </span>
    );

  if (status === "Followup")
    return (
      <span
        className={`${base} bg-yellow-50 text-yellow-700 border-yellow-100`}
      >
        {status}
      </span>
    );

  return (
    <span className={`${base} bg-gray-50 text-gray-700 border-gray-100`}>
      {status}
    </span>
  );
}

export default function LeadsTable({
  leads,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
  onAssign,
}) {
  const [employees, setEmployees] = useState([]);

  // Load Employees (FOR ASSIGN DROPDOWN)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/employees");
        if (!mounted) return;
        setEmployees(res.data?.data ?? res.data);
      } catch (err) {
        console.error("Fetch employees error:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="p-6 text-sm text-gray-500">Loading leads...</div>
    );

  if (!leads || leads.length === 0)
    return <div className="p-6 text-sm text-gray-500">No leads found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-left text-gray-500 bg-gray-50">
          <tr>
            <th className="p-3"><input type="checkbox" /></th>
            <th className="p-3">Ser no</th>
            <th className="p-3">Company</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Tags</th>
            <th className="p-3">Image</th>
            <th className="p-3">Status</th>
            <th className="p-3">Employee</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead, index) => (
            <tr key={lead._id} className="border-t hover:bg-gray-50">
              <td className="p-3">
                <input type="checkbox" />
              </td>

              <td className="p-3">{index + 1}</td>

              <td className="p-3 font-medium text-accent">
                {lead.company}
              </td>

              <td className="p-3">{lead.email}</td>

              <td className="p-3">{lead.phone}</td>

              {/* TAGS */}
              <td className="p-3">
                {lead.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-block bg-red-50 text-accent border border-red-100 px-2 py-0.5 text-xs rounded-full mr-1"
                  >
                    {tag}
                  </span>
                ))}
              </td>

              {/* IMAGE */}
              <td className="p-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                  {lead.imageUrl ? (
                    <img
                      src={
                        lead.imageUrl.startsWith("http")
                          ? lead.imageUrl
                          : "/images/dashboard.png"
                      }
                      alt={lead.company}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-[10px] text-gray-500 flex items-center justify-center h-full">
                      N/A
                    </div>
                  )}
                </div>
              </td>

              {/* STATUS SELECT */}
              <td className="p-3">
                <select
                  value={lead.status}
                  onChange={(e) =>
                    onStatusChange(lead._id, e.target.value)
                  }
                  className="border rounded px-2 py-1 text-xs bg-white"
                >
                  <option>New</option>
                  <option>Followup</option>
                  <option>Contacted</option>
                </select>
              </td>

              {/* EMPLOYEE ASSIGN */}
              <td className="p-3">
                <select
                  value={lead.assignedTo?._id ?? ""}
                  onChange={(e) => onAssign(lead._id, e.target.value)}
                  className="border rounded px-2 py-1 text-xs bg-white"
                >
                  <option value="">Unassigned</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </td>

              {/* ACTION BUTTONS */}
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(lead)}
                    className="text-gray-700 text-lg"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(lead)}
                    className="text-red-500 text-lg"
                  >
                    🗑️
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
