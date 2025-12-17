// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { loginRequest } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);
    try {
      await loginRequest(username.trim(), password);
      setLoginSuccess(true);
      // Add slight delay to show success animation
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Login Success Overlay */}
      {loginSuccess && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center animate-fadeIn">
          <div className="relative">
            {/* Success Checkmark */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center animate-successBounce shadow-2xl">
              <svg className="w-12 h-12 text-white animate-checkmark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {/* Pulse Ring */}
            <div className="absolute inset-0 rounded-full bg-green-400 animate-successPulse"></div>
          </div>
          <h3 className="mt-8 text-2xl font-bold text-gray-900 animate-slideUp">Login Successful!</h3>
          <p className="mt-2 text-gray-600 animate-fadeIn" style={{ animationDelay: "0.2s" }}>Redirecting to dashboard...</p>
          {/* Loading Dots */}
          <div className="flex gap-2 mt-6">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-loadingDot1"></div>
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-loadingDot2"></div>
            <div className="w-3 h-3 bg-teal-400 rounded-full animate-loadingDot3"></div>
          </div>
        </div>
      )}

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
          {/* Left Info */}
          <div className="w-full lg:w-1/2 animate-slideRight">
            <h1 className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 animate-gradientText">
              ChurchLink
            </h1>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 animate-slideInLeft">
              Welcome Back!
            </h2>
            <p className="text-lg text-gray-700 mb-10 leading-relaxed animate-fadeIn">
              Connect with your faith community, stay updated on events, and grow spiritually together.
            </p>
          </div>

          {/* Right Login Form */}
          <div className="w-full lg:w-5/12 bg-white rounded-3xl shadow-2xl p-8 lg:p-10 animate-slideUp hover:shadow-3xl transition-shadow duration-500">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 animate-fadeInScale">
              Sign In
            </h2>
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6 animate-fadeIn">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-4 py-3 border-2 border-gray-300 rounded-xl outline-none focus:border-green-400 transition-all duration-300 hover:border-gray-400 focus:shadow-lg"
                required
                disabled={loading}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 py-3 border-2 border-gray-300 rounded-xl outline-none focus:border-green-400 transition-all duration-300 hover:border-gray-400 focus:shadow-lg"
                required
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl hover:from-green-500 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 active:scale-95 animate-fadeIn disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : "Login"}
              </button>
              <p className="mt-4 text-center text-sm text-gray-600 animate-fadeIn">
                Don't have an account?{" "}
                <Link to="/register" className="text-green-600 font-semibold hover:text-green-700 hover:underline transition-all duration-300">
                  Register here
                </Link>
              </p>
            </form>
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
        @keyframes successBounce { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes checkmark { 0% { stroke-dasharray: 0, 100; } 100% { stroke-dasharray: 100, 100; } }
        @keyframes successPulse { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(2); opacity: 0; } }
        @keyframes loadingDot1 { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-10px); } }
        @keyframes loadingDot2 { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-10px); } }
        @keyframes loadingDot3 { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-10px); } }

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
        .animate-successBounce { animation: successBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-checkmark { animation: checkmark 0.5s ease-in-out 0.3s both; stroke-dasharray: 0, 100; }
        .animate-successPulse { animation: successPulse 1.5s ease-out infinite; }
        .animate-loadingDot1 { animation: loadingDot1 1.2s ease-in-out infinite; }
        .animate-loadingDot2 { animation: loadingDot2 1.2s ease-in-out infinite 0.2s; }
        .animate-loadingDot3 { animation: loadingDot3 1.2s ease-in-out infinite 0.4s; }
      `}</style>
    </div>
  );
};

export default Login;