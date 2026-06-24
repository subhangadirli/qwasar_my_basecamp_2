import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";

const linkBase = "rounded-md px-3 py-2 text-sm font-medium transition-colors";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to="/projects"
          className="flex items-center gap-2 text-xl font-semibold text-cyan-700"
        >
          <img src={logo} alt="Basecamp logo" className="h-7 w-7" />
          <span>Basecamp</span>
        </Link>

        <div className="flex items-center gap-2">
          <NavLink
            to="/projects/new"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "bg-cyan-100 text-cyan-700" : "text-slate-700 hover:bg-slate-100"}`
            }
          >
            Add Project
          </NavLink>
          <NavLink
            to="/users/edit"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "bg-cyan-100 text-cyan-700" : "text-slate-700 hover:bg-slate-100"}`
            }
          >
            My Account
          </NavLink>
          <button
            onClick={handleLogout}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
            type="button"
          >
            Log out
          </button>
        </div>
      </nav>
    </header>
  );
}
