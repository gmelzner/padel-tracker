import {
  getTotalUsers,
  getTotalMatches,
  getTotalShared,
  getActiveUsers7d,
  getFrequentUsers,
  getUsersOverTime,
  getMatchesOverTime,
  getSharedOverTime,
  getTopUsers,
  getLastMatches,
  getCountInRange,
  getStartOfWeek,
  getStartOfLastWeek,
  getStartOfMonth,
  getStartOfLastMonth,
  getPendingTournaments,
  getTotalTournaments,
} from "@/lib/admin-queries";
import { MetricsCards } from "@/components/admin/metrics-cards";
import { ActivityChart } from "@/components/admin/activity-chart";
import { TopUsersTable } from "@/components/admin/top-users-table";
import { GrowthSummary } from "@/components/admin/growth-summary";
import { LastMatches } from "@/components/admin/last-matches";
import { PendingTournaments } from "@/components/admin/pending-tournaments";

// Force dynamic — admin needs auth + live Supabase data
export const dynamic = "force-dynamic";

function formatDailyData(
  rows: { date: string; count: number }[]
): { date: string; count: number }[] {
  return rows.map((r) => ({
    date: new Date(r.date + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    count: r.count,
  }));
}

export default async function AdminDashboard() {
  const weekStart = getStartOfWeek();
  const lastWeekStart = getStartOfLastWeek();
  const monthStart = getStartOfMonth();
  const lastMonthStart = getStartOfLastMonth();

  const [
    totalUsers,
    totalMatches,
    totalShared,
    activeUsers7d,
    frequentUsers,
    usersOverTime,
    matchesOverTime,
    sharedOverTime,
    topUsers,
    lastMatches,
    matchesThisWeek,
    matchesLastWeek,
    matchesThisMonth,
    matchesLastMonth,
    usersThisWeek,
    usersLastWeek,
    usersThisMonth,
    usersLastMonth,
    pendingTournaments,
    totalTournaments,
  ] = await Promise.all([
    getTotalUsers(),
    getTotalMatches(),
    getTotalShared(),
    getActiveUsers7d(),
    getFrequentUsers(),
    getUsersOverTime(),
    getMatchesOverTime(),
    getSharedOverTime(),
    getTopUsers(),
    getLastMatches(10),
    getCountInRange("matches", "played_at", weekStart),
    getCountInRange("matches", "played_at", lastWeekStart, weekStart),
    getCountInRange("matches", "played_at", monthStart),
    getCountInRange("matches", "played_at", lastMonthStart, monthStart),
    getCountInRange("profiles", "created_at", weekStart),
    getCountInRange("profiles", "created_at", lastWeekStart, weekStart),
    getCountInRange("profiles", "created_at", monthStart),
    getCountInRange("profiles", "created_at", lastMonthStart, monthStart),
    getPendingTournaments(),
    getTotalTournaments(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">
          Last updated: {new Date().toLocaleString("en-US")}
        </p>
      </div>

      <MetricsCards
        cards={[
          { label: "Total Users", value: totalUsers },
          { label: "Total Matches", value: totalMatches },
          { label: "Shared Results", value: totalShared },
          {
            label: "Active (7d)",
            value: activeUsers7d,
            subtitle: `${frequentUsers} frequent (5+)`,
          },
          {
            label: "Tournaments",
            value: totalTournaments,
            subtitle: pendingTournaments.length > 0
              ? `${pendingTournaments.length} pending`
              : undefined,
          },
        ]}
      />

      <PendingTournaments tournaments={pendingTournaments} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GrowthSummary
          periods={[
            {
              label: "Matches this week",
              current: matchesThisWeek,
              previous: matchesLastWeek,
            },
            {
              label: "Matches this month",
              current: matchesThisMonth,
              previous: matchesLastMonth,
            },
            {
              label: "New users this week",
              current: usersThisWeek,
              previous: usersLastWeek,
            },
            {
              label: "New users this month",
              current: usersThisMonth,
              previous: usersLastMonth,
            },
          ]}
        />
        <ActivityChart
          title="Shared Results (30d)"
          data={formatDailyData(sharedOverTime)}
          color="#8b5cf6"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActivityChart
          title="New Users (30d)"
          data={formatDailyData(usersOverTime)}
          color="#3b82f6"
        />
        <ActivityChart
          title="Matches Played (30d)"
          data={formatDailyData(matchesOverTime)}
          color="#f97316"
        />
      </div>

      <TopUsersTable users={topUsers} />

      <LastMatches matches={lastMatches} />
    </div>
  );
}
