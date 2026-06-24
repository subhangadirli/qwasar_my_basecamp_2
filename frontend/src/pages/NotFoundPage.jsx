import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth()

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-5xl font-bold text-slate-800">404</p>
        <p className="mt-2 text-slate-600">The page you are looking for was not found.</p>
        <Link to={isAuthenticated ? '/projects' : '/login'} className="mt-5 inline-block rounded-md bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-700">
          Back
        </Link>
      </section>
    </main>
  )
}
