import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProjectsPage from './pages/projects/ProjectsPage'
import NewProjectPage from './pages/projects/NewProjectPage'
import EditProjectPage from './pages/projects/EditProjectPage'
import ProjectOverviewPage from './pages/projects/ProjectOverviewPage'
import NewThreadPage from './pages/projects/NewThreadPage'
import EditThreadPage from './pages/projects/EditThreadPage'
import ThreadPage from './pages/projects/ThreadPage'
import EditProfilePage from './pages/EditProfilePage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/new" element={<NewProjectPage />} />
          <Route path="/projects/:id/edit" element={<EditProjectPage />} />
          <Route path="/projects/:id/threads/new" element={<NewThreadPage />} />
          <Route path="/projects/:id/threads/:threadId/edit" element={<EditThreadPage />} />
          <Route path="/projects/:id/threads/:threadId" element={<ThreadPage />} />
          <Route path="/projects/:id" element={<ProjectOverviewPage />} />
          <Route path="/users/edit" element={<EditProfilePage />} />
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
