import { useEffect, useState, useRef } from "react";
import { authFetch } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Members() {
  const { token } = useAuth();

  const [members, setMembers] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); // new role filter

  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 10;

  const roleOptions = ["LEADER", "MEMBER", "ASSISTANT"];

  const [form, setForm] = useState({
    memberId: null,
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    address: "",
    ministryId: "",
    status: "ACTIVE",
    role: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const inputRefs = useRef({});

  // Fetch members
  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authFetch("/members", {}, token);
      setMembers(Array.isArray(data) ? data : []);
    } catch {
      setError("Cannot load members");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch ministries
  const fetchMinistries = async () => {
    try {
      const data = await authFetch("/ministries", {}, token);
      setMinistries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMinistries();
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: null });
  };

  const resetForm = () => {
    setForm({
      memberId: null,
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      gender: "",
      address: "",
      ministryId: "",
      status: "ACTIVE",
      role: "",
    });
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.lastName.trim()) errors.lastName = "Last name is required";
    if (!form.dob.trim()) errors.dob = "Date of birth is required";
    if (!form.gender.trim()) errors.gender = "Gender is required";
    if (!form.address.trim()) errors.address = "Address is required";
    if (!form.ministryId) errors.ministryId = "Ministry is required";
    if (!form.status) errors.status = "Status is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      inputRefs.current[Object.keys(errors)[0]]?.focus();
      return;
    }

    try {
      if (editing) {
        await authFetch(`/members/${form.memberId}`, { method: "PUT", body: JSON.stringify(form) }, token);
      } else {
        await authFetch("/members", { method: "POST", body: JSON.stringify(form) }, token);
      }
      setShowModal(false);
      setEditing(false);
      resetForm();
      fetchMembers();
      setCurrentPage(1);
    } catch {
      setError("Failed to save member");
    }
  };

  const handleEdit = (member) => {
    setForm({
      ...member,
      ministryId: member.ministryId || "",
      status: member.status || "ACTIVE",
      role: member.role || "",
    });
    setEditing(true);
    setShowModal(true);
  };

  const handleArchive = async (id) => {
    if (!window.confirm("Archive this member?")) return;
    try {
      await authFetch(`/members/${id}/archive`, { method: "PUT" }, token);
      fetchMembers();
    } catch {
      setError("Failed to archive member");
    }
  };

  const handleRecover = async (id) => {
    if (!window.confirm("Recover this member?")) return;
    try {
      await authFetch(`/members/${id}/recover`, { method: "PUT" }, token);
      fetchMembers();
    } catch {
      setError("Failed to recover member");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete permanently?")) return;
    try {
      await authFetch(`/members/${id}`, { method: "DELETE" }, token);
      fetchMembers();
    } catch {
      setError("Failed to delete member");
    }
  };

  // Filtered members
  const displayedMembers = members
    .filter(m => showArchived ? m.archived : !m.archived)
    .filter(m => (statusFilter ? m.status === statusFilter : true))
    .filter(m => (roleFilter ? m.role === roleFilter : true)) // new role filter
    .filter(m => {
      const text = search.toLowerCase();
      const ministryName = ministries.find(x => x.ministryId === m.ministryId)?.ministryName || "";
      return (
        m.firstName.toLowerCase().includes(text) ||
        m.middleName?.toLowerCase().includes(text) ||
        m.lastName.toLowerCase().includes(text) ||
        m.address?.toLowerCase().includes(text) ||
        m.gender?.toLowerCase().includes(text) ||
        ministryName.toLowerCase().includes(text) ||
        (m.role?.toLowerCase().includes(text))
      );
    });

  const totalPages = Math.ceil(displayedMembers.length / membersPerPage);
  const currentMembers = displayedMembers.slice((currentPage - 1) * membersPerPage, currentPage * membersPerPage);

  useEffect(() => setCurrentPage(1), [showArchived, search, statusFilter, roleFilter]); // include roleFilter

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{showArchived ? "Archived Members" : "Members"}</h1>
          <div className="flex gap-3">
            <button onClick={() => setShowArchived(!showArchived)} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              {showArchived ? "View Active" : "View Archived"}
            </button>
            {!showArchived && (
              <button onClick={() => { resetForm(); setEditing(false); setShowModal(true); }} className="px-4 py-2 bg-green-500 text-white rounded-lg">
                Add Member
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded-lg flex-1"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded-lg">
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="DECEASED">Deceased</option>
          </select>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="p-2 border rounded-lg">
            <option value="">All Roles</option>
            {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Error */}
        {error && <div className="p-2 bg-red-100 text-red-700 mb-4">{error}</div>}

        {/* Members Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : currentMembers.length === 0 ? (
            <div className="p-6 text-center">No members found.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-2 text-left text-xs font-semibold">Full Name</th>
                  <th className="px-6 py-2 text-left text-xs font-semibold">DOB</th>
                  <th className="px-6 py-2 text-left text-xs font-semibold">Gender</th>
                  <th className="px-6 py-2 text-left text-xs font-semibold">Address</th>
                  <th className="px-6 py-2 text-left text-xs font-semibold">Ministry</th>
                  <th className="px-6 py-2 text-left text-xs font-semibold">Status</th>
                  <th className="px-6 py-2 text-left text-xs font-semibold">Role</th>
                  <th className="px-6 py-2 text-left text-xs font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentMembers.map(m => (
                  <tr key={m.memberId} className="hover:bg-gray-50">
                    <td className="px-6 py-2">{`${m.firstName} ${m.middleName || ""} ${m.lastName}`}</td>
                    <td className="px-6 py-2">{m.dob}</td>
                    <td className="px-6 py-2">{m.gender}</td>
                    <td className="px-6 py-2">{m.address}</td>
                    <td className="px-6 py-2">{ministries.find(min => min.ministryId === m.ministryId)?.ministryName || "N/A"}</td>
                    <td className="px-6 py-2">{m.status || "N/A"}</td>
                    <td className="px-6 py-2">{m.role || "N/A"}</td>
                    <td className="px-6 py-2 space-x-2">
                      {showArchived ? (
                        <>
                          <button onClick={() => handleRecover(m.memberId)} className="px-2 py-1 bg-blue-500 text-white rounded">Recover</button>
                          <button onClick={() => handleDelete(m.memberId)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(m)} className="px-2 py-1 bg-yellow-400 text-white rounded">Edit</button>
                          <button onClick={() => handleArchive(m.memberId)} className="px-2 py-1 bg-orange-500 text-white rounded">Archive</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-2 py-1 border rounded">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`px-2 py-1 border rounded ${currentPage === page ? "bg-blue-500 text-white" : ""}`}>{page}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-2 py-1 border rounded">Next</button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto animate-scale-up">
              <h2 className="text-xl font-bold mb-4">{editing ? "Edit Member" : "Add Member"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} ref={el => inputRefs.current.firstName = el} className="p-2 border rounded" />
                  <input type="text" name="middleName" placeholder="Middle Name" value={form.middleName} onChange={handleChange} className="p-2 border rounded" />
                  <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} ref={el => inputRefs.current.lastName = el} className="p-2 border rounded" />
                  <input type="date" name="dob" placeholder="Date of Birth" value={form.dob} onChange={handleChange} ref={el => inputRefs.current.dob = el} className="p-2 border rounded" />
                  <select name="gender" value={form.gender} onChange={handleChange} ref={el => inputRefs.current.gender = el} className="p-2 border rounded">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} ref={el => inputRefs.current.address = el} className="p-2 border rounded" />
                  <select name="ministryId" value={form.ministryId} onChange={handleChange} ref={el => inputRefs.current.ministryId = el} className="p-2 border rounded">
                    <option value="">Select Ministry</option>
                    {ministries.map(m => <option key={m.ministryId} value={m.ministryId}>{m.ministryName}</option>)}
                  </select>
                  <select name="status" value={form.status} onChange={handleChange} className="p-2 border rounded">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="DECEASED">Deceased</option>
                  </select>
                  <select name="role" value={form.role} onChange={handleChange} className="p-2 border rounded">
                    <option value="">Select Role</option>
                    {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">{editing ? "Update" : "Add"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
