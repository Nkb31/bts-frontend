import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaBuilding, FaKey } from "react-icons/fa";
import api from "../services/api";
import ThemeToggle from "./ThemeToggle";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault(); setError(""); setNotice(""); setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      if (res.data.requiresOtp) {
        setRequiresOtp(true);
        setNotice(res.data.message || "Enter the login code sent to your email.");
        return;
      }
      if (!res.data.token) throw new Error("Login did not return an authentication token.");
      localStorage.setItem("token", res.data.token); navigate("/dashboard");
    }
    catch (err) { setError(err.response?.data?.message || "Login failed. Please try again."); }
    finally { setLoading(false); }
  };
  const verifyOtp = async (event) => {
    event.preventDefault(); setError(""); setNotice(""); setLoading(true);
    try {
      const res = await api.post("/api/auth/login/verify-otp", { email, otp });
      if (!res.data.token) throw new Error("Login did not return an authentication token.");
      localStorage.setItem("token", res.data.token); navigate("/dashboard");
    } catch (err) { setError(err.response?.data?.message || err.message || "Could not verify the login code."); }
    finally { setLoading(false); }
  };
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden auth-shell p-4 sm:p-6 lg:p-8">
      <div className="fixed right-4 top-4 z-10 sm:right-6 sm:top-6"><ThemeToggle /></div>
      <div className="grid w-full max-w-224 overflow-hidden rounded-lg border border-hairline bg-canvas-elevated shadow-[0_24px_80px_color-mix(in_srgb,var(--color-ink)_10%,transparent)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <aside className="relative hidden min-h-140 flex-col justify-between overflow-hidden bg-ink p-8 text-on-primary lg:flex lg:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" aria-hidden="true" />
          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full border border-white/10" aria-hidden="true" />
          <div className="relative">
            <div className="mb-10 inline-flex h-12 w-12 items-center justify-center rounded-md border border-white/15 bg-white/10"><FaBuilding className="text-lg" /></div>
            <p className="max-w-xs font-geist text-3xl font-medium leading-tight tracking-tight">Move money with clarity.</p>
            <p className="mt-4 max-w-xs font-geist text-body-md leading-6 text-white/65">A focused workspace for keeping your accounts and transactions in sync.</p>
          </div>
          <div className="relative border-t border-white/15 pt-5 font-geist text-body-sm text-white/55">Bank Transaction System</div>
        </aside>
        <main id="main-content" tabIndex={-1} className="p-6 sm:p-9 lg:p-12">
          <Link to="/" className="mb-6 inline-flex min-h-11 items-center rounded-sm font-geist text-body-sm font-medium text-link transition-colors hover:text-link-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link">
            ← Back to home
          </Link>
          <div className="mb-8 lg:mb-10"><div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-md bg-ink text-on-primary lg:hidden"><FaBuilding className="text-base" /></div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-hairline bg-hairline-soft px-2.5 py-1 font-geist-mono text-[10px] font-medium uppercase tracking-[0.2em] text-mute">BTS • secure banking</div><h1 className="font-geist text-3xl font-medium tracking-tight text-ink sm:text-4xl">Welcome back</h1><p className="mt-2 font-geist text-body-md text-body">Sign in to your Bank Transaction System account and continue managing your money confidently.</p></div>
          {error && <div role="alert" aria-live="assertive" className="mb-6 rounded-sm border border-error bg-error-deep/10 px-4 py-3 font-geist text-body-sm text-error">{error}</div>}
          {notice && <div role="status" aria-live="polite" className="mb-6 rounded-sm border border-cyan bg-cyan-soft px-4 py-3 font-geist text-body-sm text-ink">{notice}</div>}
          {!requiresOtp ? <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
            <div><label htmlFor="login-email" className="mb-2 block font-geist text-label-sm font-medium text-ink">Email address</label><div className="relative"><FaEnvelope aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-mute text-sm" /><input id="login-email" name="username" autoComplete="username" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="text-input w-full pl-10" required disabled={loading} /></div></div>
            <div><div className="mb-2 flex items-center justify-between"><label htmlFor="login-password" className="block font-geist text-label-sm font-medium text-ink">Password</label></div><div className="relative"><FaLock aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-mute text-sm" /><input id="login-password" name="password" autoComplete="current-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="text-input w-full pl-10 pr-10" required disabled={loading} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-mute transition-colors hover:text-ink" disabled={loading}>{showPassword ? <FaEyeSlash aria-hidden="true" className="text-sm" /> : <FaEye aria-hidden="true" className="text-sm" />}</button></div></div>
            <button type="submit" className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50" disabled={loading}>{loading ? "Signing you in..." : "Sign in"}</button>
          </form> : <form onSubmit={verifyOtp} className="space-y-5"><div><label htmlFor="login-otp" className="mb-2 block font-geist text-label-sm font-medium text-ink">Login code</label><div className="relative"><FaKey aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-mute text-sm" /><input id="login-otp" name="otp" inputMode="numeric" autoComplete="one-time-code" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter the 6-digit code" className="text-input w-full pl-10" required disabled={loading} /></div></div><button type="submit" className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50" disabled={loading}>{loading ? "Verifying..." : "Verify and sign in"}</button></form>}
          <div className="mt-6 flex items-center justify-between gap-4 font-geist text-body-sm"><Link to="/forgot-password" className="text-link font-medium transition-colors hover:text-link-deep">Forgot password?</Link><Link to="/register" className="text-link font-medium transition-colors hover:text-link-deep">Create account</Link></div>
          <p className="mt-10 border-t border-hairline pt-5 font-geist text-body-sm text-mute">Your session is protected with secure token-based authentication.</p>
        </main>
      </div>
    </div>
  );
}
