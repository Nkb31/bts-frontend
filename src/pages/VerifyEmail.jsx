import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import ThemeToggle from "../components/ThemeToggle";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState(() => ({
    loading: Boolean(token),
    message: token ? "" : "This verification link is missing its token.",
  }));

  useEffect(() => {
    if (!token) {
      return;
    }

    api.get(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((response) => setState({ loading: false, message: response.data.message }))
      .catch((error) => setState({ loading: false, message: error.response?.data?.message || "Email verification failed." }));
  }, [token]);

  return (
    <main className="auth-shell min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="fixed top-4 right-4 z-10"><ThemeToggle /></div>
      <section className="auth-card w-full max-w-[28rem] bg-canvas-elevated border border-hairline rounded-lg p-6 sm:p-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ink text-on-primary mb-4">✓</div>
        <p className="section-eyebrow mb-3">Email verification</p>
        <h1 className="font-geist font-medium text-3xl tracking-tight text-ink">{state.loading ? "Verifying your email…" : state.message.startsWith("Email verified") ? "Verification complete" : "Verification link problem"}</h1>
        {!state.loading && <p className="font-geist text-body-md text-body mt-3">{state.message}</p>}
        {!state.loading && <Link to="/" className="btn-primary inline-flex mt-8">Go to sign in</Link>}
      </section>
    </main>
  );
}
