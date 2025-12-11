import React, { useEffect, useState } from "react";
import { authFetch } from "../utils/api";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState(""); // search state

  // Form state for add/edit
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

  // Fetch ministries
  const fetchMinistries = async () => {
    try {
      const data = await authFetch("/ministries");
      setMinistries(data);
    } catch (err) {
      console.error("Failed to fetch ministries:", err);
      setError("Cannot load ministries");
    }
  };

  // Fetch members
  const fetchMembers = async (ministryId) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = ministryId ? `/members?ministryId=${ministryId}` : "/members";
      const data = await authFetch(endpoint);
      setMembers(data || []);
    } catch (err) {
      console.error("Failed to fetch members:", err);
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

  // Handle ministry filter click
  const handleMinistryClick = (ministryId) => {
    fetchMembers(ministryId);
  };

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit (add or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await authFetch(`/members/${form.memberId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await authFetch("/members", {
          method: "POST",
          body: JSON.stringify(form),
        });
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
      console.error("Failed to save member:", err);
      setError("Failed to save member");
    }
  };

  // Handle edit click
  const handleEdit = (member) => {
    setForm({
      memberId: member.memberId,
      firstName: member.firstName,
      middleName: member.middleName,
      lastName: member.lastName,
      dob: member.dob,
      gender: member.gender,
      address: member.address,
      ministryId: member.ministry?.ministryId || "",
    });
    setEditing(true);
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await authFetch(`/members/${id}`, { method: "DELETE" });
      fetchMembers();
    } catch (err) {
      console.error("Failed to delete member:", err);
      setError("Failed to delete member");
    }
  };

  // Filter members by search
  const filteredMembers = members.filter(
    (m) =>
      m.firstName.toLowerCase().includes(search.toLowerCase()) ||
      m.lastName.toLowerCase().includes(search.toLowerCase()) ||
      (m.ministry?.ministry || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Members</h1>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Ministries filter */}
      <div className="mb-4">
        <h2 className="font-semibold">Filter by Ministry</h2>
        {ministries.map((m) => (
          <button
            key={m.ministryId}
            className="mr-2 mb-2 px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => handleMinistryClick(m.ministryId)}
          >
            {m.ministry}
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

      {/* Members list */}
      <div>
        {loading ? (
          <p>Loading members...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
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
                  {member.ministry?.ministry || "No ministry"}
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
      </div>

      {/* Modal for Add/Edit */}
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
                placeholder="Date of Birth"
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
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
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
                    {m.ministry}
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
