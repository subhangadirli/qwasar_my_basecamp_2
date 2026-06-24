import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../../components/Alert";
import Loader from "../../components/Loader";
import api from "../../lib/api";

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        setName(response.data.name || "");
        setDescription(response.data.description || "");
      } catch (e) {
        setError(e.response?.data?.error || "Unable to load project.");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const updateProject = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      await api.put(`/projects/${id}`, {
        name: name.trim(),
        description: description.trim(),
      });
      setSuccess("Project updated successfully.");
    } catch (e) {
      setError(e.response?.data?.error || "Unable to update project.");
    }
  };

  const deleteProject = async () => {
    const confirmed = window.confirm(
      "Delete this project? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      await api.delete(`/projects/${id}`);
      navigate("/projects");
    } catch (e) {
      setError(e.response?.data?.error || "Unable to delete project.");
    }
  };

  return (
    <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {loading && <Loader label="Loading project..." />}
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Edit Project</h1>
        <div className="flex items-center gap-2">
          <Link
            to={`/projects/${id}`}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Project overview
          </Link>
          <button
            type="button"
            onClick={deleteProject}
            className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
          >
            Delete project
          </button>
        </div>
      </div>

      <Alert message={error} />
      {success && (
        <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <form onSubmit={updateProject} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-cyan-400 focus:ring"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-cyan-400 focus:ring"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-700"
        >
          Save Changes
        </button>
      </form>
    </section>
  );
}
