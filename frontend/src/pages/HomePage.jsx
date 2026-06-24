import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";

const heroTitleStyle = {
  fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
};

const heroSubtitleStyle = {
  fontFamily: "Georgia, serif",
};

const ctaButtonClassName =
  "rounded-md bg-cyan-600 px-9 py-3 text-3xl font-semibold text-white transition-colors hover:bg-cyan-700";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <section className="w-full text-center">
      <img
        src={logo}
        alt="Basecamp logo"
        className="mx-auto mb-6 h-56 w-56 md:h-64 md:w-64"
      />

      <h1
        className="text-6xl font-black uppercase leading-none tracking-tight text-slate-800 md:text-8xl"
        style={heroTitleStyle}
      >
        Collaborate
      </h1>

      <p
        className="mt-3 text-2xl font-semibold text-slate-700"
        style={heroSubtitleStyle}
      >
        A project management tool for developers
      </p>

      <div className="mt-14 flex justify-center gap-10">
        <Link
          to="/register"
          className={ctaButtonClassName}
          style={heroSubtitleStyle}
        >
          Sign up
        </Link>

        <Link
          to="/login"
          className={ctaButtonClassName}
          style={heroSubtitleStyle}
        >
          Login
        </Link>
      </div>
    </section>
  );
}
