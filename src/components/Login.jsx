import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaBuilding } from "react-icons/fa";
import api from "../services/api";
import ThemeToggle from "./ThemeToggle";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const verificationSent = searchParams.get("verification") === "sent";
  const handleSubmit = async (event) => {
    event.preventDefault(); setError(""); setNotice(""); setLoading(true);
    try {
      if (otpStep) {
        const res = await api.post("/api/auth/login/verify-otp", { email, otp });
        localStorage.setItem("token", res.data.token); navigate("/dashboard");
      } else {
        const res = await api.post("/api/auth/login", { email, password });
        if (res.data.requiresOtp) { setOtpStep(true); setNotice(res.data.message); }
        else { localStorage.setItem("token", res.data.token); navigate("/dashboard"); }
      }
    }
    catch (err) { setError(err.response?.data?.message || "Login failed. Please try again."); }
    finally { setLoading(false); }
  };
  const resendVerification = async () => {
    setError(""); setNotice(""); setLoading(true);
    try {
      const res = await api.post("/api/auth/resend-verification", { email });
      setNotice(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to resend the verification email.");
    } finally { setLoading(false); }
  };
  return (
    <div className="relative min-h-screen auth-shell flex items-center justify-center p-4 sm:p-6 lg:p-8"><div className="fixed top-4 right-4 z-10"><ThemeToggle /></div><div className="w-full max-w-[28rem]"><div className="auth-card bg-canvas-elevated border border-hairline rounded-lg p-6 sm:p-8">
      <div className="text-center mb-8"><div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ink text-on-primary mb-4"><FaBuilding className="text-xl" /></div><h1 className="font-geist font-medium text-3xl sm:text-4xl tracking-tight text-ink">Bank Transaction System</h1><p className="font-geist text-body-md text-body mt-2">Sign in to your account</p></div>
      {error && <div role="alert" className="bg-error-deep/10 border border-error text-error rounded-sm px-4 py-3 mb-6 font-geist text-body-sm">{error}</div>}
      {notice && <div role="status" className="bg-cyan-soft border border-cyan text-ink rounded-sm px-4 py-3 mb-6 font-geist text-body-sm">{notice}</div>}
      {verificationSent && <div role="status" className="bg-cyan-soft border border-cyan text-ink rounded-sm px-4 py-3 mb-6 font-geist text-body-sm">Account created. Check your email and verify your address before signing in.</div>}
      <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
        <div><label htmlFor="login-email" className="block font-geist text-label-sm text-ink mb-2 font-medium">Email Address</label><div className="relative"><FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-mute text-sm" /><input id="login-email" name="username" autoComplete="username" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="text-input w-full pl-10" required disabled={loading} /></div></div>
        {!otpStep ? <div><div className="flex items-center justify-between mb-2"><label htmlFor="login-password" className="block font-geist text-label-sm text-ink font-medium">Password</label><Link to="/forgot-password" className="text-body-sm text-link hover:text-link-deep">Forgot password?</Link></div><div className="relative"><FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-mute text-sm" /><input id="login-password" name="password" autoComplete="current-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="text-input w-full pl-10 pr-10" required disabled={loading} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-mute hover:text-ink transition-colors" disabled={loading}>{showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}</button></div></div> : <div><label htmlFor="login-otp" className="block font-geist text-label-sm text-ink mb-2 font-medium">Email verification code</label><input id="login-otp" name="one-time-code" autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="Enter 6-digit code" className="text-input w-full" required disabled={loading} /></div>}
        <button type="submit" className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>{loading ? "Please wait..." : otpStep ? "Verify and sign in" : "Send login code"}</button>
      </form>
      {!otpStep && <button type="button" onClick={resendVerification} disabled={loading || !email} className="w-full mt-4 font-geist text-body-sm text-link hover:text-link-deep disabled:text-mute disabled:cursor-not-allowed">Resend verification email</button>}
      <p className="text-center mt-6 font-geist text-body-sm text-body">Don't have an account? <Link to="/register" className="text-link hover:text-link-deep font-medium transition-colors">Create account</Link></p>
    </div><p className="text-center mt-6 font-geist text-body-sm text-mute">Protected by JWT authentication</p></div></div>
  );
}
