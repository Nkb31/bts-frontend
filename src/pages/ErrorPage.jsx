import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

const errorContent = {
  401: {
    eyebrow: "Authentication required",
    title: "Please sign in to continue",
    description: "Your session may have expired. Sign in again to access this page.",
    action: "Go to sign in",
    destination: "/",
  },
  403: {
    eyebrow: "Access restricted",
    title: "You do not have access here",
    description: "This area is restricted to users with the required permissions.",
    action: "Back to dashboard",
    destination: "/dashboard",
  },
  404: {
    eyebrow: "Page not found",
    title: "This page took a wrong turn",
    description: "The page you requested does not exist or may have moved.",
    action: "Return home",
    destination: "/",
  },
  500: {
    eyebrow: "Server error",
    title: "Something went wrong",
    description: "We could not complete that request. Please try again in a moment.",
    action: "Try again",
    destination: null,
  },
};

function ErrorPage({ status = 404 }) {
  const location = useLocation();
  const content = errorContent[status] || errorContent[404];

  const retry = () => window.location.reload();

  return (
    <main className="auth-shell min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-[42rem]">
        <section className="error-card bg-canvas-elevated border border-hairline rounded-lg p-6 sm:p-10 lg:p-12 text-center">
          <div className="error-mark inline-flex items-center justify-center w-16 h-16 rounded-full bg-ink text-on-primary mb-6" aria-hidden="true">
            <span className="font-geist-mono text-lg">!</span>
          </div>
          <p className="section-eyebrow mb-3">{content.eyebrow}</p>
          <p className="error-code font-geist-mono text-6xl sm:text-8xl font-medium tracking-tight text-ink" aria-label={`Error ${status}`}>
            {status}
          </p>
          <h1 className="font-geist font-medium text-2xl sm:text-4xl tracking-tight text-ink mt-5">
            {content.title}
          </h1>
          <p className="font-geist text-body-md text-body mt-3 max-w-[34rem] mx-auto">
            {content.description}
          </p>
          <p className="font-geist-mono text-body-sm text-mute mt-5 break-all">
            {location.pathname}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            {content.destination ? (
              <Link to={content.destination} className="btn-primary w-full sm:w-auto justify-center">
                {content.action}
              </Link>
            ) : (
              <button type="button" onClick={retry} className="btn-primary w-full sm:w-auto justify-center">
                {content.action}
              </button>
            )}
            {status !== 404 && (
              <Link to="/" className="btn-ghost-sm w-full sm:w-auto justify-center">
                Go home
              </Link>
            )}
          </div>
        </section>
        <p className="text-center mt-6 font-geist text-body-sm text-mute">
          Bank Transaction System
        </p>
      </div>
    </main>
  );
}

export default ErrorPage;
