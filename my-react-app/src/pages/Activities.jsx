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
  const [editing, setEditing] = useState(false);
  const [rescheduleId, setRescheduleId] = useState(null);

  const [form, setForm] = useState({
    activityId: null,
    activity: "",
    date: "",
    time: "",
    place: "",
    ministryId: "",
  });

  /* =========================
     INITIAL LOAD
  ========================= */
  useEffect(() => {
    fetchMinistries();
    fetchActivities();
  }, []);

  /* =========================
     FETCH MINISTRIES
  ========================= */
  const fetchMinistries = async () => {
    try {
      const data = await authFetch("/ministries", {}, token);
      setMinistries(
        (data || []).map(m => ({
          ministryId: m.ministryId ?? m.ministry_id,
          ministryName: m.ministryName ?? m.ministry,
        }))
      );
    } catch {
      setError("Failed to load ministries");
    }
  };

  /* =========================
     FETCH ACTIVITIES
  ========================= */
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await authFetch("/activities", {}, token);

      const normalized = (Array.isArray(data) ? data : []).map(a => ({
        ...a,
        status: (a.status || "SCHEDULED").toUpperCase(),
      }));

      setActivities(normalized);
    } catch {
      setError("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     MODAL HANDLING
  ========================= */
  const openModal = (act = null, type = "add") => {
    if (act) {
      setForm({
        activityId: act.activityId,
        activity: act.activity,
        date: act.date,
        time: act.time,
        place: act.place,
        ministryId: act.ministryId,
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
        ministryId: "",
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /* =========================
     SAVE ACTIVITY
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      activity: form.activity,
      ministryId: Number(form.ministryId),
      date: form.date,
      time: form.time,
      place: form.place,
    };

    try {
      if (editing) {
        await authFetch(`/activities/${form.activityId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        }, token);
      } else if (rescheduleId) {
        await authFetch(`/activities/${rescheduleId}/reschedule`, {
          method: "PUT",
          body: JSON.stringify({ date: form.date, time: form.time }),
        }, token);
      } else {
        await authFetch("/activities", {
          method: "POST",
          body: JSON.stringify(payload),
        }, token);
      }

      await fetchActivities();
      closeModal();
    } catch {
      setError("Failed to save activity");
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

  /* =========================
     FILTER BY STATUS
  ========================= */
  const scheduled = activities.filter(a => a.status === "SCHEDULED");
  const rescheduled = activities.filter(a => a.status === "RESCHEDULED");
  const completed = activities.filter(a => a.status === "COMPLETED");

  /* =========================
     RENDER
  ========================= */
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Activities</h1>

      <button
        onClick={() => openModal()}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Add Activity
      </button>

      {loading ? <p>Loading...</p> : (
        <>
          <h2 className="font-semibold mb-2">Scheduled</h2>
          {scheduled.length ? scheduled.map(a => (
            <ActivityRow
              key={a.activityId}
              a={a}
              onEdit={() => openModal(a, "edit")}
              onReschedule={() => openModal(a, "reschedule")}
              onDelete={() => handleDelete(a.activityId)}
            />
          )) : <p>No scheduled activities</p>}

          <h2 className="font-semibold mt-4 mb-2">Rescheduled</h2>
          {rescheduled.length ? rescheduled.map(a => (
            <ActivityRow
              key={a.activityId}
              a={a}
              onEdit={() => openModal(a, "edit")}
              onReschedule={() => openModal(a, "reschedule")}
              onDelete={() => handleDelete(a.activityId)}
            />
          )) : <p>No rescheduled activities</p>}

          <h2 className="font-semibold mt-4 mb-2">Completed</h2>
          {completed.length ? completed.map(a => (
            <div
              key={a.activityId}
              className="p-2 border rounded mb-1 bg-gray-100 text-gray-700"
            >
              {a.activity} – {a.date} {a.time}
            </div>
          )) : <p>No completed activities</p>}
        </>
      )}

      {/* =========================
          MODAL
      ========================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-2">{editing ? "Edit" : rescheduleId ? "Reschedule" : "Add"} Activity</h2>
            {error && <p className="text-red-600 mb-2">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              {!rescheduleId && (
                <>
                  <input
                    type="text"
                    name="activity"
                    placeholder="Activity Name"
                    value={form.activity}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    name="place"
                    placeholder="Place"
                    value={form.place}
                    onChange={handleChange}
                    className="border p-2 rounded"
                  />
                  <select
                    name="ministryId"
                    value={form.ministryId}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                  >
                    <option value="">Select Ministry</option>
                    {ministries.map(m => (
                      <option key={m.ministryId} value={m.ministryId}>{m.ministryName}</option>
                    ))}
                  </select>
                </>
              )}
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={closeModal} className="px-3 py-1 border rounded">Cancel</button>
                <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   ACTIVITY ROW COMPONENT
========================= */
function ActivityRow({ a, onEdit, onReschedule, onDelete }) {
  return (
    <div className="flex justify-between p-2 border rounded mb-1">
      <div>{a.activity} – {a.date} {a.time}</div>
      <div className="flex gap-1">
        <button onClick={onEdit} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">Edit</button>
        <button onClick={onReschedule} className="px-2 py-1 bg-yellow-500 text-white rounded text-sm">Reschedule</button>
        <button onClick={onDelete} className="px-2 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
      </div>
    </div>
  );
}
