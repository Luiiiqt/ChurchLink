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
  const [selectedMinistry, setSelectedMinistry] = useState(null);

  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    memberId: null,
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    address: "",
    ministryId: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const inputRefs = useRef({});

  /* ================= FETCH ================= */

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authFetch("/members", {}, token);
      setMembers(data || []);
    } catch (err) {
      console.error(err);
      setError("Cannot load members");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMinistries = async () => {
    try {
      const data = await authFetch("/ministries", {}, token);
      setMinistries(data || []);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setError(null);

    // Frontend validation
    const errors = {};
    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.lastName.trim()) errors.lastName = "Last name is required";
    if (!form.dob.trim()) errors.dob = "Date of birth is required";
    if (!form.gender.trim()) errors.gender = "Gender is required";
    if (!form.address.trim()) errors.address = "Address is required";
    if (!form.ministryId) errors.ministryId = "Ministry is required. Select a ministry";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField && inputRefs.current[firstErrorField]) {
        inputRefs.current[firstErrorField].focus();
      }
      return;
    }

    try {
      if (editing) {
        await authFetch(
          `/members/${form.memberId}`,
          { method: "PUT", body: JSON.stringify(form) },
          token
        );
      } else {
        await authFetch("/members", { method: "POST", body: JSON.stringify(form) }, token);
      }

      setShowModal(false);
      setEditing(false);
      resetForm();
      fetchMembers();
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
      memberId: member.memberId,
      firstName: member.firstName,
      middleName: member.middleName || "",
      lastName: member.lastName,
      dob: member.dob,
      gender: member.gender,
      address: member.address || "",
      ministryId: member.ministryId || "",
    });
    setFormErrors({});
    setEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await authFetch(`/members/${id}`, { method: "DELETE" }, token);
      fetchMembers();
    } catch (err) {
      console.error(err);
      setError("Failed to delete member");
    }
  };

  /* ================= FILTER ================= */

  const filteredMembers = members.filter((m) => {
    const text = search.toLowerCase();
    const ministryName =
      ministries.find((x) => x.ministryId === m.ministryId)?.ministryName || "";

    const matchesSearch =
      m.firstName.toLowerCase().includes(text) ||
      m.middleName?.toLowerCase().includes(text) ||
      m.lastName.toLowerCase().includes(text) ||
      m.address?.toLowerCase().includes(text) ||
      m.gender?.toLowerCase().includes(text) ||
      ministryName.toLowerCase().includes(text);

    const matchesMinistry = selectedMinistry
      ? String(m.ministryId) === String(selectedMinistry)
      : true;

    return matchesSearch && matchesMinistry;
  });

  const ministryColors = [
    { bg: "bg-emerald-500", hover: "hover:bg-emerald-600", ring: "ring-emerald-500" },
    { bg: "bg-green-500", hover: "hover:bg-green-600", ring: "ring-green-500" },
    { bg: "bg-teal-500", hover: "hover:bg-teal-600", ring: "ring-teal-500" },
    { bg: "bg-lime-500", hover: "hover:bg-lime-600", ring: "ring-lime-500" },
    { bg: "bg-cyan-500", hover: "hover:bg-cyan-600", ring: "ring-cyan-500" },
  ];

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Members Management
          </h1>
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
        </div>

        {/* Ministry Filter Cards */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button
            className={`p-4 rounded-xl shadow-md transition-all duration-200 ${
              selectedMinistry === null
                ? "bg-gradient-to-br from-gray-600 to-gray-700 text-white ring-2 ring-gray-600 ring-offset-2"
                : "bg-white hover:shadow-lg"
            }`}
            onClick={() => setSelectedMinistry(null)}
          >
            <div className="text-center">
              <div className={`text-lg font-bold ${selectedMinistry === null ? "text-white" : "text-gray-800"}`}>
                All Members
              </div>
            </div>
          </button>

          {ministries.map((ministry, index) => {
            const color = ministryColors[index % ministryColors.length];
            const isSelected = String(selectedMinistry) === String(ministry.ministryId);
            return (
              <button
                key={ministry.ministryId}
                className={`p-4 rounded-xl shadow-md transition-all duration-200 ${
                  isSelected
                    ? `${color.bg} text-white ring-2 ${color.ring} ring-offset-2`
                    : `bg-white ${color.hover}`
                }`}
                onClick={() => setSelectedMinistry(ministry.ministryId)}
              >
                <div className="text-center">
                  <div className={`text-lg font-bold ${isSelected ? "text-white" : "text-gray-800"}`}>
                    {ministry.ministryName}
                  </div>
                </div>
              </button>
            );
          })}
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
              onChange={(e) => setSearch(e.target.value)}
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
          ) : filteredMembers.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 text-lg">No members found</p>
            </div>
          ) : (
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
                  {filteredMembers.map((member) => (
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
                        <button
                          className="px-3 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors"
                          onClick={() => handleEdit(member)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          onClick={() => handleDelete(member.memberId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
    </div>
  );
}