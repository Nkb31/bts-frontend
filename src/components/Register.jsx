import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaBuilding } from "react-icons/fa";
import api from "../services/api";
import ThemeToggle from "./ThemeToggle";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/auth/register", { username: name, email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const field = (id, label, icon, value, setValue, type = "text", placeholder = "", autoComplete = "") => (
    <div>
      <label htmlFor={id} className="mb-2 block font-geist text-label-sm font-medium text-ink">{label}</label>
      <div className="relative">
        {icon}
        <input
          id={id}
          name={id}
          autoComplete={autoComplete}
          type={type}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="text-input w-full pl-10"
          required
          disabled={loading}
        />
      </div>
    </div>
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center auth-shell p-4 sm:p-6 lg:p-8">
      <div className="fixed right-4 top-4 z-10"><ThemeToggle /></div>
      <div className="w-full max-w-112">
        <div className="auth-card rounded-lg border border-hairline bg-canvas-elevated p-6 sm:p-8">
          <Link to="/" className="mb-6 inline-flex min-h-11 items-center rounded-sm font-geist text-body-sm font-medium text-link transition-colors hover:text-link-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link">
            ← Back to home
          </Link>
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-ink text-on-primary"><FaBuilding className="text-xl" /></div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-hairline bg-hairline-soft px-2.5 py-1 font-geist-mono text-[10px] font-medium uppercase tracking-[0.2em] text-mute">BTS • private banking</div>
            <h1 className="font-geist text-3xl font-medium tracking-tight text-ink sm:text-4xl">Bank Transaction System</h1>
            <p className="mt-2 font-geist text-body-md text-body">Create your account and unlock a streamlined money experience.</p>
          </div>
          {error && <div role="alert" className="mb-6 rounded-sm border border-error bg-error-deep/10 px-4 py-3 font-geist text-body-sm text-error">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
            {field("register-name", "Full Name", <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-mute text-sm" />, name, setName, "text", "John Doe", "name")}
            {field("register-email", "Email Address", <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-mute text-sm" />, email, setEmail, "email", "you@example.com", "username")}
            {field("register-password", "Password", <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-mute text-sm" />, password, setPassword, "password", "Create a password (min 6 chars)", "new-password")}
            {field("register-confirm-password", "Confirm Password", <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-mute text-sm" />, confirmPassword, setConfirmPassword, "password", "Confirm your password", "new-password")}
            <button type="submit" className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          <p className="mt-6 text-center font-geist text-body-sm text-body">
            <Link to="/forgot-password" className="font-medium text-link transition-colors hover:text-link-deep">Forgot password?</Link>
          </p>
          <p className="mt-3 text-center font-geist text-body-sm text-body">
            Already have an account? <Link to="/login" className="font-medium text-link transition-colors hover:text-link-deep">Sign in</Link>
          </p>
        </div>
        <p className="mt-6 text-center font-geist text-body-sm text-mute">Your data is protected with JWT authentication</p>
      </div>
    </div>
  );
}
