import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../../components/Alert";
import Loader from "../../components/Loader";
import api from "../../lib/api";

export default function NewThreadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Thread title is required.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`/projects/${id}/threads`, {
        title: title.trim(),
        body: body.trim(),
      });
      navigate(`/projects/${id}/threads/${response.data.thread.id}`);
    } catch (e) {
      setError(e.response?.data?.error || "Unable to create thread.");
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {loading && <Loader label="Creating thread..." />}
      <h1 className="mb-6 text-2xl font-semibold">New Discussion</h1>
      <Alert message={error} />

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
          Create Thread
        </button>
      </form>
    </section>
  );
}
