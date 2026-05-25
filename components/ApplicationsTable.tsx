import type { Application } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
  discovered: "bg-slate-700 text-slate-200",
  scored: "bg-indigo-700 text-indigo-100",
  tailored: "bg-purple-700 text-purple-100",
  submitted: "bg-emerald-700 text-emerald-100",
  response_received: "bg-amber-700 text-amber-100",
  interview: "bg-amber-600 text-amber-50",
  offer: "bg-fuchsia-700 text-fuchsia-100",
  rejected: "bg-rose-900 text-rose-200",
  skipped: "bg-slate-800 text-slate-500",
};

function formatSalary(min: number | null, max: number | null, currency: string | null) {
  if (!min && !max) return "—";
  const c = currency || "USD";
  if (min && max) return `${c} ${min.toLocaleString()}–${max.toLocaleString()}`;
  return `${c} ${(min ?? max)!.toLocaleString()}+`;
}

export function ApplicationsTable({
  applications,
}: {
  applications: Application[];
}) {
  if (applications.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-800 text-left">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                Role
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                Company
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                Location
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                Score
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                Salary
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                Sponsor?
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr
                key={app.id}
                className="border-b border-slate-800/60 hover:bg-slate-800/40 transition"
              >
                <td className="px-4 py-3 max-w-xs">
                  {app.job_url ? (
                    <a
                      href={app.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-300 hover:text-indigo-200 hover:underline"
                    >
                      {app.title}
                    </a>
                  ) : (
                    <span>{app.title}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-300">{app.company}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {app.location || "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-xs ${
                      STATUS_STYLES[app.status] ?? "bg-slate-700 text-slate-200"
                    }`}
                  >
                    {app.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {app.ai_score != null ? (
                    <span
                      className={`font-mono ${
                        app.ai_score >= 7
                          ? "text-emerald-400"
                          : app.ai_score >= 5
                            ? "text-amber-400"
                            : "text-slate-500"
                      }`}
                    >
                      {app.ai_score.toFixed(1)}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {formatSalary(app.salary_min, app.salary_max, app.salary_currency)}
                </td>
                <td className="px-4 py-3 text-xs">
                  {app.sponsorship_friendly === true ? (
                    <span className="text-emerald-400">✓ Yes</span>
                  ) : app.sponsorship_friendly === false ? (
                    <span className="text-rose-400">✗ No</span>
                  ) : (
                    <span className="text-slate-500">?</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                  {new Date(app.applied_at || app.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
