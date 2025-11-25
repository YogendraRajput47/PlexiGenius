import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";


export default function LeadModal({ lead = null, onClose, onSave }) {
  const fallbackDesignImage = "/mnt/data/Screenshot 2025-11-24 160318.png";

  const [form, setForm] = useState({
    company: "",
    email: "",
    phone: "",
    tags: "",
    status: "New",
    assignedTo: "",
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [employees, setEmployees] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (lead) {
      setForm({
        company: lead.company || "",
        email: lead.email || "",
        phone: lead.phone || "",
        tags: Array.isArray(lead.tags) ? lead.tags.join(", ") : lead.tags || "",
        status: lead.status || "New",
        assignedTo: lead.assignedTo?._id ?? "",
      });
      setPreviewUrl(lead.imageUrl || fallbackDesignImage);
    } else {
      setForm({
        company: "",
        email: "",
        phone: "",
        tags: "",
        status: "New",
        assignedTo: "",
      });
      setPreviewUrl(fallbackDesignImage);
      setFile(null);
    }
  }, [lead]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/employees");
        const data = res.data?.data ?? res.data ?? [];
        if (mounted) setEmployees(data);
      } catch (err) {
        console.error("Failed to load employees", err);
      }
    })();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    setTimeout(() => firstInputRef.current?.focus?.(), 60);
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(lead?.imageUrl || fallbackDesignImage);
    }
  };

  const handleBackgroundClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const validate = () => {
    if (!form.company || form.company.trim() === "") {
      setError("Company is required.");
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
        fd.append("company", form.company);
        fd.append("email", form.email);
        fd.append("phone", form.phone);
        fd.append("tags", form.tags); 
        fd.append("status", form.status);
        if (form.assignedTo) fd.append("assignedTo", form.assignedTo);
        fd.append("image", file);

        if (lead && lead._id) {
          await onSave(fd, true); 
        } else {
          await onSave(fd, false);
        }
      } else {
        const payload = {
          company: form.company,
          email: form.email || undefined,
          phone: form.phone || undefined,
          tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
          status: form.status,
          assignedTo: form.assignedTo || undefined,
        };

        if (lead && lead._id) {
          payload._id = lead._id;
          await onSave(payload, true);
        } else {
          await onSave(payload, false);
        }
      }

      onClose();
    } catch (err) {
      console.error("Save lead failed:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to save lead";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onMouseDown={handleBackgroundClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white w-[92%] md:w-3/4 lg:w-2/3 max-w-3xl rounded-2xl shadow-2xl p-6"
           onMouseDown={e => e.stopPropagation()}>
        <h3 className="text-2xl font-semibold mb-4">{lead ? "Edit Lead" : "Add Lead"}</h3>

        <form onSubmit={submit} className="space-y-4">
          {/* Company  */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Company</label>
            <input
              ref={firstInputRef}
              name="company"
              value={form.company}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Company name"
            />
          </div>

          {/* Email / Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Email address"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="+91 99999 99999"
              />
            </div>
          </div>

          {/* Upload image */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Upload Image</label>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-md bg-gray-100 overflow-hidden border">
                {previewUrl ? (
                  <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No</div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="lead-image"
                    className="text-sm bg-white border border-gray-300 px-3 py-1 rounded cursor-pointer"
                  >
                    Choose from gallery
                  </label>
                  <input
                    id="lead-image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => { setFile(null); setPreviewUrl(lead?.imageUrl || fallbackDesignImage); }}
                    className="text-sm text-gray-500 underline"
                  >
                    Reset
                  </button>
                </div>
                <div className="text-xs text-gray-400 mt-2">Supported: PNG, JPG. Use small images for faster upload.</div>
              </div>
            </div>
          </div>

          {/* Tag */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Position</label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="comma separated"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option>New</option>
                <option>Followup</option>
                <option>Contacted</option>
              </select>
            </div>
          </div>

          {/* Employee */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">No of leads</label>
            <select
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Unassigned</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name}</option>
              ))}
            </select>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="mt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-accent text-white py-3 rounded-lg text-sm font-medium hover:opacity-95 disabled:opacity-60"
            >
              {saving ? (lead ? "Updating..." : "Adding...") : (lead ? "Edit Lead" : "Add Lead")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
