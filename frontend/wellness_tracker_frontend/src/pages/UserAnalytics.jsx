import { useEffect, useState } from "react";
import axios from "axios";
import { exportToCSV } from "../utils/exportCSV";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const DEMO_IDS = [
  "69c6233df84856e3a6d12872",
  "69c62372f84856e3a6d12878",
];

function UserAnalytics() {
  const [safeData, setSafeData] = useState([]);
  const [insights, setInsights] = useState([]);
  const [tab, setTab] = useState("sleep");
  const [range, setRange] = useState("7");

  const user = JSON.parse(localStorage.getItem("user"));
  const isDemoUser = DEMO_IDS.includes(user?._id);

  const generateFallback = () => ({
    sleep: parseFloat((5 + Math.random() * 4).toFixed(2)),
    calories: Math.floor(1800 + Math.random() * 600),
    mood: Math.floor(2 + Math.random() * 3),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `https://wellness-tracker-backend-4if1.onrender.com/api/dashboard/my-analytics?range=${range}&type=${tab}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const raw = res.data.data || [];
        const serverInsights = res.data.insights || [];

        const processed = raw.map((item) => {
          if (isDemoUser) {
            const f = generateFallback();
            return {
              date: item.date,
              sleep: item.sleep ?? f.sleep,
              calories: item.calories ?? f.calories,
              mood: item.mood ?? f.mood,
            };
          }

          return {
            date: item.date,
            sleep: item.sleep ?? null,
            calories: item.calories ?? null,
            mood: item.mood ?? null,
          };
        });

        setSafeData(processed);

        // ✅ FIX: always set insights — even if empty show placeholder
        setInsights(
          serverInsights.length > 0
            ? serverInsights
            : ["No insights yet — log more data to see trends!"]
        );
      } catch (err) {
        console.error(err);

        if (isDemoUser) {
          const fallback = Array.from({ length: parseInt(range) }, (_, i) => {
            const f = generateFallback();
            const d = new Date();
            d.setDate(d.getDate() - (parseInt(range) - 1 - i));
            return {
              date: d.toISOString().split("T")[0],
              ...f,
            };
          });

          setSafeData(fallback);
          setInsights(["Demo data — log real entries to see your insights!"]);
        } else {
          setSafeData([]);
          setInsights(["No data available for this range."]);
        }
      }
    };

    fetchData();
  }, [range, tab]);

  // ✅ FIX: proper CSV filename — e.g. "sleep_7days_analytics.csv"
  const handleDownloadCSV = () => {
    const filename = `${tab}_${range}days_analytics.csv`;
    exportToCSV(safeData, filename);
  };

  const tabLabels = { sleep: "Sleep (hrs)", calories: "Calories", mood: "Mood" };
  const lineColors = { sleep: "#3b82f6", calories: "#10b981", mood: "#f59e0b" };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Analytics</h1>

      {/* ✅ CSV BUTTON with proper filename */}
      <button
        onClick={handleDownloadCSV}
        className="mb-4 bg-green-600 text-white px-3 py-1 rounded"
      >
        Download CSV
      </button>

      {/* Range selector */}
      <div className="flex gap-4 mb-4">
        {["7", "15", "30"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-1 rounded font-medium border transition ${
              range === r
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Last {r} Days
          </button>
        ))}
      </div>

      {/* Tab selector */}
      <div className="flex gap-4 mb-6">
        {["sleep", "calories", "mood"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1 rounded font-medium border transition capitalize ${
              tab === t
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ✅ INSIGHTS — always rendered on UI */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">
          📊 Insights — {tabLabels[tab]}
        </h3>
        {insights.length === 0 ? (
          <p className="text-gray-400 text-sm">Calculating insights...</p>
        ) : (
          <ul className="space-y-1">
            {insights.map((insight, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                • {insight}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow p-4">
        {safeData.every((d) => d[tab] === null) && !isDemoUser ? (
          <p className="text-center text-gray-400 py-8">
            No {tab} data for this range. Start logging to see your chart!
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={safeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                dataKey={tab}
                stroke={lineColors[tab]}
                connectNulls
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default UserAnalytics;