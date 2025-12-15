import { useEffect, useState, useCallback, useRef } from "react";
import { authFetch } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function Dashboard() {
  const { token } = useAuth();
  const [members, setMembers] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Prevent double fetch in development
  const hasFetched = useRef(false);

  const fetchDashboard = useCallback(async () => {
    // Prevent duplicate calls
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    setLoading(true);
    setError(null);
    try {
      const [membersData, ministriesData, activitiesData, attendancesData] = await Promise.all([
        authFetch("/members", {}, token),
        authFetch("/ministries", {}, token),
        authFetch("/activities", {}, token),
        authFetch("/attendances/sessions", {}, token),
      ]);

      setMembers(membersData || []);
      setMinistries(ministriesData || []);
      setActivities(activitiesData || []);
      setAttendances(attendancesData || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
      hasFetched.current = false; // Allow retry on error
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchDashboard();
    }
  }, [token, fetchDashboard]);

  const countMembersByMinistry = (ministryId) =>
    members.filter((m) => m.ministryId === ministryId).length;

  const calculatePercentage = (memberCount, totalMembers) => {
    if (totalMembers === 0) return "0.0";
    return ((memberCount / totalMembers) * 100).toFixed(1);
  };

  // Filter activities by status
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Helper function to check if an activity has attendance records
  const hasAttendance = (activityId) => {
    return attendances.some(session => 
      session.activityId === activityId || 
      session.activity_id === activityId
    );
  };

  // Accomplished: Activities that have attendance records OR marked as completed
  const accomplishedActivities = activities.filter(a => {
    const hasAttendanceRecord = hasAttendance(a.activityId || a.activity_id);
    const isMarkedCompleted = a.status === 'completed' || 
                              a.status === 'accomplished' || 
                              a.status === 'done';
    return hasAttendanceRecord || isMarkedCompleted;
  });

  // Get IDs of accomplished activities
  const accomplishedIds = new Set(
    accomplishedActivities.map(a => a.activityId || a.activity_id)
  );

  // Upcoming: Future activities that are NOT accomplished
  const upcomingActivities = activities.filter(a => {
    const activityId = a.activityId || a.activity_id;
    const activityDate = new Date(a.date || a.activityDate);
    const isNotAccomplished = !accomplishedIds.has(activityId);
    const isFuture = activityDate >= today;
    const isScheduled = a.status === 'upcoming' || 
                        a.status === 'scheduled' || 
                        !a.status;
    
    return isNotAccomplished && (isFuture || isScheduled);
  });

  // Recent: Past activities that are NOT accomplished yet
  const recentActivities = activities.filter(a => {
    const activityId = a.activityId || a.activity_id;
    const activityDate = new Date(a.date || a.activityDate);
    const isNotAccomplished = !accomplishedIds.has(activityId);
    const isPast = activityDate < today;
    const isRecent = a.status === 'ongoing' || a.status === 'recent';
    
    return isNotAccomplished && (isPast || isRecent);
  });

  // Prepare chart data
  const ministryChartData = ministries.map((min) => ({
    name: min.ministryName.length > 15 ? min.ministryName.substring(0, 15) + '...' : min.ministryName,
    fullName: min.ministryName,
    members: countMembersByMinistry(min.ministryId),
    percentage: parseFloat(calculatePercentage(countMembersByMinistry(min.ministryId), members.length))
  }));

  const pieChartData = ministries.map((min, index) => ({
    name: min.ministryName,
    value: countMembersByMinistry(min.ministryId),
    color: COLORS[index % COLORS.length]
  })).filter(item => item.value > 0);

  // Attendance trend data (last 6 months)
  const getAttendanceTrend = () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const last6Months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = monthNames[date.getMonth()];
      
      // Count attendance sessions for this month
      const sessionsInMonth = attendances.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate.getMonth() === date.getMonth() && 
               sessionDate.getFullYear() === date.getFullYear();
      });
      
      // Calculate total present members across all sessions in this month
      const totalPresent = sessionsInMonth.reduce((sum, session) => {
        return sum + (Array.isArray(session.present) ? session.present.length : 0);
      }, 0);
      
      // Calculate average attendance per session
      const avgAttendance = sessionsInMonth.length > 0 
        ? Math.round(totalPresent / sessionsInMonth.length)
        : 0;
      
      last6Months.push({
        month: monthName,
        attendance: avgAttendance,
        sessions: sessionsInMonth.length,
        totalPresent: totalPresent
      });
    }
    return last6Months;
  };

  const attendanceTrendData = getAttendanceTrend();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="text-center">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-8 border-emerald-200 border-t-emerald-600 mb-4"></div>
            <div className="absolute inset-0 inline-block animate-ping rounded-full h-20 w-20 border-4 border-emerald-300 opacity-20"></div>
          </div>
          <p className="text-gray-700 text-xl font-semibold animate-pulse">Loading your dashboard...</p>
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
            onClick={() => {
              hasFetched.current = false;
              fetchDashboard();
            }}
            className="w-full mt-4 bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Church Dashboard</h1>
              <p className="text-emerald-100 text-lg">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                  <span className="text-emerald-100 text-sm">Active Members</span>
                  <div className="text-2xl font-bold">{members.length}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                  <span className="text-emerald-100 text-sm">Total Records</span>
                  <div className="text-2xl font-bold">{attendances.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <MetricCard 
            title="Total Members" 
            value={members.length} 
            color="emerald" 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />}
          />
          <MetricCard 
            title="Active Ministries" 
            value={ministries.length} 
            color="teal" 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />}
          />
          <MetricCard 
            title="Total Activities" 
            value={activities.length} 
            color="cyan" 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
          />
          <MetricCard 
            title="Attendance Records" 
            value={attendances.length} 
            color="green" 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Members by Ministry Bar Chart - Takes 3 columns */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-emerald-100/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <IconBox color="from-emerald-500 to-teal-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </IconBox>
                Members by Ministry
              </h2>
              <div className="text-sm text-gray-500 font-medium">{members.length} total</div>
            </div>
            {ministries.length === 0 ? (
              <EmptyState message="No ministry data available" />
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={ministryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    labelFormatter={(value, payload) => {
                      const item = payload[0];
                      return item ? item.payload.fullName : value;
                    }}
                    formatter={(value, name) => {
                      if (name === 'members') return [value, 'Members'];
                      return [value + '%', 'Percentage'];
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="members" fill="#10b981" radius={[8, 8, 0, 0]} name="Members" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Activities Section - Takes 1 column */}
          <div className="space-y-4">
            <ActivityBox 
              title="Upcoming"
              activities={upcomingActivities}
              color="from-green-500 to-emerald-500"
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
              emptyMessage="No upcoming activities"
            />

            <ActivityBox 
              title="Recent"
              activities={recentActivities}
              color="from-blue-400 to-cyan-500"
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
              emptyMessage="No recent activities"
            />

            <ActivityBox 
              title="Accomplished"
              activities={accomplishedActivities}
              color="from-sky-400 to-blue-500"
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
              emptyMessage="No accomplished activities"
            />
          </div>
        </div>

        {/* Charts Row - Pie Chart and Line Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ministry Distribution Pie Chart */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-emerald-100/50">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-6">
              <IconBox color="from-purple-500 to-pink-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </IconBox>
              Ministry Distribution
            </h2>
            {pieChartData.length === 0 ? (
              <EmptyState message="No data available" />
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Attendance Trend Line Chart */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-emerald-100/50">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-6">
              <IconBox color="from-orange-500 to-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </IconBox>
              Attendance Trend (Last 6 Months)
            </h2>
            <div className="mb-4 text-sm text-gray-600">
              <p>Average attendance per session by month</p>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={attendanceTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value, name, props) => {
                    if (name === 'attendance') {
                      return [
                        <div key="tooltip">
                          <div>Avg Attendance: {value}</div>
                          <div className="text-xs text-gray-500">Sessions: {props.payload.sessions}</div>
                          <div className="text-xs text-gray-500">Total Present: {props.payload.totalPresent}</div>
                        </div>,
                        ''
                      ];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={{ fill: '#f97316', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Avg Attendance"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* All Ministries Section */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-emerald-100/50">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <IconBox color="from-teal-500 to-cyan-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </IconBox>
              <h2 className="text-2xl font-bold text-gray-800">All Ministries</h2>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Ministries</p>
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {ministries.length}
                </div>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Members</p>
                <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  {members.length}
                </div>
              </div>
            </div>
          </div>
          {ministries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-gray-500">No ministries found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {ministries.map((min, index) => {
                const memberCount = countMembersByMinistry(min.ministryId);
                const colorIndex = index % COLORS.length;
                const percentage = calculatePercentage(memberCount, members.length);
                
                return (
                  <div key={min.ministryId} className="group relative">
                    <div className="bg-white rounded-2xl p-5 hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-emerald-300 cursor-pointer h-full flex flex-col items-center">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 mb-4"
                        style={{ backgroundColor: COLORS[colorIndex] }}
                      >
                        {min.ministryName.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-center flex-1 flex flex-col justify-between w-full">
                        <h3 className="font-bold text-gray-800 text-sm mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2 min-h-[2.5rem]">
                          {min.ministryName}
                        </h3>
                        <div>
                          <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                            {memberCount}
                          </div>
                          <p className="text-xs text-gray-500 font-medium">members</p>
                          <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                            <div 
                              className="h-1.5 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: COLORS[colorIndex]
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 font-medium">{percentage}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const COLORS = ['#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#84cc16'];

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="font-bold text-sm"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function MetricCard({ title, value, color, icon }) {
  const colors = {
    emerald: 'from-emerald-500 to-emerald-600',
    teal: 'from-teal-500 to-teal-600',
    cyan: 'from-cyan-500 to-cyan-600',
    green: 'from-green-500 to-green-600'
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
      <div className={`bg-gradient-to-br ${colors[color]} p-6 relative`}>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
          </div>
        </div>
        <div className="text-white relative z-10">
          <div className="text-4xl font-bold mb-1">{value}</div>
          <div className="text-sm font-medium text-white/90">{title}</div>
        </div>
      </div>
    </div>
  );
}

function IconBox({ children, color }) {
  return (
    <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg`}>
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{children}</svg>
    </div>
  );
}

function ActivityBox({ title, activities, color, icon, emptyMessage }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-4 border border-gray-100/50 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg`}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <p className="text-xs text-gray-600">{activities.length} {activities.length === 1 ? 'activity' : 'activities'}</p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {activities.map((activity) => (
            <div key={activity.activityId} className="group bg-gradient-to-br from-gray-50 to-green-50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-green-300 cursor-pointer">
              <h3 className="font-bold text-gray-800 text-sm group-hover:text-green-700 transition-colors mb-2 leading-snug">
                {activity.activity || activity.activityName || activity.name}
              </h3>
              <div className="flex flex-col gap-1.5 text-xs">
                {activity.date && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">
                      {new Date(activity.date).toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                {activity.time && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{activity.time}</span>
                  </div>
                )}
                {activity.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">{activity.location}</span>
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

function EmptyState({ message }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}