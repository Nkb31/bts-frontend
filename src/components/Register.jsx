import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import "./Login.css";

export default function Register() {
  return (
    <div className="login-page">
      <div className="login-card">

        <h1>Create Account</h1>

        <div className="input-box">
          <FaUser className="icon" />
          <input
            type="text"
            placeholder="Full Name"
          />
        </div>

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
            type="password"
            placeholder="Password"
          />
        </div>

        <button className="login-btn">
          Create Account
        </button>

        <p className="signup">
          Already have an account?
          <Link to="/"> Login</Link>
        </p>

      </div>
    </div>
  );
}