import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../../components/Alert";
import Loader from "../../components/Loader";
import api from "../../lib/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      setError("");
      const response = await api.get("/projects");
      setProjects(response.data);
    } catch (e) {
      setError(e.response?.data?.error || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const deleteProject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );
    if (!confirmed) return;

    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (e) {
      setError(e.response?.data?.error || "Unable to delete project.");
    }
  };

  return (
    <section>
      {loading && <Loader label="Loading projects..." />}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
        <Link
          to="/projects/new"
          className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
        >
          New project
        </Link>
      </div>

      <Alert message={error} />

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          No projects yet. Create your first project.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <Link
                to={`/projects/${project.id}`}
                className="text-lg font-semibold text-slate-900 hover:text-cyan-700"
              >
                {project.name}
              </Link>
              <p className="mt-2 text-sm text-slate-600">
                {project.description || "No description yet."}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Owner: {project.owner_name}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <Link
                  to={`/projects/${project.id}/edit`}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => deleteProject(project.id)}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
