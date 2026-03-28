import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DEMO_IDS = [
  "69c6233df84856e3a6d12872",
  "69c62372f84856e3a6d12878",
];

function Dashboard() {
  const navigate = useNavigate();

  const [scores, setScores] = useState({
    sleep: 0,
    nutrition: 0,
    wellness: 0,
    ritual: 0,
    sleepStreak: 0,
    health: 0,
  });

  // ✅ DEMO FALLBACK
  const generateFallback = () => ({
    sleep: Math.floor(60 + Math.random() * 40),
    nutrition: Math.floor(1800 + Math.random() * 600),
    wellness: Math.floor(2 + Math.random() * 3),
    ritual: Math.floor(50 + Math.random() * 50),
    sleepStreak: Math.floor(2 + Math.random() * 10),
  });

  const applyFallback = () => {
    const fallback = generateFallback();
    setScores({
      ...fallback,
      health: fallback.sleep + fallback.ritual + fallback.wellness,
    });
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        // ✅ FIX: check by _id, not by email string
        const isDemoUser = DEMO_IDS.includes(user?._id);

        const res = await fetch(
          "https://wellness-tracker-backend-4if1.onrender.com/api/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // ✅ FIX: if server errors (500), use fallback for demo, empty for new user
        if (!res.ok) {
          console.warn("Dashboard API error:", res.status);
          if (isDemoUser) {
            applyFallback();
          }
          return;
        }

        const data = await res.json();

        console.log("DASHBOARD DATA:", data);

        // ✅ If the response itself is an error object
        if (data?.message) {
          console.warn("Dashboard returned error message:", data.message);
          if (isDemoUser) {
            applyFallback();
          }
          return;
        }

        // ✅ REAL DATA — use what the server gave us
        const sleep = data.sleepConsistencyScore ?? (isDemoUser ? generateFallback().sleep : 0);
        const nutrition = data.consumedCalories ?? (isDemoUser ? generateFallback().nutrition : 0);
        const wellness = data.mood ?? (isDemoUser ? generateFallback().wellness : 0);
        const ritual = data.ritualScore ?? (isDemoUser ? generateFallback().ritual : 0);
        const sleepStreak = data.sleepStreak ?? (isDemoUser ? generateFallback().sleepStreak : 0);

        setScores({
          sleep,
          nutrition,
          wellness,
          ritual,
          sleepStreak,
          health: sleep + ritual + wellness,
        });
      } catch (err) {
        console.error(err);

        // ✅ ERROR CASE — only demo gets fallback
        const user = JSON.parse(localStorage.getItem("user"));
        const isDemoUser = DEMO_IDS.includes(user?._id);

        if (isDemoUser) {
          applyFallback();
        } else {
          setScores({
            sleep: 0,
            nutrition: 0,
            wellness: 0,
            ritual: 0,
            sleepStreak: 0,
            health: 0,
          });
        }
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Today's Dashboard 📊
      </h2>

      {/* Health Score */}
      <div className="bg-blue-600 text-white p-6 rounded-xl mb-6">
        <h3 className="text-lg">Health Score</h3>
        <p className="text-4xl font-bold">{scores.health}</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4">

        <div
          onClick={() => navigate("/sleep")}
          className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-100"
        >
          <h3>Sleep</h3>
          <p className="text-2xl font-bold">{scores.sleep}</p>
        </div>

        <div
          onClick={() => navigate("/nutrition")}
          className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-100"
        >
          <h3>Nutrition</h3>
          <p className="text-2xl font-bold">{scores.nutrition}</p>
        </div>

        <div
          onClick={() => navigate("/wellness")}
          className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-100"
        >
          <h3>Wellness</h3>
          <p className="text-2xl font-bold">{scores.wellness}</p>
        </div>

        <div
          onClick={() => navigate("/ritual")}
          className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-100"
        >
          <h3>Ritual</h3>
          <p className="text-2xl font-bold">{scores.ritual}</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;