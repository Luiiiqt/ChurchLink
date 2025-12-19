import { useEffect, useState } from "react";
import { authFetch } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import BarChart from "../components/dashboard/BarChart";
import LineChart from "../components/dashboard/LineChart";

export default function Reports() {
  const { token } = useAuth();

  const [reportType, setReportType] = useState("weekly");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* =========================
     FETCH REPORT
  ========================= */
  const fetchReport = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authFetch(`/reports/attendance?type=${type}`, {}, token);
      // Aggregate data depending on type
      let chartData = [];
      if (type === "weekly") chartData = aggregateByDate(data);
      else if (type === "monthly") chartData = aggregateByMonth(data);
      else if (type === "quarterly") chartData = aggregateByQuarter(data);
      else if (type === "yearly") chartData = aggregateByYear(data);

      setReportData(chartData);
    } catch (err) {
      console.error(err);
      setError(err.errors || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchReport(reportType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType]);

  /* =========================
     HELPER FUNCTIONS
  ========================= */
  const aggregateByDate = (data) => {
    const map = {};
    data.forEach((a) => {
      const date = new Date(a.date).toLocaleDateString();
      map[date] = (map[date] || 0) + 1;
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  };

  const aggregateByMonth = (data) => {
    const map = {};
    data.forEach((a) => {
      const d = new Date(a.date);
      const month = `${d.getMonth() + 1}-${d.getFullYear()}`;
      map[month] = (map[month] || 0) + 1;
    });
    return Object.entries(map).map(([month, count]) => ({ month, count }));
  };

  const aggregateByQuarter = (data) => {
    const map = {};
    data.forEach((a) => {
      const d = new Date(a.date);
      const q = Math.floor(d.getMonth() / 3) + 1;
      const key = `Q${q}-${d.getFullYear()}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([quarter, count]) => ({ quarter, count }));
  };

  const aggregateByYear = (data) => {
    const map = {};
    data.forEach((a) => {
      const y = new Date(a.date).getFullYear();
      map[y] = (map[y] || 0) + 1;
    });
    return Object.entries(map).map(([year, count]) => ({ year, count }));
  };

  const getReportIcon = (type) => {
    const icons = {
      weekly: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      ),
      monthly: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      ),
      quarterly: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      ),
      yearly: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      )
    };
    return icons[type];
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold">Attendance Reports</h1>
                  <p className="text-emerald-100 text-lg mt-1">Analyze attendance trends and patterns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-emerald-100/50">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Select Report Type
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["weekly", "monthly", "quarterly", "yearly"].map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`group relative px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  reportType === type
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-emerald-300 hover:shadow-md"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <svg className={`w-8 h-8 ${reportType === type ? 'text-white' : 'text-emerald-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {getReportIcon(type)}
                  </svg>
                  <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </div>
                {reportType === type && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-emerald-100/50">
            <div className="relative inline-block">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-emerald-200 border-t-emerald-600 mb-4"></div>
              <div className="absolute inset-0 inline-block animate-ping rounded-full h-16 w-16 border-4 border-emerald-300 opacity-20"></div>
            </div>
            <p className="text-gray-700 text-xl font-semibold animate-pulse">Loading report data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white border-l-4 border-red-500 p-8 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Error Loading Report</h3>
                <p className="text-red-600 font-medium">{JSON.stringify(error)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Chart Display */}
        {!loading && reportData.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-emerald-100/50">
            <div className="mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
                    </h2>
                    <p className="text-sm text-gray-500">{reportData.length} data points</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
                  <span className="text-emerald-700 font-semibold text-sm">Last Updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {reportType === "weekly" && (
                <LineChart
                  data={reportData}
                  title="Weekly Attendance Trend"
                  dataKey="count"
                  labelKey="date"
                />
              )}
              {reportType === "monthly" && (
                <BarChart
                  data={reportData}
                  title="Monthly Attendance Trend"
                  dataKey="count"
                  labelKey="month"
                  color="#10B981"
                />
              )}
              {reportType === "quarterly" && (
                <BarChart
                  data={reportData}
                  title="Quarterly Attendance Trend"
                  dataKey="count"
                  labelKey="quarter"
                  color="#14B8A6"
                />
              )}
              {reportType === "yearly" && (
                <BarChart
                  data={reportData}
                  title="Yearly Attendance Trend"
                  dataKey="count"
                  labelKey="year"
                  color="#06B6D4"
                />
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && reportData.length === 0 && !error && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-emerald-100/50">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h3>
            <p className="text-gray-500 text-lg">No attendance records found for the selected {reportType} period.</p>
            <p className="text-sm text-gray-400 mt-2">Try selecting a different report type or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}