import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../../components/Alert";
import Loader from "../../components/Loader";
import api from "../../lib/api";

export default function EditThreadPage() {
  const { id, threadId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get(`/projects/${id}/threads/${threadId}`);
        setTitle(response.data.title || "");
        setBody(response.data.body || "");
      } catch (e) {
        setError(e.response?.data?.error || "Unable to load thread.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, threadId]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Thread title is required.");
      return;
    }

    try {
      await api.put(`/projects/${id}/threads/${threadId}`, {
        title: title.trim(),
        body: body.trim(),
      });
      setSuccess("Thread updated successfully.");
    } catch (e) {
      setError(e.response?.data?.error || "Unable to update thread.");
    }
  };

  const deleteThread = async () => {
    if (!window.confirm("Delete this thread and all its messages?")) return;
    try {
      await api.delete(`/projects/${id}/threads/${threadId}`);
      navigate(`/projects/${id}`);
    } catch (e) {
      setError(e.response?.data?.error || "Unable to delete thread.");
    }
  };

  return (
    <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {loading && <Loader label="Loading thread..." />}
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Edit Discussion</h1>
        <div className="flex items-center gap-2">
          <Link
            to={`/projects/${id}/threads/${threadId}`}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Back to thread
          </Link>
          <button
            type="button"
            onClick={deleteThread}
            className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
          >
            Delete thread
          </button>
        </div>
      </div>

      <Alert message={error} />
      {success && (
        <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-cyan-400 focus:ring"
          />
        </div>

        <div>
          <label
            htmlFor="body"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Description
          </label>
          <textarea
            id="body"
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
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
