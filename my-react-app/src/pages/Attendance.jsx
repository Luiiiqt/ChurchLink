import React, { useEffect, useState } from "react";
import { authFetch } from "../utils/api";

export default function Attendance() {
  const [activities, setActivities] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch activities and members
  useEffect(() => {
    const fetchData = async () => {
      try {
        const acts = await authFetch("/activities");
        const mems = await authFetch("/members");

        setActivities(acts || []);
        setMembers(mems || []);

        // Auto-select today's activity
        const today = new Date().toISOString().split("T")[0];
        const todaysActivity = (acts || []).find(a => a.date === today);
        if (todaysActivity) selectActivity(todaysActivity);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Select activity and load its attendance
  const selectActivity = async (activity) => {
    setSelectedActivity(activity);
    try {
      const allAttendance = await authFetch("/attendances");
      const actAttendance = allAttendance
        .filter(a => a.activity.activityId === activity.activityId)
        .reduce((acc, cur) => {
          acc[cur.member.memberId] = true;
          return acc;
        }, {});
      setAttendance(actAttendance);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch attendance");
    }
  };

  const toggleAttendance = (memberId) => {
    setAttendance({ ...attendance, [memberId]: !attendance[memberId] });
  };

  const addMemberToAttendance = (member) => {
    setAttendance({ ...attendance, [member.memberId]: true });
    if (!members.find(m => m.memberId === member.memberId)) {
      setMembers([...members, member]);
    }
  };

  const saveAttendance = async () => {
    if (!selectedActivity) return;
    try {
      const allAttendance = await authFetch("/attendances");

      for (const memberId in attendance) {
        const isChecked = attendance[memberId];
        const existing = allAttendance.find(
          a => a.activity.activityId === selectedActivity.activityId &&
               a.member.memberId === parseInt(memberId)
        );

        if (existing) {
          // Update existing record if changed
          if (!isChecked) {
            // Optional: Delete if unchecked
            await authFetch(`/attendances/${existing.attendanceId}`, {
              method: "DELETE"
            });
          }
        } else if (isChecked) {
          // Create new record
          await authFetch("/attendances", {
            method: "POST",
            body: JSON.stringify({
              member: { memberId: parseInt(memberId) },
              activity: { activityId: selectedActivity.activityId },
              date: selectedActivity.date,
              typeOfActivity: selectedActivity.activity,
            }),
          });
        }
      }

      alert("Attendance saved!");
    } catch (err) {
      console.error(err);
      setError("Failed to save attendance");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Attendance</h1>

      <select
        onChange={(e) => selectActivity(activities.find(a => a.activityId === parseInt(e.target.value)))}
        value={selectedActivity?.activityId || ""}
        className="border p-2 rounded mb-4"
      >
        <option value="">Select Activity</option>
        {activities.map(a => (
          <option key={a.activityId} value={a.activityId}>
            {a.activity} ({a.date})
          </option>
        ))}
      </select>

      {selectedActivity && (
        <div>
          <h2 className="font-semibold mb-2">Mark Attendance for "{selectedActivity.activity}"</h2>

          <ul className="space-y-2 mb-4">
            {members.map(m => (
              <li key={m.memberId} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={!!attendance[m.memberId]}
                  onChange={() => toggleAttendance(m.memberId)}
                />
                <span>{m.firstName} {m.lastName}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={saveAttendance}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Save Attendance
          </button>
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Add Member to Attendance</h3>
        <select
          onChange={(e) => {
            const memberId = parseInt(e.target.value);
            if (memberId) {
              const member = members.find(m => m.memberId === memberId);
              addMemberToAttendance(member);
            }
          }}
          className="border p-2 rounded"
        >
          <option value="">Select Member to Add</option>
          {members
            .filter(m => !attendance[m.memberId])
            .map(m => (
              <option key={m.memberId} value={m.memberId}>
                {m.firstName} {m.lastName}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
