"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6">
      <div className="w-full max-w-md bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">{appName}</h1>
        <p className="text-slate-400 mb-6 text-sm">
          Sign in with a magic link. Your bot pushes applied jobs here in real time.
        </p>
        {status === "sent" ? (
          <div className="rounded-lg bg-emerald-950/50 border border-emerald-800 p-4 text-emerald-200 text-sm">
            Check <span className="font-semibold">{email}</span> — magic link is on the way.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                placeholder="you@example.com"
                disabled={status === "sending"}
              />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 transition"
            >
              {status === "sending" ? "Sending magic link…" : "Send magic link"}
            </button>
            {errorMsg && (
              <p className="text-rose-400 text-sm">{errorMsg}</p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
