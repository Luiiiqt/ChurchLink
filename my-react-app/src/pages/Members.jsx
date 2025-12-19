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
  const [roleFilter, setRoleFilter] = useState("");

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
    .filter(m => (roleFilter ? m.role === roleFilter : true))
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

  useEffect(() => setCurrentPage(1), [showArchived, search, statusFilter, roleFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold">{showArchived ? "Archived Members" : "Members"}</h1>
                    <p className="text-emerald-100 text-lg mt-1">Manage church members and their information</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowArchived(!showArchived)} 
                    className="px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    {showArchived ? "View Active" : "View Archived"}
                  </button>
                  {!showArchived && (
                    <button 
                      onClick={() => { resetForm(); setEditing(false); setShowModal(true); }} 
                      className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Member
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                  <span className="text-emerald-100 text-sm">Total Members</span>
                  <div className="text-2xl font-bold">{members.filter(m => !m.archived).length}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                  <span className="text-emerald-100 text-sm">Archived</span>
                  <div className="text-2xl font-bold">{members.filter(m => m.archived).length}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                  <span className="text-emerald-100 text-sm">Displayed</span>
                  <div className="text-2xl font-bold">{displayedMembers.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-emerald-100/50">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            Filter Members
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              className="p-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="DECEASED">Deceased</option>
            </select>
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)} 
              className="p-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            >
              <option value="">All Roles</option>
              {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-lg mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-700 font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Members Table */}
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-100/50 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              Members List
            </h2>

            {loading ? (
              <div className="text-center py-16">
                <div className="relative inline-block">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-emerald-200 border-t-emerald-600 mb-4"></div>
                  <div className="absolute inset-0 inline-block animate-ping rounded-full h-16 w-16 border-4 border-emerald-300 opacity-20"></div>
                </div>
                <p className="text-gray-700 text-xl font-semibold animate-pulse">Loading members...</p>
              </div>
            ) : currentMembers.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg font-medium">No members found</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-emerald-50 to-teal-50">
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b border-gray-200">Full Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b border-gray-200">DOB</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b border-gray-200">Gender</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b border-gray-200">Address</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b border-gray-200">Ministry</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b border-gray-200">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b border-gray-200">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b border-gray-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMembers.map((m, index) => (
                      <tr key={m.memberId} className={`transition-colors hover:bg-emerald-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        <td className="px-6 py-4 border-b border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              {m.firstName.charAt(0)}{m.lastName.charAt(0)}
                            </div>
                            <span className="font-semibold text-gray-800">{`${m.firstName} ${m.middleName || ""} ${m.lastName}`}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700 border-b border-gray-200">
                          {m.dob ? new Date(m.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            m.gender === 'Male' ? 'bg-blue-100 text-blue-700' :
                            m.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {m.gender || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700 border-b border-gray-200">{m.address}</td>
                        <td className="px-6 py-4 text-gray-700 border-b border-gray-200">
                          {ministries.find(min => min.ministryId === m.ministryId)?.ministryName || "N/A"}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            m.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                            m.status === 'INACTIVE' ? 'bg-gray-100 text-gray-700' :
                            m.status === 'DECEASED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {m.status || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            m.role === 'LEADER' ? 'bg-emerald-100 text-emerald-700' :
                            m.role === 'ASSISTANT' ? 'bg-teal-100 text-teal-700' :
                            m.role === 'MEMBER' ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {m.role || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 border-b border-gray-200">
                          <div className="flex gap-2">
                            {showArchived ? (
                              <>
                                <button 
                                  onClick={() => handleRecover(m.memberId)} 
                                  className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                  Recover
                                </button>
                                <button 
                                  onClick={() => handleDelete(m.memberId)} 
                                  className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => handleEdit(m)} 
                                  className="px-3 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleArchive(m.memberId)} 
                                  className="px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                  </svg>
                                  Archive
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
            <button 
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
              disabled={currentPage === 1} 
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                currentPage === 1 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-emerald-50 border-2 border-gray-200 hover:border-emerald-300'
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page} 
                onClick={() => setCurrentPage(page)} 
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                  currentPage === page 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-emerald-50 border-2 border-gray-200 hover:border-emerald-300'
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
              disabled={currentPage === totalPages} 
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                currentPage === totalPages 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-emerald-50 border-2 border-gray-200 hover:border-emerald-300'
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 rounded-t-3xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    {editing ? "Edit Member" : "Add New Member"}
                  </h2>
                  <button 
                    onClick={() => { setShowModal(false); setEditing(false); resetForm(); }} 
                    className="text-white hover:bg-white/20 rounded-xl p-2 transition-all duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      ref={el => inputRefs.current.firstName = el}
                      className={`w-full p-3 border-2 rounded-xl transition-all ${
                        formErrors.firstName 
                          ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                    />
                    {formErrors.firstName && <p className="text-red-600 text-sm mt-1 font-semibold">{formErrors.firstName}</p>}
                  </div>

                  {/* Middle Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      value={form.middleName}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      ref={el => inputRefs.current.lastName = el}
                      className={`w-full p-3 border-2 rounded-xl transition-all ${
                        formErrors.lastName 
                          ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                    />
                    {formErrors.lastName && <p className="text-red-600 text-sm mt-1 font-semibold">{formErrors.lastName}</p>}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                      ref={el => inputRefs.current.dob = el}
                      className={`w-full p-3 border-2 rounded-xl transition-all ${
                        formErrors.dob 
                          ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                    />
                    {formErrors.dob && <p className="text-red-600 text-sm mt-1 font-semibold">{formErrors.dob}</p>}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      ref={el => inputRefs.current.gender = el}
                      className={`w-full p-3 border-2 rounded-xl transition-all ${
                        formErrors.gender 
                          ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {formErrors.gender && <p className="text-red-600 text-sm mt-1 font-semibold">{formErrors.gender}</p>}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      ref={el => inputRefs.current.address = el}
                      className={`w-full p-3 border-2 rounded-xl transition-all ${
                        formErrors.address 
                          ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                    />
                    {formErrors.address && <p className="text-red-600 text-sm mt-1 font-semibold">{formErrors.address}</p>}
                  </div>

                  {/* Ministry */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Ministry <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="ministryId"
                      value={form.ministryId}
                      onChange={handleChange}
                      ref={el => inputRefs.current.ministryId = el}
                      className={`w-full p-3 border-2 rounded-xl transition-all ${
                        formErrors.ministryId 
                          ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                    >
                      <option value="">Select Ministry</option>
                      {ministries.filter(m => !m.archived).map(m => (
                        <option key={m.ministryId} value={m.ministryId}>{m.ministryName}</option>
                      ))}
                    </select>
                    {formErrors.ministryId && <p className="text-red-600 text-sm mt-1 font-semibold">{formErrors.ministryId}</p>}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      ref={el => inputRefs.current.status = el}
                      className={`w-full p-3 border-2 rounded-xl transition-all ${
                        formErrors.status 
                          ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="DECEASED">Deceased</option>
                    </select>
                    {formErrors.status && <p className="text-red-600 text-sm mt-1 font-semibold">{formErrors.status}</p>}
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    >
                      <option value="">Select Role (Optional)</option>
                      {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setEditing(false); resetForm(); }}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200"
                  >
                    {editing ? "Update Member" : "Add Member"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}