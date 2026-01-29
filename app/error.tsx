"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-dvh bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-xl font-bold text-slate-800">
          Something went wrong
        </h1>
        <p className="text-sm text-slate-500">
          An unexpected error occurred.
        </p>
        <button
          onClick={reset}
          className="h-11 px-6 rounded-xl bg-slate-900 text-white font-semibold text-sm active:scale-95 transition-all"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
