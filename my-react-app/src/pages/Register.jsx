// src/pages/Register.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

const Register = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(username.trim(), password);
      alert("Registered — please login");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Top Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none animate-waveSlideDown">
        <svg className="relative block w-full h-32 animate-wavePulse" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-green-400"></path>
        </svg>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180 animate-waveSlideUp">
        <svg className="relative block w-full h-32 animate-wavePulse" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ animationDelay: "1s" }}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-emerald-400"></path>
        </svg>
      </div>

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-particle1"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-emerald-400 rounded-full animate-particle2"></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-teal-400 rounded-full animate-particle3"></div>
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-green-300 rounded-full animate-particle4"></div>
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-emerald-300 rounded-full animate-particle5"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Left Registration Form */}
          <div className="w-full lg:w-5/12 bg-white rounded-3xl shadow-2xl p-8 lg:p-10 animate-slideUp hover:shadow-3xl transition-shadow duration-500">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 animate-fadeInScale">
              Create Account
            </h2>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6 flex items-start animate-fadeIn">
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl outline-none focus:border-green-400 transition-all duration-300 hover:border-gray-400 focus:shadow-lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl outline-none focus:border-green-400 transition-all duration-300 hover:border-gray-400 focus:shadow-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl outline-none focus:border-green-400 transition-all duration-300 hover:border-gray-400 focus:shadow-lg"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl hover:from-green-500 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed animate-fadeIn"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              <p className="mt-4 text-center text-sm text-gray-600 animate-fadeIn">
                Already have an account?{" "}
                <Link to="/login" className="text-green-600 font-semibold hover:text-green-700 hover:underline transition-all duration-300">
                  Login here
                </Link>
              </p>
            </form>
          </div>

          {/* Right Info */}
          <div className="w-full lg:w-1/2 animate-slideRight">
            <h1 className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 animate-gradientText">
              ChurchLink
            </h1>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 animate-slideInLeft">
              Join Our Community!
            </h2>
            <p className="text-lg text-gray-700 mb-10 leading-relaxed animate-fadeIn">
              Become part of our growing faith community. Connect with others, stay updated on events, and grow spiritually together.
            </p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slideRight { from { transform: translateX(-30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes waveSlideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes waveSlideUp { from { transform: translateY(100%) rotate(180deg); opacity: 0; } to { transform: translateY(0) rotate(180deg); opacity: 1; } }
        @keyframes wavePulse { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.05); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideInLeft { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes gradientText { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes particle1 { 0%,100%{transform:translate(0,0) scale(1);opacity:0.3;}50%{transform:translate(20px,-20px) scale(1.2);opacity:0.6;} }
        @keyframes particle2 { 0%,100%{transform:translate(0,0) scale(1);opacity:0.4;}50%{transform:translate(-30px,30px) scale(1.3);opacity:0.7;} }
        @keyframes particle3 { 0%,100%{transform:translate(0,0) scale(1);opacity:0.3;}50%{transform:translate(25px,25px) scale(1.1);opacity:0.5;} }
        @keyframes particle4 { 0%,100%{transform:translate(0,0) scale(1);opacity:0.4;}50%{transform:translate(-20px,-30px) scale(1.2);opacity:0.6;} }
        @keyframes particle5 { 0%,100%{transform:translate(0,0) scale(1);opacity:0.3;}50%{transform:translate(30px,-25px) scale(1.4);opacity:0.7;} }

        .animate-slideRight { animation: slideRight 0.8s ease-out; }
        .animate-slideUp { animation: slideUp 0.8s ease-out; }
        .animate-waveSlideDown { animation: waveSlideDown 1s ease-out; }
        .animate-waveSlideUp { animation: waveSlideUp 1s ease-out; }
        .animate-wavePulse { animation: wavePulse 8s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out both; }
        .animate-fadeInScale { animation: fadeInScale 0.8s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out both; }
        .animate-gradientText { background-size: 200% 200%; animation: gradientText 3s ease infinite; }
        .animate-particle1 { animation: particle1 6s ease-in-out infinite; }
        .animate-particle2 { animation: particle2 8s ease-in-out infinite; }
        .animate-particle3 { animation: particle3 7s ease-in-out infinite; }
        .animate-particle4 { animation: particle4 9s ease-in-out infinite; }
        .animate-particle5 { animation: particle5 7.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Register;