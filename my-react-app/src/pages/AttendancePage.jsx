import { useEffect, useState } from "react";
import { authFetch } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function AttendancePage() {
  const { token } = useAuth();
  const [members, setMembers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [generalName, setGeneralName] = useState("Sunday Service");
  const [presentIds, setPresentIds] = useState(new Set());
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // -------------------------
  // Load members & activities
  // -------------------------
  const loadMembersAndActivities = async () => {
    setLoading(true);
    try {
      const [memData, actData] = await Promise.all([
        authFetch("/members", {}, token),
        authFetch("/activities", {}, token),
      ]);

      setMembers(Array.isArray(memData) ? memData : []);

      const normalizedActivities = (Array.isArray(actData) ? actData : [])
        .map(a => ({ ...a, completed: a.status?.toUpperCase() === "COMPLETED" }))
        .filter(a => !a.completed);

      setActivities(normalizedActivities);
    } catch {
      setError("Failed to load members or activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadMembersAndActivities();
  }, [token]);

  // -------------------------
  // Load attendance records
  // -------------------------
  const loadRecords = async () => {
    try {
      const data = await authFetch("/attendances/sessions", {}, token);
      setRecords(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load attendance records");
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  // -------------------------
  // Toggle present/absent
  // -------------------------
  const togglePresent = (memberId) => {
    setPresentIds(prev => {
      const copy = new Set(prev);
      copy.has(memberId) ? copy.delete(memberId) : copy.add(memberId);
      return copy;
    });
  };

  // -------------------------
  // Save attendance
  // -------------------------
  const saveAttendance = async () => {
    if (presentIds.size === 0) {
      alert("Select at least one member");
      return;
    }

    setLoading(true);
    try {
      const membersForActivity = selectedActivity
        ? members.filter(m => m.ministryId === selectedActivity.ministryId)
        : members;

      const payload = {
        activityId: selectedActivity?.activityId || null,
        activityName: selectedActivity?.activity || generalName,
        date: new Date().toISOString().slice(0, 10),
        present: Array.from(presentIds),
        absent: membersForActivity
          .map(m => m.memberId)
          .filter(id => !presentIds.has(id)),
      };

      await authFetch("/attendances/session", {
        method: "POST",
        body: JSON.stringify(payload),
      }, token);

      alert("Attendance saved!");
      setPresentIds(new Set());
      setSelectedActivity(null);

      await loadMembersAndActivities();
      await loadRecords();
    } catch {
      setError("Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Separate records
  // -------------------------
  const generalRecords = records.filter(r => !r.activityId);
  const specificRecords = records.filter(r => r.activityId);

  // -------------------------
  // Helper: get present/absent names filtered by ministry
  // -------------------------
  const getMemberNames = (record) => {
    const activity = activities.find(a => a.activityId === record.activityId);

    // Only members of the activity's ministry
    const relevantMembers = activity
      ? members.filter(m => m.ministryId === activity.ministryId)
      : members;

    const presentIdsFromRecord = (record.present || []).map(id => Number(id));
    const absentIdsFromRecord = (record.absent || []).map(id => Number(id));

    const presentMembers = relevantMembers
      .filter(m => presentIdsFromRecord.includes(m.memberId))
      .map(m => `${m.firstName} ${m.lastName}`);

    const absentMembers = relevantMembers
      .filter(m => absentIdsFromRecord.includes(m.memberId))
      .map(m => `${m.firstName} ${m.lastName}`);

    return { presentMembers, absentMembers };
  };

  // -------------------------
  // Members filtered for form
  // -------------------------
  const membersForAttendance = selectedActivity
    ? members.filter(m => m.ministryId === selectedActivity.ministryId)
    : members;

  // -------------------------
  // Render
  // -------------------------
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Attendance</h1>

      {/* Attendance Form */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <p className="mb-2 font-medium">Take Attendance</p>

        <div className="mb-4 flex gap-4">
          <select
            className="border p-2 rounded flex-1"
            value={selectedActivity?.activityId || ""}
            onChange={(e) => {
              const act = activities.find(a => a.activityId === Number(e.target.value));
              setSelectedActivity(act || null);
              setPresentIds(new Set());
            }}
          >
            <option value="">General Attendance</option>
            {activities.map(a => (
              <option key={a.activityId} value={a.activityId}>
                {a.activity} ({a.date})
              </option>
            ))}
          </select>

          {!selectedActivity && (
            <input
              type="text"
              className="border p-2 rounded flex-1"
              value={generalName}
              onChange={(e) => setGeneralName(e.target.value)}
            />
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
          {membersForAttendance.map(m => (
            <label
              key={m.memberId}
              className={`p-2 border rounded flex items-center gap-2 cursor-pointer ${
                presentIds.has(m.memberId) ? "bg-green-100 border-green-400" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={presentIds.has(m.memberId)}
                onChange={() => togglePresent(m.memberId)}
              />
              {m.firstName} {m.lastName}
            </label>
          ))}
        </div>

        <button
          onClick={saveAttendance}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700"
        >
          Save Attendance
        </button>
      </div>

      {/* Attendance Records */}
      <h2 className="text-2xl font-bold mb-3">General Attendance</h2>
      {generalRecords.length === 0 && <p>No general attendance recorded.</p>}
      {generalRecords.map(r => {
        const { presentMembers, absentMembers } = getMemberNames(r);
        return (
          <div key={r.sessionId} className="bg-white shadow rounded p-4 mb-2">
            <p className="font-semibold">{r.activityName} — {r.date}</p>

            <p className="mt-2 font-medium text-green-700">Present ({presentMembers.length}):</p>
            {presentMembers.length > 0 ? (
              <ul className="list-disc list-inside">
                {presentMembers.map((name, idx) => <li key={name + idx}>{name}</li>)}
              </ul>
            ) : <p className="text-sm text-gray-500">No one present</p>}

            <p className="mt-2 font-medium text-red-600">Absent ({absentMembers.length}):</p>
            {absentMembers.length > 0 ? (
              <ul className="list-disc list-inside">
                {absentMembers.map((name, idx) => <li key={name + idx}>{name}</li>)}
              </ul>
            ) : <p className="text-sm text-gray-500">No one absent</p>}
          </div>
        );
      })}

      <h2 className="text-2xl font-bold mt-6 mb-3">Specific Attendance</h2>
      {specificRecords.length === 0 && <p>No specific attendance recorded.</p>}
      {specificRecords.map(r => {
        const { presentMembers, absentMembers } = getMemberNames(r);
        return (
          <div key={r.sessionId} className="bg-white shadow rounded p-4 mb-2">
            <p className="font-semibold">{r.activityName} — {r.date}</p>

            <p className="mt-2 font-medium text-green-700">Present ({presentMembers.length}):</p>
            {presentMembers.length > 0 ? (
              <ul className="list-disc list-inside">
                {presentMembers.map((name, idx) => <li key={name + idx}>{name}</li>)}
              </ul>
            ) : <p className="text-sm text-gray-500">No one present</p>}

            <p className="mt-2 font-medium text-red-600">Absent ({absentMembers.length}):</p>
            {absentMembers.length > 0 ? (
              <ul className="list-disc list-inside">
                {absentMembers.map((name, idx) => <li key={name + idx}>{name}</li>)}
              </ul>
            ) : <p className="text-sm text-gray-500">No one absent</p>}
          </div>
        );
      })}

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {loading && <p className="mt-2">Loading...</p>}
    </div>
  );
}
