import { useState } from "react";
import { registerUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ NEW: modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      setLoading(true);

      const res = await registerUser({ name, email, password });

      // ✅ Show the server message in a modal instead of alert
      const message =
        res?.data?.message ||
        "Account created successfully! You can login now. A verification email has been sent if your email is valid — check your inbox to verify. You can also login directly without verifying.";

      setModalMessage(message);
      setShowModal(true);
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <div className="bg-white p-8 shadow-md rounded w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded disabled:bg-gray-400"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

      </div>

      {/* ✅ VERIFICATION POPUP MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">

            <div className="text-center mb-4">
              <div className="text-green-500 text-5xl mb-3">✅</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Account Created!
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {modalMessage}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-sm text-blue-700">
              <strong>Note:</strong> You can login directly without verifying your email. If you provided a real email, check your inbox to verify anytime.
            </div>

            <button
              onClick={handleModalClose}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Go to Login
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default Signup;