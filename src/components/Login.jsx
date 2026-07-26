import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>🏦 Bank Transaction System</h1>

        <h2>Welcome Back</h2>

        <div className="input-box">
          <FaEnvelope className="icon" />
          <input
            type="email"
            placeholder="Email"
          />
        </div>

        <div className="input-box">

          <FaLock className="icon" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
          />

          <button
            className="eye-btn"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>

        </div>

        <div className="forgot">
          <Link to="#">Forgot Password?</Link>
        </div>

        <button className="login-btn">
          Login
        </button>

        <p className="signup">

          Don't have an account?

          <Link to="/register">
            Create Account
          </Link>

        </p>

      </div>

    </div>
  );
}