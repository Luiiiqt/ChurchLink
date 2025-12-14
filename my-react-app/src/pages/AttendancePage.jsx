import { useEffect, useState, useCallback } from "react";
import { authFetch } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function AttendancePage() {
  const { token } = useAuth();

  // Data states
  const [activities, setActivities] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activityType, setActivityType] = useState("GENERAL");
  const [form, setForm] = useState({
    activityName: "Sunday Service",
    date: new Date().toISOString().split("T")[0],
    time: "",
  });

  const normalizeMinistries = (data) =>
    (data || []).map((m) => ({
      ministryId: m.ministryId ?? m.ministry_id,
      ministryName: m.ministry ?? m.ministryName,
    }));

  // Load all necessary data once
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [acts, mins, recData] = await Promise.all([
          authFetch("/activities", {}, token),
          authFetch("/ministries", {}, token),
          authFetch("/attendances/records", {}, token),
        ]);

        setActivities(Array.isArray(acts) ? acts.filter(a => a.status !== "CANCELLED") : []);
        setMinistries(normalizeMinistries(mins));
        setRecords(Array.isArray(recData) ? recData : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token]);

  // Load members for GENERAL or SPECIFIC attendance
  const loadMembers = async (type, activity = null) => {
    setLoading(true);
    setError(null);
    setActivityType(type);
    setSelectedActivity(activity);
    try {
      const endpoint = type === "GENERAL"
        ? "/attendances/general/members"
        : `/attendances/activity/${activity.activityId}/members`;
      const data = await authFetch(endpoint, {}, token);
      setMembers(data || []);
      const map = {};
      (data || []).forEach(m => map[m.memberId] = m.present);
      setAttendance(map);
    } catch {
      setError("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = useCallback(
    (memberId) => setAttendance(prev => ({ ...prev, [memberId]: !prev[memberId] })),
    []
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Save attendance
  const saveAttendance = async () => {
    if (members.length === 0) return;

    try {
      const today = form.date;
      const requests = Object.entries(attendance)
        .filter(([, present]) => present)
        .map(([memberId]) => {
          if (activityType === "GENERAL") {
            const { activityName, date, time } = form;
            return authFetch("/attendances/general", {
              method: "POST",
              body: JSON.stringify({ memberId: parseInt(memberId), activity: activityName, date, time }),
            }, token);
          } else {
            return authFetch("/attendances/specific", {
              method: "POST",
              body: JSON.stringify({ memberId: parseInt(memberId), activityId: selectedActivity.activityId }),
            }, token);
          }
        });

      await Promise.all(requests);

      // Update records locally instantly
      const newRecords = members.map(m => ({
        memberId: m.memberId,
        memberFirstName: m.firstName,
        memberLastName: m.lastName,
        ministryId: m.ministryId,
        ministryName: ministries.find(x => x.ministryId === m.ministryId)?.ministryName || "Unknown",
        activity_id: activityType === "GENERAL" ? null : selectedActivity.activityId,
        activityName: activityType === "GENERAL" ? form.activityName : selectedActivity.activity,
        date: today,
        present: !!attendance[m.memberId],
      }));

      setRecords(prev => [...prev, ...newRecords]);

      // Reset for next attendance
      setAttendance({});
      setMembers([]);
      if (activityType === "GENERAL") setForm({ ...form, time: "" });
      else setActivities(prev => prev.filter(a => a.activityId !== selectedActivity.activityId));
      setSelectedActivity(null);

      alert("Attendance saved!");
    } catch {
      setError("Failed to save attendance");
    }
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;

  // Group records by date for display
  const groupedRecords = records.reduce((acc, r) => {
    if (!acc[r.date]) acc[r.date] = [];
    acc[r.date].push(r);
    return acc;
  }, {});

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Attendance</h1>

      {/* Attendance Type */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => loadMembers("GENERAL")}
          className={`px-6 py-2 rounded font-semibold ${activityType === "GENERAL" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          General
        </button>
        <button
          onClick={() => { setActivityType("SPECIFIC"); setMembers([]); setAttendance({}); }}
          className={`px-6 py-2 rounded font-semibold ${activityType === "SPECIFIC" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Specific
        </button>
      </div>

      {/* Form for GENERAL */}
      {activityType === "GENERAL" && members.length > 0 && (
        <div className="mb-4 space-y-2">
          <input
            name="activityName"
            value={form.activityName}
            onChange={handleFormChange}
            placeholder="Activity Name"
            className="border p-2 rounded w-full"
          />
          <input name="date" type="date" value={form.date} onChange={handleFormChange} className="border p-2 rounded w-full" />
          <input name="time" type="time" value={form.time} onChange={handleFormChange} className="border p-2 rounded w-full" />
        </div>
      )}

      {/* Form for SPECIFIC */}
      {activityType === "SPECIFIC" && (
        <select
          className="w-full border p-2 rounded mb-4"
          value={selectedActivity?.activityId || ""}
          onChange={(e) => {
            const act = activities.find(a => a.activityId === Number(e.target.value));
            if (act) loadMembers("SPECIFIC", act);
          }}
        >
          <option value="">Select Activity</option>
          {activities.filter(a => !a.isGeneral).map(a => (
            <option key={a.activityId} value={a.activityId}>{a.activity}</option>
          ))}
        </select>
      )}

      {/* Members List */}
      {members.length > 0 && (
        <div className="bg-white shadow rounded p-4 mb-6">
          <p className="mb-3 font-medium">Present: {presentCount} / {members.length}</p>
          <div className="grid md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
            {members.map(m => (
              <label key={m.memberId} className={`p-2 border rounded flex items-center gap-2 cursor-pointer ${attendance[m.memberId] ? "bg-green-100 border-green-400" : ""}`}>
                <input type="checkbox" checked={!!attendance[m.memberId]} onChange={() => toggleAttendance(m.memberId)} />
                {m.firstName} {m.lastName}
              </label>
            ))}
          </div>
          <button onClick={saveAttendance} className="mt-4 w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700">
            Save Attendance
          </button>
        </div>
      )}

      {/* Attendance Records */}
      <h2 className="text-2xl font-bold mb-4">Attendance Records</h2>
      {Object.keys(groupedRecords).length === 0 ? (
        <p>No attendance records yet.</p>
      ) : (
        Object.keys(groupedRecords)
          .sort((a, b) => new Date(b) - new Date(a))
          .map(date => (
            <div key={date} className="mb-6">
              <h3 className="font-semibold mb-2">{date}</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Member</th>
                    <th className="border p-2">Ministry</th>
                    <th className="border p-2">Activity</th>
                    <th className="border p-2">Present</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedRecords[date].map(r => (
                    <tr key={r.memberId + r.activityName}>
                      <td className="border p-2">{r.memberFirstName} {r.memberLastName}</td>
                      <td className="border p-2">{r.ministryName}</td>
                      <td className="border p-2">{r.activityName}</td>
                      <td className="border p-2 text-center">{r.present ? "✔️" : "❌"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
      )}
    </div>
  );
}
