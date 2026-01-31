"use client";

interface TopUser {
  email: string;
  display_name: string | null;
  match_count: number;
  last_played: string;
}

export function TopUsersTable({ users }: { users: TopUser[] }) {
  if (users.length === 0) {
    return (
      <div className="rounded-xl bg-white border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          Top Users (by matches)
        </h3>
        <p className="text-sm text-slate-400 text-center py-8">No data yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">
        Top Users (by matches)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-100">
              <th className="pb-2 font-medium">#</th>
              <th className="pb-2 font-medium">User</th>
              <th className="pb-2 font-medium text-right">Matches</th>
              <th className="pb-2 font-medium text-right">Last Played</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={user.email}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="py-2.5 text-slate-400">{i + 1}</td>
                <td className="py-2.5">
                  <p className="font-medium text-slate-800">
                    {user.display_name || "Anonymous"}
                  </p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </td>
                <td className="py-2.5 text-right font-semibold text-slate-700">
                  {user.match_count}
                </td>
                <td className="py-2.5 text-right text-slate-500">
                  {new Date(user.last_played).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
