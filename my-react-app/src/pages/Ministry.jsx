import { useEffect, useState } from "react";
import { authFetch } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Ministry() {
  const { token } = useAuth(); // <-- added token
  const [ministries, setMinistries] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ministries and members
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ministriesData, membersData] = await Promise.all([
        authFetch("/ministries", {}, token), // <-- pass token
        authFetch("/members", {}, token),    // <-- pass token
      ]);
      setMinistries(ministriesData || []);
      setMembers(membersData || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load ministries or members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Filter members for selected ministry
  const membersOfSelected = selectedMinistry
    ? members.filter(m => m.ministryId === selectedMinistry.ministryId)
    : [];

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Ministries</h1>

      <div className="flex gap-4 mb-4 flex-wrap">
        {ministries.map(m => (
          <button
            key={m.ministryId}
            onClick={() => setSelectedMinistry(m)}
            className={`px-4 py-2 rounded ${
              selectedMinistry?.ministryId === m.ministryId
                ? "bg-green-600 text-white"
                : "bg-green-200"
            }`}
          >
            {m.ministryName}
          </button>
        ))}
      </div>

      {selectedMinistry && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Members in "{selectedMinistry.ministryName}"
          </h2>
          {membersOfSelected.length === 0 ? (
            <p>No members in this ministry</p>
          ) : (
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
                {membersOfSelected.map(m => (
                  <tr key={m.memberId} className="odd:bg-green-50">
                    <td className="border p-2">
                      {m.firstName} {m.middleName} {m.lastName}
                    </td>
                    <td className="border p-2">{m.dob}</td>
                    <td className="border p-2">{m.gender}</td>
                    <td className="border p-2">{m.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
