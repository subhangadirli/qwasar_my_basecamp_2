import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Alert from "../../components/Alert";
import Loader from "../../components/Loader";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const downloadUrl = (projectId, attachmentId) =>
  `${api.defaults.baseURL}/projects/${projectId}/attachments/${attachmentId}/download`;

export default function ProjectOverviewPage() {
  const { id } = useParams();
  const { userId, isAdmin } = useAuth();

  const [project, setProject] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [threads, setThreads] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [memberInput, setMemberInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const isProjectAdmin =
    Boolean(project) && (project.owner_id === userId || isAdmin);

  const loadAll = async () => {
    try {
      setError("");
      const [projectRes, attachRes, threadRes, memberRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/attachments`),
        api.get(`/projects/${id}/threads`),
        api.get(`/projects/${id}/members`),
      ]);
      setProject(projectRes.data);
      setAttachments(attachRes.data);
      setThreads(threadRes.data);
      setMembers(memberRes.data);
    } catch (e) {
      setError(e.response?.data?.error || "Unable to load project.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [id]);

  const uploadAttachment = async (event) => {
    event.preventDefault();
    setError("");
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Please choose a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await api.post(`/projects/${id}/attachments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAttachments((prev) => [response.data.attachment, ...prev]);
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      setError(e.response?.data?.error || "Unable to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const deleteAttachment = async (attachmentId) => {
    if (!window.confirm("Delete this attachment?")) return;
    try {
      await api.delete(`/projects/${id}/attachments/${attachmentId}`);
      setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
    } catch (e) {
      setError(e.response?.data?.error || "Unable to delete attachment.");
    }
  };

  const addMember = async (event) => {
    event.preventDefault();
    setError("");
    const value = memberInput.trim();
    if (!value) return;

    const payload = value.includes("@")
      ? { email: value }
      : { username: value };

    try {
      const response = await api.post(`/projects/${id}/members`, payload);
      const m = response.data.member;
      setMembers((prev) =>
        prev.some((existing) => existing.user_id === m.user_id)
          ? prev
          : [...prev, m],
      );
      setMemberInput("");
    } catch (e) {
      setError(e.response?.data?.error || "Unable to add member.");
    }
  };

  const removeMember = async (memberUserId) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      await api.delete(`/projects/${id}/members/${memberUserId}`);
      setMembers((prev) => prev.filter((m) => m.user_id !== memberUserId));
    } catch (e) {
      setError(e.response?.data?.error || "Unable to remove member.");
    }
  };

  return (
    <div className="space-y-6">
      {loading && <Loader label="Loading project..." />}
      <Alert message={error} />

      {project && (
        <>
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  {project.name}
                </h1>
                <p className="mt-2 text-slate-600">
                  {project.description || "No description yet."}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Owner: {project.owner_name}
                </p>
              </div>
              <Link
                to={`/projects/${id}/edit`}
                className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
              >
                Edit project
              </Link>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Members
            </h2>
            <ul className="divide-y divide-slate-100">
              {members.map((m) => (
                <li
                  key={m.user_id}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-sm text-slate-700">
                    {m.username}{" "}
                    <span className="text-xs text-slate-400">({m.email})</span>
                    {m.role === "admin" && (
                      <span className="ml-2 rounded bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-700">
                        admin
                      </span>
                    )}
                  </span>
                  {isProjectAdmin && m.role !== "admin" && (
                    <button
                      type="button"
                      onClick={() => removeMember(m.user_id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {isProjectAdmin && (
              <form onSubmit={addMember} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  placeholder="username or email"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-cyan-400 focus:ring"
                />
                <button
                  type="submit"
                  className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
                >
                  Add member
                </button>
              </form>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Attachments
            </h2>

            {attachments.length === 0 ? (
              <p className="text-sm text-slate-500">No attachments yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {attachments.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium uppercase text-slate-600">
                        {a.format}
                      </span>
                      <a
                        href={downloadUrl(id, a.id)}
                        className="text-cyan-700 hover:underline"
                      >
                        {a.original_name}
                      </a>
                      <span className="text-xs text-slate-400">
                        by {a.uploader_name}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteAttachment(a.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={uploadAttachment} className="mt-4 flex gap-2">
              <input
                ref={fileRef}
                type="file"
                accept=".png,.jpg,.jpeg,.pdf,.txt"
                className="flex-1 text-sm text-slate-700"
              />
              <button
                type="submit"
                disabled={uploading}
                className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </form>
            <p className="mt-2 text-xs text-slate-400">
              Allowed formats: png, jpg, pdf, txt (max 10MB).
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Discussions
              </h2>
              {isProjectAdmin && (
                <Link
                  to={`/projects/${id}/threads/new`}
                  className="rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-cyan-700"
                >
                  New thread
                </Link>
              )}
            </div>

            {threads.length === 0 ? (
              <p className="text-sm text-slate-500">No discussions yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {threads.map((t) => (
                  <li key={t.id} className="py-2">
                    <Link
                      to={`/projects/${id}/threads/${t.id}`}
                      className="text-sm font-medium text-cyan-700 hover:underline"
                    >
                      {t.title}
                    </Link>
                    <span className="ml-2 text-xs text-slate-400">
                      by {t.author_name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
