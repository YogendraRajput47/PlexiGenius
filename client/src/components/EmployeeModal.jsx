import React, { useEffect, useState, useRef } from "react";

export default function EmployeeModal({ employee = null, onClose, onSave }) {
  const designPreview = "/images/employee-preview.png"; 
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    status: "Active",
    numLeads: 0,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const firstRef = useRef(null);

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        position: employee.position || "",
        status: employee.status || "Active",
        numLeads: employee.numLeads ?? 0,
      });
      setPreview(employee.imageUrl ?? designPreview);
    } else {
      setForm({ name: "", email: "", phone: "", position: "", status: "Active", numLeads: 0 });
      setPreview(designPreview);
      setFile(null);
    }
  }, [employee]);

  useEffect(() => { setTimeout(() => firstRef.current?.focus?.(), 40); }, []);

  const handleChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));
  const handleFile = (e) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(employee?.imageUrl ?? designPreview);
  };

  const validate = () => {
    if (!form.name || form.name.trim() === "") {
      setError("Name is required.");
      return false;
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setSaving(true);

    try {
      if (file) {
        const fd = new FormData();
        fd.append("name", form.name);              
        fd.append("email", form.email || "");
        fd.append("phone", form.phone || "");
        fd.append("position", form.position || "");
        fd.append("status", form.status || "Active");
        fd.append("numLeads", String(form.numLeads ?? 0));
        fd.append("image", file);

    

        await onSave(fd, !!employee);
      } else {
        const payload = {
          name: form.name,
          email: form.email || undefined,
          phone: form.phone || undefined,
          position: form.position || undefined,
          status: form.status || "Active",
          numLeads: form.numLeads ?? 0,
        };
        if (employee && employee._id) payload._id = employee._id;
        await onSave(payload, !!employee);
      }

      onClose();
    } catch (err) {
      console.error("employee save error", err);
      const server = err?.response?.data;
      const msg = server?.message || (server?.errors ? server.errors.map(e => e.msg).join(", ") : err.message);
      setError(msg || "Failed to save employee");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-11/12 max-w-2xl rounded-xl p-6" onMouseDown={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-semibold mb-4">{employee ? "Edit Employee" : "Add Employee"}</h3>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm block mb-1">Name *</label>
            <input ref={firstRef} name="name" value={form.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border px-3 py-2 rounded" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="border px-3 py-2 rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="position" value={form.position} onChange={handleChange} placeholder="Position" className="border px-3 py-2 rounded" />
            <select name="status" value={form.status} onChange={handleChange} className="border px-3 py-2 rounded">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div>
            <label className="text-sm block mb-1">Upload Image</label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 border">
                {preview ? <img src={preview} alt="preview" className="w-full h-full object-cover" /> : <div className="text-xs p-2 text-gray-500">N/A</div>}
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="emp-file" className="px-3 py-1 border rounded cursor-pointer text-sm">Choose from gallery</label>
                <input id="emp-file" type="file" accept="image/*" onChange={handleFile} className="hidden" />
                <button type="button" onClick={() => { setFile(null); setPreview(employee?.imageUrl ?? designPreview); }} className="text-sm text-gray-500 underline">Reset</button>
              </div>
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-accent text-white rounded">{saving ? "Saving..." : (employee ? "Edit Employee" : "Add Employee")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
