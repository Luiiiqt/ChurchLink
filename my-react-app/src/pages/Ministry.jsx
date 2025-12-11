import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authFetch } from "../utils/api";

export default function Ministry() {
  const { token } = useAuth();
  const [ministries, setMinistries] = useState([]);
  const [selected, setSelected] = useState("");
  const [members, setMembers] = useState([]);

  // Fetch ministries from backend
  const fetchMinistries = async () => {
    try {
      const data = await authFetch("/ministries", {}, token);
      setMinistries(data);
    } catch (e) {
      console.error("Failed to fetch ministries:", e.message);
    }
  };

  // Fetch members for selected ministry
  const fetchMembers = async (ministryId) => {
    if (!ministryId) return setMembers([]);
    try {
      const data = await authFetch(`/members?ministryId=${ministryId}`, {}, token);
      setMembers(data);
    } catch (e) {
      console.error("Failed to fetch ministry members:", e.message);
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  useEffect(() => {
    fetchMembers(selected);
  }, [selected]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Ministries</h1>
      <div className="flex gap-4 mb-4">
        {ministries.map((m) => (
          <button
            key={m.ministryId}
            onClick={() => setSelected(m.ministryId)}
            className={`px-4 py-2 rounded ${selected === m.ministryId ? "bg-green-600 text-white" : "bg-green-200"}`}
          >
            {m.ministry}
          </button>
        ))}
      </div>

      {selected && (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-green-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">DOB</th>
              <th className="border p-2">Gender</th>
              <th className="border p-2">Address</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.memberId} className="odd:bg-green-50">
                <td className="border p-2">{`${m.firstName} ${m.middleName} ${m.lastName}`}</td>
                <td className="border p-2">{m.dob}</td>
                <td className="border p-2">{m.gender}</td>
                <td className="border p-2">{m.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
