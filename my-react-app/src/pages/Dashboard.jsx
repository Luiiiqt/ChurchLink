import { useEffect, useState } from "react";
import { authFetch } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { token } = useAuth();
  const [members, setMembers] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const [membersData, ministriesData, activitiesData, attendancesData] = await Promise.all([
        authFetch("/members", {}, token),        // <-- pass token
        authFetch("/ministries", {}, token),     // <-- pass token
        authFetch("/activities", {}, token),     // <-- pass token
        authFetch("/attendances", {}, token),
      ]);

      setMembers(membersData || []);
      setMinistries(ministriesData || []);
      setActivities(activitiesData || []);
      setAttendances(attendancesData || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [token]);

  const countMembersByMinistry = (ministryId) =>
    members.filter((m) => m.ministryId === ministryId).length;

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-green-200 rounded shadow">
          <h2 className="text-xl">Total Members</h2>
          <p className="text-2xl font-bold">{members.length}</p>
        </div>
        <div className="p-4 bg-green-200 rounded shadow">
          <h2 className="text-xl">Total Ministries</h2>
          <p className="text-2xl font-bold">{ministries.length}</p>
        </div>
        <div className="p-4 bg-blue-200 rounded shadow">
          <h2 className="text-xl">Total Activities</h2>
          <p className="text-2xl font-bold">{activities.length}</p>
        </div>
        <div className="p-4 bg-blue-200 rounded shadow">
          <h2 className="text-xl">Total Attendance</h2>
          <p className="text-2xl font-bold">{attendances.length}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Members per Ministry</h2>
      {ministries.length === 0 ? (
        <p>No ministries found</p>
      ) : (
        <ul className="space-y-2">
          {ministries.map((min) => (
            <li
              key={min.ministryId}
              className="p-2 bg-blue-100 rounded shadow"
            >
              {min.ministryName}: {countMembersByMinistry(min.ministryId)} members
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
