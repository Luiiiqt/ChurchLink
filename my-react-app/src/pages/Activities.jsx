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

  /* ========================= INITIAL LOAD ========================= */
  useEffect(() => {
    if (token) {
      fetchMinistries();
      fetchActivities();
    }
  }, [token]);

  /* ========================= FETCH MINISTRIES ========================= */
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

  /* ========================= FETCH ACTIVITIES ========================= */
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

  /* ========================= MODAL HANDLING ========================= */
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

  /* ========================= SAVE ACTIVITY ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

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

  /* ========================= DELETE ACTIVITY ========================= */
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

  /* ========================= FILTER BY STATUS ========================= */
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

  /* ========================= RENDER ========================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -ml-36 -mb-36"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-1">Activities</h1>
                    <p className="text-green-100 text-lg">Manage church activities and events</p>
                  </div>
                </div>
                <button
                  onClick={() => openModal()}
                  className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Activity
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium mb-1">Total Activities</p>
                      <p className="text-3xl font-bold">{activities.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium mb-1">Scheduled</p>
                      <p className="text-3xl font-bold">{scheduled.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium mb-1">Completed</p>
                      <p className="text-3xl font-bold">{completed.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-5 rounded-xl shadow-md animate-fadeIn">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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
          icon="calendar"
        />
        <ActivitiesSection
          title="Rescheduled Activities"
          activities={rescheduled}
          getMinistryName={getMinistryName}
          onEdit={openModal}
          onReschedule={openModal}
          onDelete={handleDelete}
          statusColor="yellow"
          icon="refresh"
        />
        <ActivitiesSection
          title="Completed Activities"
          activities={completed}
          getMinistryName={getMinistryName}
          onDelete={handleDelete}
          statusColor="blue"
          icon="check"
          completedOnly
        />
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">
                  {editing ? "Edit Activity" : rescheduleId ? "Reschedule Activity" : "Add New Activity"}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-88px)]">
              {!rescheduleId && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Activity Name
                    </label>
                    <input
                      type="text"
                      name="activity"
                      placeholder="e.g., Sunday Worship Service"
                      value={form.activity}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all text-gray-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Location
                    </label>
                    <input
                      type="text"
                      name="place"
                      placeholder="e.g., Main Sanctuary"
                      value={form.place}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all text-gray-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Ministry
                    </label>
                    <select
                      name="ministryId"
                      value={form.ministryId}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all text-gray-800"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all text-gray-800"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
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

/* ========================= Activities Section Component ========================= */
function ActivitiesSection({ title, activities, getMinistryName, onEdit, onReschedule, onDelete, statusColor, icon, completedOnly = false }) {
  const colorMap = {
    green: {
      bg: "from-green-50 to-emerald-50",
      border: "border-green-200",
      icon: "bg-green-500",
      badge: "bg-green-100 text-green-700",
      hover: "hover:border-green-300"
    },
    yellow: {
      bg: "from-yellow-50 to-amber-50",
      border: "border-yellow-200",
      icon: "bg-yellow-500",
      badge: "bg-yellow-100 text-yellow-700",
      hover: "hover:border-yellow-300"
    },
    blue: {
      bg: "from-blue-50 to-cyan-50",
      border: "border-blue-200",
      icon: "bg-blue-500",
      badge: "bg-blue-100 text-blue-700",
      hover: "hover:border-blue-300"
    }
  };

  const colors = colorMap[statusColor] || colorMap.green;

  const getIcon = () => {
    switch(icon) {
      case "calendar":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
      case "refresh":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />;
      case "check":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />;
      default:
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
    }
  };

  return (
    <div className={`bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-6 border-2 ${colors.border}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 ${colors.icon} rounded-2xl flex items-center justify-center shadow-lg`}>
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {getIcon()}
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-600 mt-0.5">
            {activities.length} {activities.length === 1 ? "activity" : "activities"}
          </p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className={`bg-gradient-to-br ${colors.bg} rounded-2xl p-12 text-center border-2 border-dashed ${colors.border}`}>
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-500 text-lg font-medium">No {title.toLowerCase()} yet</p>
          <p className="text-gray-400 text-sm mt-2">Activities will appear here once added</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {activities.map((a) => (
            <div 
              key={a.activityId}
              className={`bg-gradient-to-br ${colors.bg} rounded-2xl p-6 border-2 ${colors.border} ${colors.hover} transition-all hover:shadow-lg group`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-green-700 transition-colors">
                        {a.activity}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">{new Date(a.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{a.time}</span>
                        </div>
                        {a.place && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium">{a.place}</span>
                          </div>
                        )}
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${colors.badge}`}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {getMinistryName(a.ministryId)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {!completedOnly && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onEdit(a, "edit")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => onReschedule(a, "reschedule")}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reschedule
                    </button>
                    <button
                      onClick={() => onDelete(a.activityId)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                )}

                {completedOnly && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Completed
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  
  .animate-slideUp {
    animation: slideUp 0.3s ease-out;
  }
`;
document.head.appendChild(style);