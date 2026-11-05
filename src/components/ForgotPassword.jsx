import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBuilding, FaEnvelope, FaKey, FaLock } from "react-icons/fa";
import api from "../services/api";
import ThemeToggle from "./ThemeToggle";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const requestReset = async (event) => {
    event.preventDefault(); setError(""); setNotice(""); setLoading(true);
    try {
      const res = await api.post("/api/auth/password-reset/request", { email });
      setNotice(res.data.message); setStep(2);
    } catch (err) { setError(err.response?.data?.message || "Could not send the reset code. Please try again."); }
    finally { setLoading(false); }
  };

  const resetPassword = async (event) => {
    event.preventDefault(); setError(""); setNotice("");
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const res = await api.post("/api/auth/password-reset/confirm", { email, otp, password });
      setNotice(res.data.message); setStep(3);
    } catch (err) { setError(err.response?.data?.message || "Could not reset your password. Please try again."); }
    finally { setLoading(false); }
  };

  return <div className="relative min-h-screen auth-shell flex items-center justify-center p-4 sm:p-6 lg:p-8"><div className="fixed top-4 right-4 z-10"><ThemeToggle /></div><div className="w-full max-w-112"><div className="auth-card bg-canvas-elevated border border-hairline rounded-lg p-6 sm:p-8"><div className="text-center mb-8"><div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ink text-on-primary mb-4"><FaBuilding className="text-xl" /></div><h1 className="font-geist font-medium text-3xl sm:text-4xl tracking-tight text-ink">Reset your password</h1><p className="font-geist text-body-md text-body mt-2">{step === 1 ? "We'll send a reset code to your email" : step === 2 ? "Enter the code and choose a new password" : "Your password has been updated"}</p></div>{error && <div role="alert" className="bg-error-deep/10 border border-error text-error rounded-sm px-4 py-3 mb-6 font-geist text-body-sm">{error}</div>}{notice && <div role="status" className="bg-cyan-soft border border-cyan text-ink rounded-sm px-4 py-3 mb-6 font-geist text-body-sm">{notice}</div>}{step === 1 && <form onSubmit={requestReset} className="space-y-5"><label htmlFor="reset-email" className="block font-geist text-label-sm text-ink mb-2 font-medium">Email Address</label><div className="relative"><FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-mute text-sm" /><input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="text-input w-full pl-10" required disabled={loading} /></div><button type="submit" className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>{loading ? "Sending code..." : "Send reset code"}</button></form>}{step === 2 && <form onSubmit={resetPassword} className="space-y-5"><div><label htmlFor="reset-otp" className="block font-geist text-label-sm text-ink mb-2 font-medium">Reset Code</label><div className="relative"><FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-mute text-sm" /><input id="reset-otp" inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter the code from your email" className="text-input w-full pl-10" required disabled={loading} /></div></div><div><label htmlFor="reset-password" className="block font-geist text-label-sm text-ink mb-2 font-medium">New Password</label><div className="relative"><FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-mute text-sm" /><input id="reset-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="text-input w-full pl-10" required disabled={loading} /></div></div><div><label htmlFor="reset-confirm-password" className="block font-geist text-label-sm text-ink mb-2 font-medium">Confirm Password</label><div className="relative"><FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-mute text-sm" /><input id="reset-confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className="text-input w-full pl-10" required disabled={loading} /></div></div><button type="submit" className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>{loading ? "Resetting password..." : "Reset password"}</button></form>}{step === 3 && <Link to="/" className="btn-primary w-full justify-center">Return to sign in</Link>}<p className="text-center mt-6 font-geist text-body-sm text-body"><Link to="/" className="text-link hover:text-link-deep font-medium transition-colors">Back to sign in</Link></p></div></div></div>;
}
