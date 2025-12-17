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
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("general"); // general, specific, all

    // Load members & activities
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

    // Load attendance records
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

    // Toggle present/absent
    const togglePresent = (memberId) => {
      setPresentIds(prev => {
        const copy = new Set(prev);
        copy.has(memberId) ? copy.delete(memberId) : copy.add(memberId);
        return copy;
      });
    };

    // Select all members
    const selectAll = () => {
      const allIds = new Set(membersForAttendance.map(m => m.memberId));
      setPresentIds(allIds);
    };

    // Clear all selections
    const clearAll = () => {
      setPresentIds(new Set());
    };

    // Save attendance
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

        alert("Attendance saved successfully!");
        setPresentIds(new Set());
        setSelectedActivity(null);
        setGeneralName("Sunday Service");

        await loadMembersAndActivities();
        await loadRecords();
      } catch {
        setError("Failed to save attendance");
      } finally {
        setLoading(false);
      }
    };

    // Helper: get present/absent names filtered by ministry
    const getMemberNames = (record) => {
      const activity = activities.find(a => a.activityId === record.activityId);
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

    // Members filtered for form
    const membersForAttendance = selectedActivity
      ? members.filter(m => m.ministryId === selectedActivity.ministryId)
      : members;

    // Filter members by search
    const filteredMembers = membersForAttendance.filter(m => 
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Separate records
    const generalRecords = records.filter(r => !r.activityId);
    const specificRecords = records.filter(r => r.activityId);
    const displayRecords = viewMode === "general" ? generalRecords : 
                          viewMode === "specific" ? specificRecords : records;

    if (loading && members.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-green-200 border-t-green-600 mb-4"></div>
            <p className="text-gray-700 text-lg font-semibold">Loading attendance...</p>
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
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold">Attendance</h1>
                </div>
                <p className="text-green-100 text-lg">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Present Today</p>
                  <p className="text-3xl font-bold text-green-600">{presentIds.size}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Members</p>
                  <p className="text-3xl font-bold text-emerald-600">{membersForAttendance.length}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-teal-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Records</p>
                  <p className="text-3xl font-bold text-teal-600">{records.length}</p>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Form */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8 border border-green-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Take Attendance</h2>
            </div>

            {/* Activity Selection */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Activity</label>
                <select
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
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
              </div>

              {!selectedActivity && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Attendance Name</label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    value={generalName}
                    onChange={(e) => setGeneralName(e.target.value)}
                    placeholder="e.g., Sunday Service"
                  />
                </div>
              )}
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
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
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
                >
                  Select All
                </button>
                <button
                  onClick={clearAll}
                  className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all shadow-md hover:shadow-lg"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Members Grid */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">
                Selected: <span className="font-bold text-green-600">{presentIds.size}</span> / {filteredMembers.length}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2">
                {filteredMembers.map(m => (
                  <label
                    key={m.memberId}
                    className={`p-4 border-2 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                      presentIds.has(m.memberId) 
                        ? "bg-green-50 border-green-400 shadow-md" 
                        : "bg-white border-gray-200 hover:border-green-300 hover:shadow-sm"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={presentIds.has(m.memberId)}
                      onChange={() => togglePresent(m.memberId)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        presentIds.has(m.memberId) ? "bg-green-500" : "bg-gray-400"
                      }`}>
                        {m.firstName.charAt(0)}{m.lastName.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800">{m.firstName} {m.lastName}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={saveAttendance}
              disabled={loading || presentIds.size === 0}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {loading ? "Saving..." : "Save Attendance"}
            </button>
          </div>

          {/* Attendance Records */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-green-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Attendance Records</h2>
              </div>

              {/* View Mode Filter */}
              <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("general")}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    viewMode === "general" 
                      ? "bg-white text-green-600 shadow-md" 
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  General
                </button>
                <button
                  onClick={() => setViewMode("specific")}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    viewMode === "specific" 
                      ? "bg-white text-green-600 shadow-md" 
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Specific
                </button>
                <button
                  onClick={() => setViewMode("all")}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    viewMode === "all" 
                      ? "bg-white text-green-600 shadow-md" 
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            {displayRecords.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No attendance records found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayRecords.map(r => {
                  const { presentMembers, absentMembers } = getMemberNames(r);
                  const totalMembers = presentMembers.length + absentMembers.length;
                  const attendanceRate = totalMembers > 0 ? ((presentMembers.length / totalMembers) * 100).toFixed(1) : 0;

                  return (
                    <div key={r.sessionId} className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-6 border-2 border-gray-200 hover:border-green-300 transition-all hover:shadow-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{r.activityName}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(r.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {attendanceRate}%
                          </div>
                          <p className="text-xs text-gray-600">Attendance Rate</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Present */}
                        <div className="bg-white rounded-xl p-4 border border-green-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <p className="font-bold text-green-700">Present ({presentMembers.length})</p>
                          </div>
                          {presentMembers.length > 0 ? (
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {presentMembers.map((name, idx) => (
                                <div key={name + idx} className="flex items-center gap-2 text-sm text-gray-700">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  {name}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400 italic">No one present</p>
                          )}
                        </div>

                        {/* Absent */}
                        <div className="bg-white rounded-xl p-4 border border-red-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <p className="font-bold text-red-700">Absent ({absentMembers.length})</p>
                          </div>
                          {absentMembers.length > 0 ? (
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {absentMembers.map((name, idx) => (
                                <div key={name + idx} className="flex items-center gap-2 text-sm text-gray-700">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  {name}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400 italic">No one absent</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }