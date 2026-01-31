import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/supabase-server-auth";
import { isAdmin } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user || !isAdmin(user.email)) {
    redirect("/");
  }

  return (
    <div className="min-h-dvh bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-slate-400 text-sm hover:text-slate-600">
              padeltracker.pro
            </a>
            <span className="text-slate-300">/</span>
            <h1 className="text-lg font-bold text-slate-800">Admin</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>{user.email}</span>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}
