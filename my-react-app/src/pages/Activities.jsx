import { useEffect, useState } from "react";
import { authFetch } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Activities() {
  const { token } = useAuth();
  const [activities, setActivities] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    activityId: null,
    activity: "",
    date: "",
    time: "",
    place: "",
    ministryId: null,
  });
  const [editing, setEditing] = useState(false);
  const [rescheduleId, setRescheduleId] = useState(null);

  const normalizeMinistries = (data) =>
    (data || []).map((m) => ({
      ministryId: m.ministry_id ?? m.ministryId,
      ministryName: m.ministry ?? m.ministryName,
    }));

  useEffect(() => {
    fetchMinistries();
    fetchActivities();
  }, []);

  const fetchMinistries = async () => {
    try {
      const data = await authFetch("/ministries", {}, token);
      setMinistries(normalizeMinistries(data));
    } catch {
      setError("Failed to load ministries");
    }
  };

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await authFetch("/activities", {}, token);
      setActivities(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (act = null, type = "add") => {
    if (act) {
      setForm({
        activityId: act.activityId,
        activity: act.activity || "",
        date: act.date || "",
        time: act.time || "",
        place: act.place || "",
        ministryId: act.ministryId ?? null,
      });
      setEditing(type === "edit");
      setRescheduleId(type === "reschedule" ? act.activityId : null);
    } else {
      setForm({
        activityId: null,
        activity: "",
        date: "",
        time: "",
        place: "",
        ministryId: null,
      });
      setEditing(false);
      setRescheduleId(null);
    }
    setError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(false);
    setRescheduleId(null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return setError("You must be logged in");
    if (!form.activity) return setError("Activity name is required");
    if (!form.date) return setError("Date is required");
    if (!form.time) return setError("Time is required");
    if (!form.place) return setError("Place is required");
    if (!form.ministryId) return setError("Ministry is required");

    const payload = {
      activity: form.activity,
      ministryId: Number(form.ministryId),
      date: form.date,
      time: form.time,
      place: form.place,
    };

    try {
      if (editing) {
        await authFetch(`/activities/${form.activityId}`, { method: "PUT", body: JSON.stringify(payload) }, token);
      } else if (rescheduleId) {
        await authFetch(`/activities/${rescheduleId}/reschedule`, { method: "PUT", body: JSON.stringify({ date: form.date, time: form.time }) }, token);
      } else {
        await authFetch("/activities", { method: "POST", body: JSON.stringify(payload) }, token);
      }
      fetchActivities();
      closeModal();
    } catch (err) {
      setError(err.message || "Failed to save activity");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this activity?")) return;
    try {
      await authFetch(`/activities/${id}`, { method: "DELETE" }, token);
      fetchActivities();
    } catch {
      setError("Failed to delete activity");
    }
  };

  const getMinistryName = (ministryId) => {
    if (!ministryId) return "Unknown";
    const m = ministries.find((m) => m.ministryId === Number(ministryId));
    return m ? m.ministryName : "Unknown";
  };

  const scheduled = activities.filter((a) => a.status === "SCHEDULED");
  const rescheduled = activities.filter((a) => a.status === "RESCHEDULED");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Activities</h1>
      <button onClick={() => openModal()} className="mb-4 px-4 py-2 bg-green-600 text-white rounded">Add Activity</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2 className="font-semibold mb-2">Scheduled</h2>
          {scheduled.length ? scheduled.map((a) => (
            <div key={a.activityId} className="flex justify-between p-2 border rounded mb-1">
              <div>{`${a.activity} (${getMinistryName(a.ministryId)}) - ${a.date} ${a.time}`}</div>
              <div className="space-x-2">
                {!rescheduleId && (
                  <>
                    <button onClick={() => openModal(a, "edit")} className="px-2 py-1 bg-yellow-400 rounded">Edit</button>
                    <button onClick={() => handleDelete(a.activityId)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                    <button onClick={() => openModal(a, "reschedule")} className="px-2 py-1 bg-blue-500 text-white rounded">Reschedule</button>
                  </>
                )}
              </div>
            </div>
          )) : <p>No scheduled activities</p>}

          <h2 className="font-semibold mt-4 mb-2">Rescheduled</h2>
          {rescheduled.length ? rescheduled.map((a) => (
            <div key={a.activityId} className="flex justify-between p-2 border rounded mb-1">
              <div>{`${a.activity} (${getMinistryName(a.ministryId)}) - ${a.date} ${a.time}`}</div>
              <div className="space-x-2">
                {!rescheduleId && (
                  <>
                    <button onClick={() => openModal(a, "edit")} className="px-2 py-1 bg-yellow-400 rounded">Edit</button>
                    <button onClick={() => handleDelete(a.activityId)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                    <button onClick={() => openModal(a, "reschedule")} className="px-2 py-1 bg-blue-500 text-white rounded">Reschedule</button>
                  </>
                )}
              </div>
            </div>
          )) : <p>No rescheduled activities</p>}
        </>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 text-lg">&times;</button>

            <h2 className="text-xl font-semibold mb-4">
              {rescheduleId ? "Reschedule Activity" : editing ? "Edit Activity" : "Add Activity"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="activity" value={form.activity} onChange={handleChange} placeholder="Activity Name" required className="border p-2 rounded w-full" />
              <select name="ministryId" value={form.ministryId || ""} onChange={handleChange} required className="border p-2 rounded w-full">
                <option value="">Select Ministry</option>
                {ministries.map((m) => <option key={m.ministryId} value={m.ministryId}>{m.ministryName}</option>)}
              </select>
              <input type="text" name="place" value={form.place} onChange={handleChange} placeholder="Place" className="border p-2 rounded w-full" required />
              <input type="date" name="date" value={form.date} onChange={handleChange} className="border p-2 rounded w-full" required />
              <input type="time" name="time" value={form.time} onChange={handleChange} className="border p-2 rounded w-full" required />
              <button className="px-4 py-2 bg-green-600 text-white rounded w-full">Save</button>
              {error && <p className="text-red-500">{error}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
