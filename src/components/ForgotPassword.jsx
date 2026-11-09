import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBuilding, FaEnvelope, FaLock } from "react-icons/fa";
import api from "../services/api";
import ThemeToggle from "./ThemeToggle";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
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
      const res = await api.post("/api/auth/password-reset/confirm", { email, password });
      setNotice(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset your password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" tabIndex={-1} className="relative flex min-h-screen items-center justify-center auth-shell p-4 sm:p-6 lg:p-8">
      <div className="fixed right-4 top-4 z-10"><ThemeToggle /></div>
      <div className="w-full max-w-112">
        <div className="auth-card rounded-lg border border-hairline bg-canvas-elevated p-6 sm:p-8">
          <Link to="/" className="mb-6 inline-flex min-h-11 items-center rounded-sm font-geist text-body-sm font-medium text-link transition-colors hover:text-link-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link">
            ← Back to home
          </Link>
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-ink text-on-primary">
              <FaBuilding className="text-xl" aria-hidden="true" />
            </div>
            <h1 className="font-geist text-3xl font-medium tracking-tight text-ink sm:text-4xl">Change your password</h1>
            <p className="mt-2 font-geist text-body-md text-body">Enter your email and choose a new password</p>
          </div>
          {error && <div role="alert" aria-live="assertive" className="mb-6 rounded-sm border border-error bg-error-deep/10 px-4 py-3 font-geist text-body-sm text-error">{error}</div>}
          {notice && <div role="status" aria-live="polite" className="mb-6 rounded-sm border border-cyan bg-cyan-soft px-4 py-3 font-geist text-body-sm text-ink">{notice}</div>}
          <form onSubmit={resetPassword} className="space-y-5">
            <div>
              <label htmlFor="reset-email" className="mb-2 block font-geist text-label-sm font-medium text-ink">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-mute" aria-hidden="true" />
                <input id="reset-email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="text-input w-full pl-10" required disabled={loading} />
              </div>
            </div>
            <div>
              <label htmlFor="reset-password" className="mb-2 block font-geist text-label-sm font-medium text-ink">New Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-mute" aria-hidden="true" />
                <input id="reset-password" name="new-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" className="text-input w-full pl-10" required disabled={loading} />
              </div>
            </div>
            <div>
              <label htmlFor="reset-confirm-password" className="mb-2 block font-geist text-label-sm font-medium text-ink">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-mute" aria-hidden="true" />
                <input id="reset-confirm-password" name="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm your password" className="text-input w-full pl-10" required disabled={loading} />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50" disabled={loading}>
              {loading ? "Updating password…" : "Update password"}
            </button>
          </form>
          <p className="mt-6 text-center font-geist text-body-sm text-body">
            <Link to="/login" className="font-medium text-link transition-colors hover:text-link-deep">Back to sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
