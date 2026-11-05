import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ThemeToggle from "../components/ThemeToggle";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("email");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestCode = async (event) => {
    event.preventDefault(); setError(""); setMessage(""); setLoading(true);
    try { const res = await api.post("/api/auth/password-reset/request", { email }); setMessage(res.data.message); setStep("reset"); }
    catch (err) { setError(err.response?.data?.message || "Unable to send the reset code."); }
    finally { setLoading(false); }
  };

  const resetPassword = async (event) => {
    event.preventDefault(); setError(""); setMessage(""); setLoading(true);
    try { const res = await api.post("/api/auth/password-reset/confirm", { email, otp, password }); setMessage(res.data.message); setStep("done"); }
    catch (err) { setError(err.response?.data?.message || "Unable to reset your password."); }
    finally { setLoading(false); }
  };

  return <main className="auth-shell min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"><div className="fixed top-4 right-4 z-10"><ThemeToggle /></div><section className="auth-card w-full max-w-[28rem] bg-canvas-elevated border border-hairline rounded-lg p-6 sm:p-8"><div className="text-center mb-8"><p className="section-eyebrow mb-3">Account recovery</p><h1 className="font-geist font-medium text-3xl tracking-tight text-ink">Reset your password</h1><p className="font-geist text-body-md text-body mt-2">We’ll send a one-time code to your verified email.</p></div>{error && <div role="alert" className="bg-error-deep/10 border border-error text-error rounded-sm px-4 py-3 mb-6 font-geist text-body-sm">{error}</div>}{message && <div role="status" className="bg-cyan-soft border border-cyan text-ink rounded-sm px-4 py-3 mb-6 font-geist text-body-sm">{message}</div>}{step === "email" && <form onSubmit={requestCode} className="space-y-5" autoComplete="on"><label className="block font-geist text-label-sm text-ink font-medium">Email Address<input name="username" autoComplete="username" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-input w-full mt-2" required disabled={loading} /></label><button className="btn-primary w-full justify-center" disabled={loading}>{loading ? "Sending..." : "Send reset code"}</button></form>}{step === "reset" && <form onSubmit={resetPassword} className="space-y-5" autoComplete="on"><label className="block font-geist text-label-sm text-ink font-medium">6-digit code<input name="one-time-code" autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} className="text-input w-full mt-2" required disabled={loading} /></label><label className="block font-geist text-label-sm text-ink font-medium">New password<input name="new-password" autoComplete="new-password" type="password" minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} className="text-input w-full mt-2" required disabled={loading} /></label><button className="btn-primary w-full justify-center" disabled={loading}>{loading ? "Updating..." : "Reset password"}</button></form>}{step === "done" && <Link to="/" className="btn-primary w-full justify-center">Return to sign in</Link>}<p className="text-center mt-6 font-geist text-body-sm text-body"><Link to="/" className="text-link hover:text-link-deep">Back to sign in</Link></p></section></main>;
}
