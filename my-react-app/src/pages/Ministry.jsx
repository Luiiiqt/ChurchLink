import { useEffect, useState } from "react";
import { authFetch } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Ministry() {
  const { token } = useAuth();
  const [ministries, setMinistries] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch ministries and members
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ministriesData, membersData] = await Promise.all([
        authFetch("/ministries", {}, token),
        authFetch("/members", {}, token),
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
    if (token) fetchData();
  }, [token]);

  // Filter members for selected ministry
  const membersOfSelected = selectedMinistry
    ? members.filter(m => m.ministryId === selectedMinistry.ministryId)
    : [];

  // Filter by search term
  const filteredMembers = membersOfSelected.filter(m =>
    `${m.firstName} ${m.middleName || ""} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Color palette for ministry cards
  const COLORS = ['#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#84cc16'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-20 w-20 border-8 border-green-200 border-t-green-600 mb-4"></div>
          <p className="text-gray-700 text-xl font-semibold">Loading ministries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white border-l-4 border-red-500 p-8 rounded-2xl shadow-2xl max-w-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Error Loading Data</h3>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            className="w-full mt-4 bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">Ministries</h1>
              </div>
              <p className="text-green-100 text-lg">
                Explore our ministries and their members
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                  <span className="text-green-100 text-sm">Total Ministries</span>
                  <div className="text-2xl font-bold">{ministries.length}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                  <span className="text-green-100 text-sm">Total Members</span>
                  <div className="text-2xl font-bold">{members.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ministry Cards */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8 border border-green-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Select a Ministry</h2>
          </div>

          {ministries.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No ministries found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {ministries.map((ministry, index) => {
                const memberCount = members.filter(m => m.ministryId === ministry.ministryId).length;
                const isSelected = selectedMinistry?.ministryId === ministry.ministryId;
                const color = COLORS[index % COLORS.length];

                return (
                  <button
                    key={ministry.ministryId}
                    onClick={() => setSelectedMinistry(ministry)}
                    className={`group relative p-5 rounded-2xl transition-all duration-300 border-2 cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-xl scale-105"
                        : "bg-white border-gray-200 hover:border-green-300 hover:shadow-lg"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg transition-all duration-300 mb-3 ${
                          isSelected ? "scale-110 rotate-6" : "group-hover:scale-110 group-hover:rotate-6"
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {ministry.ministryName.charAt(0).toUpperCase()}
                      </div>
                      <h3 className={`font-bold text-sm text-center mb-2 line-clamp-2 min-h-[2.5rem] transition-colors ${
                        isSelected ? "text-green-700" : "text-gray-800 group-hover:text-green-700"
                      }`}>
                        {ministry.ministryName}
                      </h3>
                      <div className="text-center">
                        <div className={`text-2xl font-bold mb-1 ${
                          isSelected 
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent" 
                            : "text-gray-700"
                        }`}>
                          {memberCount}
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                          {memberCount === 1 ? "member" : "members"}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Members Table */}
        {selectedMinistry && (
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-green-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedMinistry.ministryName}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"}
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  className="w-full border-2 border-gray-200 p-3 pl-10 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {filteredMembers.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">
                  {searchTerm ? "No members found matching your search" : "No members in this ministry"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-50 to-emerald-50">
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b border-gray-200">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b border-gray-200">DOB</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b border-gray-200">Gender</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b border-gray-200">Address</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b border-gray-200">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member, index) => (
                      <tr key={member.memberId} className={`transition-colors hover:bg-green-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        {/* Name */}
                        <td className="px-6 py-4 border-b border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {member.firstName} {member.middleName || ""} {member.lastName}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* DOB */}
                        <td className="px-6 py-4 text-gray-700 border-b border-gray-200">
                          {member.dob ? new Date(member.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                        </td>

                        {/* Gender */}
                        <td className="px-6 py-4 border-b border-gray-200">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            member.gender === 'Male' ? 'bg-blue-100 text-blue-700' :
                            member.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {member.gender || 'N/A'}
                          </span>
                        </td>

                        {/* Address */}
                        <td className="px-6 py-4 text-gray-700 border-b border-gray-200">
                          {member.address || 'N/A'}
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4 border-b border-gray-200">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            member.role === 'Leader' ? 'bg-blue-100 text-blue-700' :
                            member.role === 'Assistant' ? 'bg-purple-100 text-purple-700' :
                            member.role === 'Member' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {member.role || 'N/A'}
                          </span>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
