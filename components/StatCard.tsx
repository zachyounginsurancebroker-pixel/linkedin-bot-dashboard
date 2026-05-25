type Tone = "indigo" | "emerald" | "amber" | "rose";

const TONE_CLASSES: Record<Tone, string> = {
  indigo: "from-indigo-500/20 to-indigo-900/20 border-indigo-700/40 text-indigo-300",
  emerald:
    "from-emerald-500/20 to-emerald-900/20 border-emerald-700/40 text-emerald-300",
  amber: "from-amber-500/20 to-amber-900/20 border-amber-700/40 text-amber-300",
  rose: "from-rose-500/20 to-rose-900/20 border-rose-700/40 text-rose-300",
};

export function StatCard({
  label,
  value,
  tone = "indigo",
}: {
  label: string;
  value: number | string;
  tone?: Tone;
}) {
  return (
    <div
      className={`rounded-xl border bg-gradient-to-br p-4 ${TONE_CLASSES[tone]}`}
    >
      <div className="text-xs uppercase tracking-wide opacity-80">{label}</div>
      <div className="text-3xl font-bold mt-1 text-white">{value}</div>
    </div>
  );
}
