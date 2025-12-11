import React, { useEffect, useState } from "react";
import { authFetch } from "../utils/api";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [form, setForm] = useState({
    activityId: null,
    activity: "",
    date: "",
    time: "",
    place: "",
    ministryId: "",
  });
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch ministries
  const fetchMinistries = async () => {
    try {
      const data = await authFetch("/ministries");
      setMinistries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load ministries");
    }
  };

  // Fetch activities
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await authFetch("/activities");
      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistries();
    fetchActivities();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await authFetch(`/activities/${form.activityId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await authFetch("/activities", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      // Reset form
      setForm({ activityId: null, activity: "", date: "", time: "", place: "", ministryId: "" });
      setEditing(false);
      fetchActivities();
    } catch (err) {
      console.error(err);
      setError("Failed to save activity");
    }
  };

  const handleEdit = (act) => {
    setForm({
      activityId: act.activityId,
      activity: act.activity,
      date: act.date,
      time: act.time,
      place: act.place,
      ministryId: act.ministry?.ministryId || "",
    });
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this activity?")) return;
    try {
      await authFetch(`/activities/${id}`, { method: "DELETE" });
      fetchActivities();
    } catch (err) {
      console.error(err);
      setError("Failed to delete activity");
    }
  };

  const filteredActivities = Array.isArray(activities)
    ? activities.filter((a) =>
        a.activity.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Activities</h1>

      <input
        type="text"
        placeholder="Search activities..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Add/Edit Form */}
      <div className="mb-6 p-4 border rounded shadow">
        <h2 className="font-semibold mb-2">{editing ? "Edit Activity" : "Add Activity"}</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            name="activity"
            value={form.activity}
            onChange={handleChange}
            placeholder="Activity Name"
            required
            className="border p-1 rounded w-full"
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="border p-1 rounded w-full"
          />
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            className="border p-1 rounded w-full"
          />
          <input
            type="text"
            name="place"
            value={form.place}
            onChange={handleChange}
            placeholder="Place"
            className="border p-1 rounded w-full"
          />
          <select
            name="ministryId"
            value={form.ministryId}
            onChange={handleChange}
            className="border p-1 rounded w-full"
          >
            <option value="">Select Ministry</option>
            {ministries.map((m) => (
              <option key={m.ministryId} value={m.ministryId}>
                {m.ministry}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            {editing ? "Update" : "Add"}
          </button>
        </form>
      </div>

      {/* Activities List */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredActivities.length === 0 ? (
        <p>No activities found</p>
      ) : (
        <ul className="space-y-2">
          {filteredActivities.map((act) => (
            <li
              key={act.activityId}
              className="p-2 border rounded flex justify-between items-center"
            >
              <div>
                {act.activity} - {act.date} {act.time} (
                {act.ministry?.ministry || "No ministry"})
              </div>
              <div className="space-x-2">
                <button
                  className="px-2 py-1 bg-yellow-400 rounded"
                  onClick={() => handleEdit(act)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(act.activityId)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
