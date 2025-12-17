import { useEffect, useState, useRef } from "react";
import { authFetch } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Members() {
  const { token } = useAuth();

  const [members, setMembers] = useState([]);
  const [archivedMembers, setArchivedMembers] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
<<<<<<< HEAD
  const [statusFilter, setStatusFilter] = useState(""); // New status filter
=======
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270

  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

<<<<<<< HEAD
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 10;

  const roleOptions = ["LEADER", "MEMBER", "ASSISTANT"]; // Role dropdown options
=======
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 10;
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270

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
<<<<<<< HEAD
=======

  /* ================= FETCH ================= */
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270

  // Fetch members
  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authFetch("/members", {}, token);
<<<<<<< HEAD
      setMembers(Array.isArray(data) ? data : []);
    } catch {
=======
      // Separate active and archived members
      const active = (data || []).filter(m => !m.isArchived);
      const archived = (data || []).filter(m => m.isArchived);
      setMembers(active);
      setArchivedMembers(archived);
    } catch (err) {
      console.error(err);
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270
      setError("Cannot load members");
      setMembers([]);
      setArchivedMembers([]);
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

  /* ================= FORM ================= */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: null });
<<<<<<< HEAD
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
=======
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
=======
    setFormErrors({});
    setError(null);

    // Frontend validation
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270
    const errors = {};
    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.lastName.trim()) errors.lastName = "Last name is required";
    if (!form.dob.trim()) errors.dob = "Date of birth is required";
    if (!form.gender.trim()) errors.gender = "Gender is required";
    if (!form.address.trim()) errors.address = "Address is required";
<<<<<<< HEAD
    if (!form.ministryId) errors.ministryId = "Ministry is required";
    if (!form.status) errors.status = "Status is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      inputRefs.current[Object.keys(errors)[0]]?.focus();
=======
    if (!form.ministryId) errors.ministryId = "Ministry is required. Select a ministry";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField && inputRefs.current[firstErrorField]) {
        inputRefs.current[firstErrorField].focus();
      }
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270
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
<<<<<<< HEAD
    } catch {
      setError("Failed to save member");
=======
    } catch (err) {
      if (err.errors) {
        setFormErrors(err.errors);
        const firstErrorField = Object.keys(err.errors)[0];
        if (firstErrorField && inputRefs.current[firstErrorField]) {
          inputRefs.current[firstErrorField].focus();
        }
      } else {
        console.error(err);
        setError("Failed to save member");
      }
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270
    }
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
    });
    setFormErrors({});
  };

  const handleEdit = (member) => {
    setForm({
<<<<<<< HEAD
      ...member,
      ministryId: member.ministryId || "",
      status: member.status || "ACTIVE",
      role: member.role || "",
=======
      memberId: member.memberId,
      firstName: member.firstName,
      middleName: member.middleName || "",
      lastName: member.lastName,
      dob: member.dob,
      gender: member.gender,
      address: member.address || "",
      ministryId: member.ministryId || "",
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270
    });
    setEditing(true);
    setShowModal(true);
  };

  const handleArchive = async (id) => {
<<<<<<< HEAD
    if (!window.confirm("Archive this member?")) return;
    try {
      await authFetch(`/members/${id}/archive`, { method: "PUT" }, token);
      fetchMembers();
    } catch {
=======
    if (!window.confirm("Are you sure you want to archive this member?")) return;
    try {
      await authFetch(`/members/${id}/archive`, { method: "PUT" }, token);
      fetchMembers();
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270
      setError("Failed to archive member");
    }
  };

  const handleRecover = async (id) => {
<<<<<<< HEAD
    if (!window.confirm("Recover this member?")) return;
    try {
      await authFetch(`/members/${id}/recover`, { method: "PUT" }, token);
      fetchMembers();
    } catch {
=======
    if (!window.confirm("Are you sure you want to recover this member?")) return;
    try {
      await authFetch(`/members/${id}/recover`, { method: "PUT" }, token);
      fetchMembers();
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270
      setError("Failed to recover member");
    }
  };

  const handleDelete = async (id) => {
<<<<<<< HEAD
    if (!window.confirm("Delete permanently?")) return;
    try {
      await authFetch(`/members/${id}`, { method: "DELETE" }, token);
      fetchMembers();
    } catch {
=======
    if (!window.confirm("Are you sure you want to permanently delete this member? This action cannot be undone.")) return;
    try {
      await authFetch(`/members/${id}`, { method: "DELETE" }, token);
      fetchMembers();
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270
      setError("Failed to delete member");
    }
  };

<<<<<<< HEAD
  // Filtered members
  const displayedMembers = members
    .filter(m => showArchived ? m.archived : !m.archived)
    .filter(m => (statusFilter ? m.status === statusFilter : true))
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

  useEffect(() => setCurrentPage(1), [showArchived, search, statusFilter]);
=======
  /* ================= FILTER & PAGINATION ================= */

  const dataToDisplay = showArchived ? archivedMembers : members;

  const filteredMembers = dataToDisplay.filter((m) => {
    const text = search.toLowerCase();
    const ministryName =
      ministries.find((x) => x.ministryId === m.ministryId)?.ministryName || "";

    return (
      m.firstName.toLowerCase().includes(text) ||
      m.middleName?.toLowerCase().includes(text) ||
      m.lastName.toLowerCase().includes(text) ||
      m.address?.toLowerCase().includes(text) ||
      m.gender?.toLowerCase().includes(text) ||
      ministryName.toLowerCase().includes(text)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset to page 1 when switching between active/archived
  useEffect(() => {
    setCurrentPage(1);
  }, [showArchived]);

  /* ================= UI ================= */
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
<<<<<<< HEAD
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
        <div className="mb-4 flex gap-4">
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
=======
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {showArchived ? "Archived Members" : "Members Management"}
            </h1>
            <p className="text-gray-600 mt-1">
              {showArchived 
                ? `${archivedMembers.length} archived members` 
                : `${members.length} active members`}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className={`px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 ${
                showArchived
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                  : "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700"
              }`}
              onClick={() => setShowArchived(!showArchived)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              {showArchived ? "View Active Members" : "View Archive"}
            </button>
            {!showArchived && (
              <button
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                onClick={() => {
                  resetForm();
                  setEditing(false);
                  setShowModal(true);
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Member
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search members by name, ministry, or address..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Members Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
              <p className="text-gray-600">Loading members...</p>
            </div>
          ) : currentMembers.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 text-lg">
                {showArchived ? "No archived members found" : "No members found"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Full Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        DOB
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Gender
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Ministry
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentMembers.map((member) => (
                      <tr key={member.memberId} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {`${member.firstName} ${member.middleName || ""} ${member.lastName}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {member.dob}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {member.gender}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {member.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                            {ministries.find((min) => min.ministryId === member.ministryId)?.ministryName || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          {showArchived ? (
                            <>
                              <button
                                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                onClick={() => handleRecover(member.memberId)}
                              >
                                Recover
                              </button>
                              <button
                                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                onClick={() => handleDelete(member.memberId)}
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="px-3 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors"
                                onClick={() => handleEdit(member)}
                              >
                                Edit
                              </button>
                              <button
                                className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                onClick={() => handleArchive(member.memberId)}
                              >
                                Archive
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-semibold">{indexOfFirstMember + 1}</span> to{" "}
                      <span className="font-semibold">
                        {Math.min(indexOfLastMember, filteredMembers.length)}
                      </span>{" "}
                      of <span className="font-semibold">{filteredMembers.length}</span> members
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            currentPage === page
                              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all animate-modal overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-8 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {editing ? "Edit Member" : "Add New Member"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  type="button"
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-8 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <div className="border-b pb-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Personal Information
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      ref={(el) => (inputRefs.current.firstName = el)}
                      className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Enter first name"
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      name="middleName"
                      value={form.middleName}
                      onChange={handleChange}
                      ref={(el) => (inputRefs.current.middleName = el)}
                      className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Enter middle name (optional)"
                    />
                    {formErrors.middleName && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.middleName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      ref={(el) => (inputRefs.current.lastName = el)}
                      className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Enter last name"
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        ref={(el) => (inputRefs.current.dob = el)}
                        className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                      {formErrors.dob && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.dob}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        ref={(el) => (inputRefs.current.gender = el)}
                        className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {formErrors.gender && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.gender}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact & Ministry Section */}
                <div className="space-y-6">
                  <div className="border-b pb-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Contact & Ministry
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      ref={(el) => (inputRefs.current.address = el)}
                      rows="3"
                      className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                      placeholder="Enter full address"
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ministry *
                    </label>
                    <select
                      name="ministryId"
                      value={form.ministryId || ""}
                      onChange={handleChange}
                      ref={(el) => (inputRefs.current.ministryId = el)}
                      className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select Ministry</option>
                      {ministries.map((m) => (
                        <option key={m.ministryId} value={m.ministryId}>
                          {m.ministryName}
                        </option>
                      ))}
                    </select>
                    {formErrors.ministryId && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.ministryId}</p>
                    )}
                  </div>

                  {/* Info Box */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-emerald-800">
                        <p className="font-semibold mb-1">Required Fields</p>
                        <p>Please ensure all fields marked with * are filled out correctly.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                <button
                  type="button"
                  className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
                  onClick={() => setShowModal(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
                  onClick={handleSubmit}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {editing ? "Update Member" : "Add Member"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes modal {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modal {
          animation: modal 0.2s ease-out;
        }
      `}</style>
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270
    </div>
  );
}