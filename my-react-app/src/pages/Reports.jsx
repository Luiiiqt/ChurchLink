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

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Attendance Reports</h1>

        {/* Report Type Selector */}
        <div className="flex gap-4 mb-6 flex-wrap">
          {["weekly", "monthly", "quarterly", "yearly"].map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-4 py-2 rounded-xl font-semibold ${
                reportType === type
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-white text-gray-800 border border-gray-300 hover:bg-green-50"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading / Error */}
        {loading && <p className="text-gray-600">Loading report...</p>}
        {error && <p className="text-red-600">{JSON.stringify(error)}</p>}

        {/* Chart */}
        {!loading && reportData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
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
                color="#3B82F6"
              />
            )}
            {reportType === "yearly" && (
              <BarChart
                data={reportData}
                title="Yearly Attendance Trend"
                dataKey="count"
                labelKey="year"
                color="#F59E0B"
              />
            )}
          </div>
        )}

        {!loading && reportData.length === 0 && !error && (
          <p className="text-gray-500 mt-6">No records found for selected period.</p>
        )}
      </div>
    </div>
  );
}
