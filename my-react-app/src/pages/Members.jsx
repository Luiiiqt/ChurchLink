import { useEffect, useState } from "react";
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
  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchMinistries = async () => {
    try {
      const data = await authFetch("/ministries", {}, token);
      setMinistries(data || []);
    } catch (err) {
      console.error(err);
      setError("Cannot load ministries");
    }
  };

  const fetchMembers = async (ministryId = "") => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = ministryId ? `/members?ministryId=${ministryId}` : "/members";
      const data = await authFetch(endpoint, {}, token);
      setMembers(data || []);
    } catch (err) {
      console.error(err);
      setError("Cannot load members");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistries();
    fetchMembers();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await authFetch(`/members/${form.memberId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        }, token);
      } else {
        await authFetch("/members", { method: "POST", body: JSON.stringify(form) }, token);
      }
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
      console.error(err);
      setError("Failed to save member");
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
      m.lastName.toLowerCase().includes(search.toLowerCase()) ||
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
        <h2 className="font-semibold">Filter by Ministry</h2>
        {ministries.map((m) => (
          <button
            key={m.ministryId}
            className="mr-2 mb-2 px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => fetchMembers(m.ministryId)}
          >
            {m.ministryName}
          </button>
        ))}
        <button
          className="mr-2 mb-2 px-3 py-1 bg-gray-500 text-white rounded"
          onClick={() => fetchMembers()}
        >
          All
        </button>
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
        <ul className="space-y-2">
          {filteredMembers.map((member) => (
            <li
              key={member.memberId}
              className="p-2 border rounded flex justify-between items-center"
            >
              <div>
                {member.firstName} {member.lastName} -{" "}
                {ministries.find((min) => min.ministryId === member.ministryId)
                  ?.ministryName || "No ministry"}
              </div>
              <div className="space-x-2">
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
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editing ? "Edit Member" : "Add Member"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="middleName"
                placeholder="Middle Name"
                value={form.middleName}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              />
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              />
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                className="border p-2 rounded w-full"
              />
              <select
                name="ministryId"
                value={form.ministryId}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Ministry</option>
                {ministries.map((m) => (
                  <option key={m.ministryId} value={m.ministryId}>
                    {m.ministryName}
                  </option>
                ))}
              </select>
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
