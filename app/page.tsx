import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Application, SearchRun, JobSource } from "@/lib/types";
import { ApplicationsTable } from "@/components/ApplicationsTable";
import { StatCard } from "@/components/StatCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const source = (process.env.NEXT_PUBLIC_BOT_SOURCE ||
    "applypilot") as JobSource;
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Dashboard";

  const [{ data: applications }, { data: runs }, totals] = await Promise.all([
    supabase
      .from("applications")
      .select("*")
      .eq("source", source)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("search_runs")
      .select("*")
      .eq("source", source)
      .order("started_at", { ascending: false })
      .limit(10),
    supabase
      .from("applications")
      .select("status", { count: "exact" })
      .eq("source", source),
  ]);

  const apps = (applications ?? []) as Application[];
  const searchRuns = (runs ?? []) as SearchRun[];

  const submitted = apps.filter(
    (a) =>
      a.status === "submitted" ||
      a.status === "response_received" ||
      a.status === "interview" ||
      a.status === "offer" ||
      a.status === "rejected",
  ).length;
  const responses = apps.filter(
    (a) =>
      a.status === "response_received" ||
      a.status === "interview" ||
      a.status === "offer",
  ).length;
  const sponsorshipFriendly = apps.filter((a) => a.sponsorship_friendly).length;
  const totalCount = totals.count ?? apps.length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{appName}</h1>
            <p className="text-xs text-slate-400">
              B1 / sales sponsorship hunt — source: {source}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">{user.email}</span>
            <form action="/api/signout" method="post">
              <button className="rounded-md bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Discovered" value={totalCount} tone="indigo" />
          <StatCard label="Submitted" value={submitted} tone="emerald" />
          <StatCard label="Responses" value={responses} tone="amber" />
          <StatCard
            label="Sponsorship-friendly"
            value={sponsorshipFriendly}
            tone="rose"
          />
        </div>

        {searchRuns.length > 0 && (
          <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <h2 className="text-sm font-semibold text-slate-300 mb-3">
              Recent search runs
            </h2>
            <div className="space-y-2">
              {searchRuns.slice(0, 3).map((run) => (
                <div
                  key={run.id}
                  className="flex flex-wrap items-center gap-3 text-xs text-slate-400"
                >
                  <span className="font-mono text-slate-500">
                    {new Date(run.started_at).toLocaleString()}
                  </span>
                  <span className="rounded bg-slate-800 px-2 py-0.5">
                    {run.status}
                  </span>
                  <span>
                    {run.total_applied}/{run.total_discovered} applied
                  </span>
                  <span className="truncate text-slate-500">
                    {run.search_terms?.slice(0, 3).join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <ApplicationsTable applications={apps} />

        {apps.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-12 text-center">
            <p className="text-slate-400 text-sm">
              No applications yet for source{" "}
              <code className="rounded bg-slate-800 px-1.5 py-0.5">{source}</code>.
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Run the bot locally — once it writes to Supabase, results will appear here in real time.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
