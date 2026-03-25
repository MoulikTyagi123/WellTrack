import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Landing() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleDemoLogin = async (email, password) => {
    try {
      const res = await axios.post(
        "https://wellness-tracker-backend-4if1.onrender.com/api/auth/login",
        { email, password }
      );

      login(res.data);

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Demo login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] text-gray-800 relative overflow-hidden">

      {/* 🌊 BACKGROUND */}
      <div className="absolute inset-0">

        {/* 🔥 BLOBS */}
        <div className="absolute w-[700px] h-[700px] bg-[#031A6B]/30 blur-[180px] rounded-full top-[-250px] left-[-200px] animate-float1" />
        <div className="absolute w-[600px] h-[600px] bg-[#033860]/30 blur-[160px] rounded-full top-[20%] right-[-200px] animate-float2" />
        <div className="absolute w-[600px] h-[600px] bg-[#087CA7]/30 blur-[160px] rounded-full bottom-[-250px] left-[20%] animate-float3" />
        <div className="absolute w-[500px] h-[500px] bg-[#05B2DC]/30 blur-[160px] rounded-full bottom-[-200px] right-[10%] animate-float4" />

        {/* ✨ MANY FREE-FLOATING BUBBLES */}

        {[
          "w-16 h-16 top-[10%] left-[20%]",
          "w-20 h-20 top-[60%] left-[80%]",
          "w-14 h-14 top-[30%] left-[10%]",
          "w-18 h-18 top-[75%] left-[40%]",
          "w-12 h-12 top-[20%] left-[60%]",
          "w-10 h-10 top-[70%] left-[50%]",
          "w-14 h-14 top-[45%] left-[85%]",
          "w-12 h-12 top-[65%] left-[15%]",
          "w-10 h-10 top-[15%] left-[35%]",
          "w-8 h-8 top-[85%] left-[75%]",
          "w-6 h-6 top-[55%] left-[25%]",
          "w-9 h-9 top-[30%] left-[55%]",
          "w-7 h-7 top-[90%] left-[10%]",
          "w-8 h-8 top-[40%] left-[35%]",
          "w-12 h-12 top-[5%] left-[85%]",
          "w-10 h-10 top-[95%] left-[60%]",
          "w-14 h-14 top-[50%] left-[5%]",
          "w-16 h-16 top-[25%] left-[75%]",
          "w-18 h-18 top-[80%] left-[55%]",
          "w-12 h-12 top-[35%] left-[25%]"
        ].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} rounded-full bg-[#05B2DC]/20 animate-floatRandom`}
            style={{
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${6 + (i % 5)}s`,
            }}
          />
        ))}

        {/* 🌈 GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#05B2DC]/10 to-transparent animate-gradientMove" />
      </div>

      {/* ✨ CENTER GLOW */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-white/40 blur-[120px] rounded-full" />
      </div>

      {/* 🔥 MAIN */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-32">

        <h1 className="text-3xl md:text-4xl font-medium text-gray-500 mb-6">
          Design your life
        </h1>

        <h2 className="leading-tight mb-6">
          <span className="block text-5xl md:text-6xl font-semibold bg-gradient-to-r from-[#031A6B] via-[#087CA7] to-[#05B2DC] bg-clip-text text-transparent">
            WellTrack  
          </span>
        </h2>

        <p className="text-gray-600 text-lg mb-14">
          Small habits. Big clarity.
        </p>

        <div className="flex flex-wrap justify-center gap-6">

          <button
            onClick={() => navigate("/signup")}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-[#031A6B] to-[#05B2DC] text-white text-lg font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition duration-300"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-10 py-4 rounded-full bg-white border border-gray-300 text-lg font-semibold hover:bg-gray-100 hover:shadow-md transition duration-300"
          >
            Login
          </button>

          <button
            onClick={() => handleDemoLogin("demo@user.com", "123456")}
            className="px-10 py-4 rounded-full bg-[#087CA7] text-white text-lg font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition duration-300"
          >
            Demo User
          </button>

          <button
            onClick={() => handleDemoLogin("demo@admin.com", "123456")}
            className="px-10 py-4 rounded-full bg-[#033860] text-white text-lg font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition duration-300"
          >
            Demo Admin
          </button>

        </div>
      </div>

      {/* 🔥 ADVANCED ANIMATIONS */}
      <style jsx>{`
        @keyframes floatRandom {
          0% { transform: translate(0px, 0px) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-25px, -10px) scale(0.9); }
          75% { transform: translate(15px, 20px) scale(1.05); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        @keyframes float1 {
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-40px)}
        }

        @keyframes float2 {
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-25px)}
        }

        @keyframes float3 {
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-35px)}
        }

        @keyframes float4 {
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-20px)}
        }

        @keyframes gradientMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-floatRandom {
          animation: floatRandom ease-in-out infinite;
        }

        .animate-float1 { animation: float1 8s ease-in-out infinite; }
        .animate-float2 { animation: float2 6s ease-in-out infinite; }
        .animate-float3 { animation: float3 7s ease-in-out infinite; }
        .animate-float4 { animation: float4 5s ease-in-out infinite; }

        .animate-gradientMove {
          animation: gradientMove 12s linear infinite;
        }
      `}</style>

    </div>
  );
}

export default Landing;