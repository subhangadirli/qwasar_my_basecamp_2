import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/Alert";
import Loader from "../../components/Loader";
import api from "../../lib/api";

export default function NewProjectPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/projects", {
        name: name.trim(),
        description: description.trim(),
      });
      navigate("/projects");
    } catch (e) {
      setError(e.response?.data?.error || "Unable to create project.");
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {loading && <Loader label="Creating project..." />}
      <h1 className="mb-6 text-2xl font-semibold">New Project</h1>
      <Alert message={error} />

      <form onSubmit={submit} className="space-y-4">
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
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-cyan-400 focus:ring"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-700"
        >
          Create Project
        </button>
      </form>
    </section>
  );
}
