import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
      <Outlet />
    </main>
  )
}
