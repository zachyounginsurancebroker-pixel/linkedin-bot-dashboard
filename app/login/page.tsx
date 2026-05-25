"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "password" | "magic";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    const supabase = createClient();

    if (mode === "password") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setStatus("error");
        setErrorMsg(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
      return;
    }

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
          Sign in to view your tracked applications.
        </p>

        <div className="flex gap-2 mb-6 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode("password");
              setStatus("idle");
              setErrorMsg("");
            }}
            className={`flex-1 rounded-md py-2 transition ${
              mode === "password"
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("magic");
              setStatus("idle");
              setErrorMsg("");
            }}
            className={`flex-1 rounded-md py-2 transition ${
              mode === "magic"
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            Magic link
          </button>
        </div>

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
                disabled={status === "submitting"}
              />
            </div>
            {mode === "password" && (
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  placeholder="••••••••"
                  disabled={status === "submitting"}
                />
              </div>
            )}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 transition"
            >
              {status === "submitting"
                ? mode === "password"
                  ? "Signing in…"
                  : "Sending magic link…"
                : mode === "password"
                  ? "Sign in"
                  : "Send magic link"}
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
