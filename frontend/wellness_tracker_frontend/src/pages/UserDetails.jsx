import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { exportToCSV } from "../utils/exportCSV";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const DEMO_IDS = [
  "69c6233df84856e3a6d12872",
  "69c62372f84856e3a6d12878",
];

const UserDetails = () => {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [insights, setInsights] = useState([]);
  const [range, setRange] = useState(7);

  const isDemoUser = DEMO_IDS.includes(id);

  const generateFallback = () => ({
    sleep: parseFloat((5 + Math.random() * 4).toFixed(2)),
    calories: Math.floor(1800 + Math.random() * 600),
    mood: Math.floor(2 + Math.random() * 3),
  });

  // ✅ Build full fallback array for demo user (all days filled)
  const buildDemoFallback = (numDays) => {
    const fallbackData = [];
    for (let i = numDays - 1; i >= 0; i--) {
      const f = generateFallback();
      const d = new Date();
      d.setDate(d.getDate() - i);
      fallbackData.push({
        date: d.toISOString().split("T")[0],
        ...f,
      });
    }
    return fallbackData;
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");

        const userRes = await axios.get(
          `https://wellness-tracker-backend-4if1.onrender.com/api/admin/users/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const analyticsRes = await axios.get(
          `https://wellness-tracker-backend-4if1.onrender.com/api/admin/users/${id}/analytics?range=${range}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const rawData = analyticsRes.data.data || [];

        let processed;

        if (isDemoUser) {
          // ✅ FIX: for demo users, build a complete date series with fallback for missing days
          const dateMap = {};
          rawData.forEach((item) => {
            dateMap[item.date] = item;
          });

          processed = [];
          for (let i = range - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split("T")[0];
            const existing = dateMap[dateStr];
            const f = generateFallback();

            processed.push({
              date: dateStr,
              sleep: existing?.sleep ?? f.sleep,
              calories: existing?.calories ?? f.calories,
              mood: existing?.mood ?? f.mood,
            });
          }
        } else {
          processed = rawData.map((item) => ({
            date: item.date,
            sleep: item.sleep ?? null,
            calories: item.calories ?? null,
            mood: item.mood ?? null,
          }));
        }

        setUser(userRes.data);
        setAnalytics(processed);

        // ✅ FIX: always set some insights
        const hasData = processed.some(
          (d) => d.sleep !== null || d.calories !== null || d.mood !== null
        );
        setInsights(
          hasData
            ? ["Data loaded — select a metric to view trends."]
            : ["No entries yet for this user."]
        );
      } catch (err) {
        console.error(err);

        if (isDemoUser) {
          // ✅ FIX: even on error, show fallback for demo users
          const fallbackData = buildDemoFallback(range);
          setAnalytics(fallbackData);
          setInsights(["Demo data — showing sample analytics."]);
        } else {
          setAnalytics([]);
          setInsights(["No data available for this range."]);
        }
      }
    };

    fetchAll();
  }, [id, range]);

  // ✅ FIX: proper CSV filename
  const handleDownloadCSV = () => {
    const username = user?.name?.replace(/\s+/g, "_") || "user";
    const filename = `${username}_${range}days_analytics.csv`;
    exportToCSV(analytics, filename);
  };

  if (!user && analytics.length === 0) return <h2 className="p-6">Loading...</h2>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {user?.name || "User"} Analytics
        {isDemoUser && (
          <span className="ml-2 text-sm text-blue-500 bg-blue-50 px-2 py-1 rounded font-normal">
            Demo User
          </span>
        )}
      </h1>

      {/* Range selector */}
      <div className="flex gap-3 mb-6">
        {[7, 15, 30].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-2 rounded font-medium border transition ${
              range === r
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Last {r} Days
          </button>
        ))}
      </div>

      {/* ✅ INSIGHTS — always rendered on UI */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h3 className="font-semibold mb-2">📊 Insights</h3>
        {insights.length === 0 ? (
          <p className="text-gray-400 text-sm">Loading insights...</p>
        ) : (
          insights.map((insight, idx) => (
            <p key={idx} className="text-sm text-gray-700">
              • {insight}
            </p>
          ))
        )}
      </div>

      {/* CSV Button */}
      <button
        onClick={handleDownloadCSV}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded"
      >
        Download CSV
      </button>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow p-4">
        {analytics.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            No data to display. User has not logged any entries yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                dataKey="sleep"
                stroke="#3b82f6"
                name="Sleep (hrs)"
                connectNulls
                dot={{ r: 3 }}
              />
              <Line
                dataKey="calories"
                stroke="#10b981"
                name="Calories"
                connectNulls
                dot={{ r: 3 }}
              />
              <Line
                dataKey="mood"
                stroke="#f59e0b"
                name="Mood"
                connectNulls
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default UserDetails;