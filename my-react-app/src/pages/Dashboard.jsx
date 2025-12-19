import { useEffect, useState, useCallback, useRef } from "react";
import { authFetch } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6'];

// Reusable Components
const MetricCard = ({ title, value, color, icon }) => (
  <div className={`bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200`}>
    <div className="flex items-center justify-between mb-4">
      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
      </div>
    </div>
    <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
    <p className="text-4xl font-bold">{value}</p>
  </div>
);

const IconBox = ({ color, children }) => (
  <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg`}>
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{children}</svg>
  </div>
);

const ActivityBox = ({ title, activities, color, icon, emptyMessage }) => (
  <div className="bg-white rounded-2xl shadow-xl p-6 border border-emerald-100/50">
    <h3 className={`text-lg font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent flex items-center gap-2 mb-4`}>
      <div className={`w-8 h-8 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center`}>
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
      </div>
      {title}
    </h3>
    <div className="space-y-2">
      {activities.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">{emptyMessage}</p>
      ) : (
        activities.slice(0, 5).map((activity, idx) => (
          <div key={idx} className="p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {activity.activity || activity.activityName}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(activity.date || activity.activityDate).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
    {activities.length > 5 && (
      <p className="text-xs text-gray-500 text-center mt-3">+{activities.length - 5} more</p>
    )}
  </div>
);

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    </div>
    <p className="text-gray-500 font-medium">{message}</p>
  </div>
);

// Utility Functions
const getTimeAgo = (date) => {
  if (!date) return 'Just now';
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now - then) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return then.toLocaleDateString();
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="font-bold text-sm">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Dashboard() {
  const { token } = useAuth();
  const [members, setMembers] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  const fetchDashboard = useCallback(async () => {
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
      generateRecentActivity(membersData, activitiesData, attendancesData);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
      hasFetched.current = false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchDashboard();
  }, [token, fetchDashboard]);

  const generateRecentActivity = (membersData, activitiesData, attendancesData) => {
    const activities = [];
    
    const recentMembers = [...(membersData || [])]
      .filter(m => !m.archived && m.createdAt)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 2);
    
    recentMembers.forEach(member => {
      activities.push({
        type: 'member', icon: 'user', color: 'from-green-400 to-emerald-500',
        title: 'New member registered',
        description: `${member.firstName} ${member.lastName} joined the church`,
        time: getTimeAgo(member.createdAt), iconBg: 'bg-green-100'
      });
    });
    
    const archivedMembers = [...(membersData || [])]
      .filter(m => m.archived && m.archivedAt)
      .sort((a, b) => new Date(b.archivedAt || 0) - new Date(a.archivedAt || 0))
      .slice(0, 2);
    
    archivedMembers.forEach(member => {
      activities.push({
        type: 'archived', icon: 'archive', color: 'from-orange-400 to-red-500',
        title: 'Member archived',
        description: `${member.firstName} ${member.lastName} was archived`,
        time: getTimeAgo(member.archivedAt), iconBg: 'bg-orange-100'
      });
    });
    
    const recentActivitiesData = [...(activitiesData || [])]
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 1);
    
    recentActivitiesData.forEach(activity => {
      activities.push({
        type: 'activity', icon: 'calendar', color: 'from-blue-400 to-cyan-500',
        title: 'New activity scheduled',
        description: `${activity.activity || activity.activityName} on ${new Date(activity.date).toLocaleDateString()}`,
        time: getTimeAgo(activity.createdAt || activity.date), iconBg: 'bg-blue-100'
      });
    });
    
    const recentAttendances = [...(attendancesData || [])]
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 1);
    
    recentAttendances.forEach(attendance => {
      const presentCount = Array.isArray(attendance.present) ? attendance.present.length : 0;
      activities.push({
        type: 'attendance', icon: 'check', color: 'from-purple-400 to-pink-500',
        title: 'Attendance recorded',
        description: `${presentCount} members present`,
        time: getTimeAgo(attendance.date), iconBg: 'bg-purple-100'
      });
    });
    
    setRecentActivity(activities.slice(0, 6));
  };

  const countMembersByMinistry = (ministryId) =>
    members.filter((m) => m.ministryId === ministryId).length;

  const calculatePercentage = (memberCount, totalMembers) => {
    if (totalMembers === 0) return "0.0";
    return ((memberCount / totalMembers) * 100).toFixed(1);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hasAttendance = (activityId) => {
    return attendances.some(session => 
      session.activityId === activityId || session.activity_id === activityId
    );
  };

  const accomplishedActivities = activities.filter(a => {
    const hasAttendanceRecord = hasAttendance(a.activityId || a.activity_id);
    const isMarkedCompleted = ['completed', 'accomplished', 'done'].includes(a.status);
    return hasAttendanceRecord || isMarkedCompleted;
  });

  const accomplishedIds = new Set(accomplishedActivities.map(a => a.activityId || a.activity_id));

  const upcomingActivities = activities.filter(a => {
    const activityId = a.activityId || a.activity_id;
    const activityDate = new Date(a.date || a.activityDate);
    const isNotAccomplished = !accomplishedIds.has(activityId);
    const isFuture = activityDate >= today;
    const isScheduled = ['upcoming', 'scheduled'].includes(a.status) || !a.status;
    return isNotAccomplished && (isFuture || isScheduled);
  });

  const recentActivities = activities.filter(a => {
    const activityId = a.activityId || a.activity_id;
    const activityDate = new Date(a.date || a.activityDate);
    const isNotAccomplished = !accomplishedIds.has(activityId);
    const isPast = activityDate < today;
    const isRecent = ['ongoing', 'recent'].includes(a.status);
    return isNotAccomplished && (isPast || isRecent);
  });

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

  const getAttendanceTrend = () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const last6Months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = monthNames[date.getMonth()];
      
      const sessionsInMonth = attendances.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate.getMonth() === date.getMonth() && 
               sessionDate.getFullYear() === date.getFullYear();
      });
      
      const totalPresent = sessionsInMonth.reduce((sum, session) => {
        return sum + (Array.isArray(session.present) ? session.present.length : 0);
      }, 0);
      
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
            color="emerald" 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />}
          />
          <MetricCard 
            title="Total Activities" 
            value={activities.length} 
            color="emerald" 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
          />
          <MetricCard 
            title="Attendance Records" 
            value={attendances.length} 
            color="emerald" 
            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Bar Chart */}
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
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
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

          {/* Activities Section */}
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
              color="from-green-500 to-emerald-500"
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
              emptyMessage="No recent activities"
            />
            <ActivityBox 
              title="Accomplished"
              activities={accomplishedActivities}
              color="from-green-500 to-emerald-500"
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
              emptyMessage="No accomplished activities"
            />
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pie Chart */}
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
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-emerald-100/50">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-6">
              <IconBox color="from-blue-500 to-cyan-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </IconBox>
              Recent Activity
            </h2>
            {recentActivity.length === 0 ? (
              <EmptyState message="No recent activity" />
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                    <div className={`flex-shrink-0 w-12 h-12 ${activity.iconBg} rounded-full flex items-center justify-center`}>
                      {activity.icon === 'user' && (
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                      {activity.icon === 'calendar' && (
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                      {activity.icon === 'check' && (
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {activity.icon === 'archive' && (
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Attendance Trend Line Chart */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-emerald-100/50 mb-8">
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
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value, name, props) => {
                  if (name === 'attendance') {
                    return [
                      <div key="tooltip">
                        <div>Avg Attendance: {value}</div>
                        <div className="text-xs text-gray-500">Sessions: {props.payload.sessions}</div>
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
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
                name="Avg Attendance"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}