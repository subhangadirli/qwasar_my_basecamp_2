import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";

const inputClassName =
  "w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-cyan-400 focus:ring";

function validateRegisterForm({ username, email, password, confirmPassword }) {
  if (!username.trim()) {
    return "Username is required.";
  }

  if (!email.includes("@")) {
    return "Email is required and must be valid.";
  }

  if (password.length < 5) {
    return "Password must be at least 5 characters long.";
  }

  if (password !== confirmPassword) {
    return "Password confirmation must match password.";
  }

  return "";
}

function getApiError(error, fallback) {
  return error?.response?.data?.error || fallback;
}

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/projects" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validateRegisterForm({
      username,
      email,
      password,
      confirmPassword,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      await register({ username: username.trim(), email, password });
      navigate("/projects", { replace: true });
    } catch (e) {
      setError(getApiError(e, "Unable to register."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {loading && <Loader label="Creating account..." />}

      <img src={logo} alt="Basecamp logo" className="mx-auto mb-5 h-32 w-32" />
      <h2 className="mb-6 text-center text-2xl font-semibold">Sign up</h2>
      <Alert message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClassName}
          />
        </div>

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClassName}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-700"
        >
          Create account
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        Already a member? <Link to="/login">Log in</Link>
      </p>
    </section>
  );
}
