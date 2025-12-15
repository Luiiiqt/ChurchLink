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

  const [formErrors, setFormErrors] = useState({}); // store backend validation errors
  const inputRefs = useRef({}); // refs to inputs for focusing
  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: null }); // clear error for this field on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
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
      // Reset form on success
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
      setEditing(false);
      setShowModal(false);
      fetchMembers();
    } catch (err) {
      if (err.errors) {
        setFormErrors(err.errors);

        // Focus the first field with an error
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

  const handleEdit = (member) => {
    setForm({
      memberId: member.memberId,
      firstName: member.firstName,
      middleName: member.middleName,
      lastName: member.lastName,
      dob: member.dob,
      gender: member.gender,
      address: member.address,
      ministryId: member.ministryId,
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

  const filteredMembers = members.filter(
    (m) =>
      m.firstName.toLowerCase().includes(search.toLowerCase()) ||
      m.middleName?.toLowerCase().includes(search.toLowerCase()) ||
      m.lastName.toLowerCase().includes(search.toLowerCase()) ||
      m.address?.toLowerCase().includes(search.toLowerCase()) ||
      m.gender?.toLowerCase().includes(search.toLowerCase()) ||
      (ministries.find((min) => min.ministryId === m.ministryId)?.ministryName || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Members</h1>

      <input
        type="text"
        placeholder="Search members..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      <div className="mb-4">
        <button
          className="mr-2 mb-2 px-3 py-1 bg-green-600 text-white rounded"
          onClick={() => {
            setEditing(false);
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
            setShowModal(true);
          }}
        >
          Add Member
        </button>
      </div>

      {loading ? (
        <p>Loading members...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredMembers.length === 0 ? (
        <p>No members found</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">First Name</th>
              <th className="border px-2 py-1">Middle Name</th>
              <th className="border px-2 py-1">Last Name</th>
              <th className="border px-2 py-1">DOB</th>
              <th className="border px-2 py-1">Gender</th>
              <th className="border px-2 py-1">Address</th>
              <th className="border px-2 py-1">Ministry</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.memberId} className="hover:bg-gray-100">
                <td className="border px-2 py-1">{member.firstName}</td>
                <td className="border px-2 py-1">{member.middleName}</td>
                <td className="border px-2 py-1">{member.lastName}</td>
                <td className="border px-2 py-1">{member.dob}</td>
                <td className="border px-2 py-1">{member.gender}</td>
                <td className="border px-2 py-1">{member.address}</td>
                <td className="border px-2 py-1">
                  {ministries.find((min) => min.ministryId === member.ministryId)?.ministryName || "N/A"}
                </td>
                <td className="border px-2 py-1 space-x-2">
                  <button
                    className="px-2 py-1 bg-yellow-400 rounded"
                    onClick={() => handleEdit(member)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(member.memberId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-lg"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {editing ? "Edit Member" : "Add Member"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-2">
              {["firstName", "middleName", "lastName", "dob", "gender", "address", "ministryId"].map((field) => (
                <div key={field}>
                  {field === "gender" ? (
                    <select
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      ref={(el) => (inputRefs.current[field] = el)}
                      className="border p-2 rounded w-full"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : field === "dob" ? (
                    <input
                      type="date"
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      ref={(el) => (inputRefs.current[field] = el)}
                      className="border p-2 rounded w-full"
                    />
                  ) : field === "ministryId" ? (
                    <select
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      ref={(el) => (inputRefs.current[field] = el)}
                      className="border p-2 rounded w-full"
                    >
                      <option value="">Select Ministry</option>
                      {ministries.map((m) => (
                        <option key={m.ministryId} value={m.ministryId}>
                          {m.ministryName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={field}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={form[field]}
                      onChange={handleChange}
                      ref={(el) => (inputRefs.current[field] = el)}
                      className="border p-2 rounded w-full"
                    />
                  )}
                  {formErrors[field] && (
                    <p className="text-red-500 text-sm mt-1">{formErrors[field]}</p>
                  )}
                </div>
              ))}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  {editing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
