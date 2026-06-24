import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Alert from "../../components/Alert";
import Loader from "../../components/Loader";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function ThreadPage() {
  const { id, threadId } = useParams();
  const { userId, isAdmin } = useAuth();

  const [thread, setThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newMessage, setNewMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingBody, setEditingBody] = useState("");

  const isProjectAdmin =
    Boolean(project) && (project.owner_id === userId || isAdmin);

  const canModifyMessage = (message) =>
    message.author_id === userId || isProjectAdmin;

  const load = async () => {
    try {
      setError("");
      const [threadRes, projectRes] = await Promise.all([
        api.get(`/projects/${id}/threads/${threadId}`),
        api.get(`/projects/${id}`),
      ]);
      const { messages: msgs, ...rest } = threadRes.data;
      setThread(rest);
      setMessages(msgs || []);
      setProject(projectRes.data);
    } catch (e) {
      setError(e.response?.data?.error || "Unable to load thread.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id, threadId]);

  const postMessage = async (event) => {
    event.preventDefault();
    setError("");
    if (!newMessage.trim()) return;
    try {
      await api.post(`/projects/${id}/threads/${threadId}/messages`, {
        body: newMessage.trim(),
      });
      setNewMessage("");
      await load();
    } catch (e) {
      setError(e.response?.data?.error || "Unable to post message.");
    }
  };

  const startEdit = (message) => {
    setEditingId(message.id);
    setEditingBody(message.body);
  };

  const saveEdit = async (messageId) => {
    setError("");
    if (!editingBody.trim()) return;
    try {
      await api.put(
        `/projects/${id}/threads/${threadId}/messages/${messageId}`,
        { body: editingBody.trim() },
      );
      setEditingId(null);
      setEditingBody("");
      await load();
    } catch (e) {
      setError(e.response?.data?.error || "Unable to update message.");
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(
        `/projects/${id}/threads/${threadId}/messages/${messageId}`,
      );
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (e) {
      setError(e.response?.data?.error || "Unable to delete message.");
    }
  };

  return (
    <div className="space-y-6">
      {loading && <Loader label="Loading thread..." />}
      <Alert message={error} />

      {thread && (
        <>
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <Link
                  to={`/projects/${id}`}
                  className="text-xs text-slate-400 hover:underline"
                >
                  ← Back to project
                </Link>
                <h1 className="mt-1 text-2xl font-semibold text-slate-900">
                  {thread.title}
                </h1>
                <p className="mt-2 whitespace-pre-line text-slate-600">
                  {thread.body || "No description."}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Started by {thread.author_name}
                </p>
              </div>
              {isProjectAdmin && (
                <Link
                  to={`/projects/${id}/threads/${threadId}/edit`}
                  className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
                >
                  Edit thread
                </Link>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Messages
            </h2>

            {messages.length === 0 ? (
              <p className="text-sm text-slate-500">
                No messages yet. Start the conversation!
              </p>
            ) : (
              <ul className="space-y-4">
                {messages.map((m) => (
                  <li
                    key={m.id}
                    className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {m.author_name}
                      </span>
                      {canModifyMessage(m) && editingId !== m.id && (
                        <span className="flex gap-3 text-xs">
                          <button
                            type="button"
                            onClick={() => startEdit(m)}
                            className="text-cyan-700 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteMessage(m.id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </span>
                      )}
                    </div>

                    {editingId === m.id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={3}
                          value={editingBody}
                          onChange={(e) => setEditingBody(e.target.value)}
                          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-cyan-400 focus:ring"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => saveEdit(m.id)}
                            className="rounded-md bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-cyan-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-line text-sm text-slate-700">
                        {m.body}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={postMessage} className="mt-6 space-y-2">
              <textarea
                rows={3}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write a message..."
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-cyan-400 focus:ring"
              />
              <button
                type="submit"
                className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
              >
                Post message
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  );
}
