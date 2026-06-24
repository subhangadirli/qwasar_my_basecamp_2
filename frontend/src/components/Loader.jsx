export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="rounded-xl bg-white px-6 py-4 shadow-lg">
        <p className="text-sm font-medium text-slate-700">{label}</p>
      </div>
    </div>
  )
}
