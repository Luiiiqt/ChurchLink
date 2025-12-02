import React, { useState } from "react";

function Register({ onRegister, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  function handleSubmit() {
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    if (username.trim() === "") {
      alert("Username cannot be empty");
      return;
    }

    const success = onRegister(username.trim(), password);
    if (success) {
      setUsername("");
      setPassword("");
      setConfirm("");
    }
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            ChurchLink
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto"></div>
        </div>

        {/* Card */}
        <div className="bg-white/80 p-8 rounded-2xl shadow-2xl border border-green-200/50">
          <h2 className="text-2xl font-bold mb-6 text-green-800">
            Create Account
          </h2>

          <div className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Choose a username"
                className="w-full p-3 border border-green-200 rounded-xl outline-none bg-green-50/50"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full p-3 border border-green-200 rounded-xl outline-none bg-green-50/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full p-3 border border-green-200 rounded-xl outline-none bg-green-50/50"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  username &&
                  password &&
                  confirm &&
                  handleSubmit()
                }
              />
            </div>

             <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-green-500 hover:to-emerald-600 transition-all duration-300 font-semibold"
            >
              Register
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-green-600">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="font-bold text-green-700 hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
