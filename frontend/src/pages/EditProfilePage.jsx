import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function EditProfilePage() {
  const { userId, logout } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/users/${userId}`);
        setUsername(response.data.username || "");
        setEmail(response.data.email || "");
      } catch (e) {
        setError(e.response?.data?.error || "Unable to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  const deleteUser = async () => {
    const confirmed = window.confirm(
      "Delete your account? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      await api.delete(`/users/${userId}`);
      await logout();
      navigate("/", { replace: true });
    } catch (e) {
      setError(e.response?.data?.error || "Unable to delete account.");
    }
  };

  return (
    <section className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {loading && <Loader label="Loading profile..." />}
      <h1 className="mb-6 text-2xl font-semibold">My Account</h1>
      <Alert message={error} />

      <div className="space-y-4">
        <div>
          <p className="mb-1 block text-sm font-medium text-slate-700">
            Username
          </p>
          <div className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800">
            {username || "-"}
          </div>
        </div>

        <div>
          <p className="mb-1 block text-sm font-medium text-slate-700">Email</p>
          <div className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800">
            {email || "-"}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={deleteUser}
            className="rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
          >
            Delete account
          </button>
        </div>
      </div>
    </section>
  );
}
