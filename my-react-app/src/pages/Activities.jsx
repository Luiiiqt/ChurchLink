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
    if (token) {
      fetchMinistries();
      fetchActivities();
    }
  }, [token]);

  /* =========================
     FETCH MINISTRIES
  ========================= */
  const fetchMinistries = async () => {
    try {
      const data = await authFetch("/ministries", {}, token);
      setMinistries(
        (data || []).map((m) => ({
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
      const normalized = (Array.isArray(data) ? data : []).map((a) => ({
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
        activity: act.activity || "",
        date: act.date || "",
        time: act.time || "",
        place: act.place || "",
        ministryId: act.ministryId || "",
      });

      if (type === "edit") {
        setEditing(true);
        setRescheduleId(null);
      } else if (type === "reschedule") {
        setEditing(false);
        setRescheduleId(act.activityId);
      }
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* =========================
     SAVE ACTIVITY
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation (DTO requirements)
    if (!form.activity || !form.place || !form.ministryId) {
      setError("Activity, Place, and Ministry are required");
      return;
    }

    try {
      const payload = {
        activity: form.activity,
        ministryId: Number(form.ministryId),
        date: form.date,
        time: form.time,
        place: form.place,
      };

      if (rescheduleId) {
        // Automatically set status to RESCHEDULED
        payload.status = "RESCHEDULED";

        await authFetch(`/activities/${rescheduleId}/reschedule`, {
          method: "PUT",
          body: JSON.stringify(payload),
        }, token);
      } else if (editing) {
        await authFetch(`/activities/${form.activityId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        }, token);
      } else {
        await authFetch("/activities", {
          method: "POST",
          body: JSON.stringify(payload),
        }, token);
      }

      await fetchActivities();
      closeModal();
    } catch (err) {
      console.error(err);
      if (err.errors) {
        setError(Object.values(err.errors).join(", "));
      } else {
        setError("Failed to save activity");
      }
    }
  };

  /* =========================
     DELETE ACTIVITY
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this activity?")) return;
    try {
      await authFetch(`/activities/${id}`, { method: "DELETE" }, token);
      setActivities((prev) => prev.filter((a) => a.activityId !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete activity");
      await fetchActivities();
    }
  };

  /* =========================
     FILTER BY STATUS
  ========================= */
  const scheduled = activities.filter((a) => a.status === "SCHEDULED");
  const rescheduled = activities.filter((a) => a.status === "RESCHEDULED");
  const completed = activities.filter((a) => a.status === "COMPLETED");

  const getMinistryName = (ministryId) => {
    const ministry = ministries.find((m) => m.ministryId === ministryId);
    return ministry ? ministry.ministryName : "Unknown Ministry";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-20 w-20 border-8 border-green-200 border-t-green-600 mb-4"></div>
          <p className="text-gray-700 text-xl font-semibold">Loading activities...</p>
        </div>
      </div>
    );
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold">Activities</h1>
                    <p className="text-green-100 text-lg mt-1">Manage church activities and events</p>
                  </div>
                </div>
                <button
                  onClick={() => openModal()}
                  className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Activity
                </button>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                  <span className="text-green-100 text-sm">Total Activities</span>
                  <div className="text-2xl font-bold">{activities.length}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                  <span className="text-green-100 text-sm">Scheduled</span>
                  <div className="text-2xl font-bold">{scheduled.length}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                  <span className="text-green-100 text-sm">Completed</span>
                  <div className="text-2xl font-bold">{completed.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Activities Sections */}
        <ActivitiesSection
          title="Scheduled Activities"
          activities={scheduled}
          getMinistryName={getMinistryName}
          onEdit={openModal}
          onReschedule={openModal}
          onDelete={handleDelete}
          statusColor="green"
        />
        <ActivitiesSection
          title="Rescheduled Activities"
          activities={rescheduled}
          getMinistryName={getMinistryName}
          onEdit={openModal}
          onReschedule={openModal}
          onDelete={handleDelete}
          statusColor="yellow"
        />
        <ActivitiesSection
          title="Completed Activities"
          activities={completed}
          getMinistryName={getMinistryName}
          statusColor="blue"
          completedOnly
        />

      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-3xl">
              <h2 className="text-2xl font-bold">
                {editing ? "Edit Activity" : rescheduleId ? "Reschedule Activity" : "Add Activity"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!rescheduleId && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Activity Name</label>
                    <input
                      type="text"
                      name="activity"
                      placeholder="Enter activity name"
                      value={form.activity}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Place</label>
                    <input
                      type="text"
                      name="place"
                      placeholder="Enter location"
                      value={form.place}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ministry</label>
                    <select
                      name="ministryId"
                      value={form.ministryId}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      required
                    >
                      <option value="">Select Ministry</option>
                      {ministries.map((m) => (
                        <option key={m.ministryId} value={m.ministryId}>{m.ministryName}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  {editing ? "Update" : rescheduleId ? "Reschedule" : "Create"} Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   Activities Section Component
========================= */
function ActivitiesSection({ title, activities, getMinistryName, onEdit, onReschedule, onDelete, statusColor, completedOnly = false }) {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-${statusColor}-500`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-600">{activities.length} {activities.length === 1 ? "activity" : "activities"}</p>
          </div>
        </div>
        <div className="text-center py-12 text-gray-500">No {title.toLowerCase()}</div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-6 border border-${statusColor}-100`}>
      <div className="flex flex-col gap-3">
        {activities.map((a) =>
          completedOnly ? (
            <div key={a.activityId} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border-2 border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg mb-2">{a.activity}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span>{new Date(a.date).toLocaleDateString()}</span>
                    <span>{a.time}</span>
                    {a.place && <span>{a.place}</span>}
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {getMinistryName(a.ministryId)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div key={a.activityId} className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
              <div>
                <h3 className="font-bold text-gray-800">{a.activity}</h3>
                <p className="text-sm text-gray-600">{getMinistryName(a.ministryId)}</p>
              </div>
              <div className="flex gap-2">
                {!completedOnly && (
                  <>
                    <button
                      onClick={() => onEdit(a, "edit")}
                      className="text-blue-500 hover:text-blue-700 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onReschedule(a, "reschedule")}
                      className="text-yellow-500 hover:text-yellow-700 font-semibold"
                    >
                      Reschedule
                    </button>
                  </>
                )}
                <button
                  onClick={() => onDelete(a.activityId)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
