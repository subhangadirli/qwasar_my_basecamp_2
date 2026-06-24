import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";

const inputClassName =
  "w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-cyan-400 focus:ring";

function validateLoginForm({ email, password }) {
  if (!email.includes("@")) {
    return "Email is required and must be valid.";
  }

  if (password.length < 5) {
    return "Password must be at least 5 characters long.";
  }

  return "";
}

function getApiError(error, fallback) {
  return error?.response?.data?.error || fallback;
}

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/projects" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validateLoginForm({ email, password });
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      await login(email, password);

      const nextPath = location.state?.from || "/projects";
      navigate(nextPath, { replace: true });
    } catch (e) {
      setError(getApiError(e, "Unable to login."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {loading && <Loader label="Logging in..." />}

      <img src={logo} alt="Basecamp logo" className="mx-auto mb-5 h-32 w-32" />
      <h2 className="mb-6 text-center text-2xl font-semibold">Log in</h2>
      <Alert message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClassName}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-700"
        >
          Log in
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        New here? <Link to="/register">Sign up</Link>
      </p>
    </section>
  );
}
