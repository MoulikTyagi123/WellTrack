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
  Legend,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard() {
  const [, setStats] = useState({});
  const [data, setData] = useState([]);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [appliedUsers, setAppliedUsers] = useState([]);

  // ✅ DEMO IDS
  const DEMO_IDS = [
    "69c6233df84856e3a6d12872",
    "69c62372f84856e3a6d12878",
  ];

  // ✅ FALLBACK
  const generateFallback = () => ({
    sleep: Math.floor(60 + Math.random() * 40),
    calories: Math.floor(1800 + Math.random() * 600),
    mood: Math.floor(2 + Math.random() * 3),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const statsRes = await axios.get(
          "https://wellness-tracker-backend-4if1.onrender.com/api/admin/stats",
          { headers: { Authorization: `Bearer ${token}`  } }
        );

        const analyticsRes = await axios.get(
          "https://wellness-tracker-backend-4if1.onrender.com/api/admin/analytics",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        let raw = analyticsRes.data.data || [];

        // ✅ STEP 1: Ensure TODAY exists
        const today = new Date().toISOString().split("T")[0];
        const hasToday = raw.some((r) => r.date?.startsWith(today));

        if (!hasToday) {
          raw.push({ date: new Date().toISOString() });
        }

        // ✅ STEP 2: Collect ALL users (even if no values)
        const allUsers = new Set();

        raw.forEach((row) => {
          Object.keys(row).forEach((key) => {
            if (key !== "date" && key.includes("_")) {
              allUsers.add(key.split("_")[0]);
            }
          });
        });

        // ✅ FORCE ADD DEMO USERS
        DEMO_IDS.forEach((id) => allUsers.add(id));

        // ✅ STEP 3: Fill missing values
       // ✅ STEP 3: Fill missing values (FIXED LOGIC)
const processed = raw.map((row) => {
  const newRow = { date: row.date };

  allUsers.forEach((userId) => {
    ["sleep", "calories", "mood"].forEach((type) => {
      const key = `${userId}_${type}`;

      if (row[key] !== undefined && row[key] !== null) {
        newRow[key] = row[key];
      } else {
        // ✅ ONLY DEMO USERS GET FALLBACK
        if (DEMO_IDS.includes(userId)) {
          const fallback = generateFallback();
          newRow[key] = fallback[type];
        } else {
          newRow[key] = null;
        }
      }
    });
  });

  return newRow;
});

        setStats(statsRes.data || {});
        setData(processed);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // ✅ USERS (NOW ALWAYS COMPLETE)
  const users = [
    ...new Set(
      data.flatMap((item) =>
        Object.keys(item)
          .filter((k) => k.includes("_"))
          .map((k) => k.split("_")[0])
      )
    ),
  ];

  const handleCheckbox = (user) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== user));
    } else {
      if (selectedUsers.length >= 10) {
        alert("Max 10 users allowed");
        return;
      }
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const applySelection = () => {
    setAppliedUsers(selectedUsers);
  };

  const colors = ["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899"];

  const renderChart = (type, title) => (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      {appliedUsers.length === 0 ? (
        <p className="text-gray-400 text-center">
          Select users and click "Apply"
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />

            {appliedUsers.map((user, index) => (
              <Line
                key={`${user}_${type}`}
                dataKey={`${user}_${type}`}
                stroke={colors[index % colors.length]}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );

  const downloadCSV = () => {
    if (appliedUsers.length === 0) return alert("Select users first");

    const filtered = data.map((row) => {
      const newRow = { date: row.date };

      appliedUsers.forEach((user) => {
        Object.keys(row).forEach((key) => {
          if (key.startsWith(user)) {
            newRow[key] = row[key];
          }
        });
      });

      return newRow;
    });

    exportToCSV(filtered, "admin_selected_users.csv");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <button onClick={downloadCSV} className="mb-6 bg-green-600 text-white px-4 py-2 rounded">
        Download CSV
      </button>

      <div className="mb-6 bg-white p-4 rounded-xl shadow-md max-w-md">
        <h3>Select Users (max 10)</h3>

        {users.map((user) => (
          <label key={user} className="block">
            <input
              type="checkbox"
              checked={selectedUsers.includes(user)}
              onChange={() => handleCheckbox(user)}
            />
            {user}
          </label>
        ))}

        <button onClick={applySelection} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full">
          Apply
        </button>
      </div>

      <div className="grid gap-6">
        {renderChart("sleep", "Sleep")}
        {renderChart("calories", "Calories")}
        {renderChart("mood", "Mood")}
      </div>
    </div>
  );
}

export default AdminDashboard;