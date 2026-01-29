export default function NotFound() {
  return (
    <div className="min-h-dvh bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-800">404</h1>
        <p className="text-sm text-slate-500">Page not found</p>
        <a
          href="/"
          className="inline-block h-11 px-6 rounded-xl bg-slate-900 text-white font-semibold text-sm leading-[2.75rem] active:scale-95 transition-all"
        >
          Go to Padel Tracker
        </a>
      </div>
    </div>
  );
}
