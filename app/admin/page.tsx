"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      setErr("ایمیل یا رمز عبور اشتباهه.");
      return;
    }
    router.replace("/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm px-4 py-24">
      <h1 className="text-center text-xl font-bold">ورود مدیریت</h1>
      <p className="mt-2 text-center text-sm text-ink-900/50">این بخش فقط برای مدیران بیرون است.</p>
      <div className="mt-6 space-y-3">
        <input type="email" required autoComplete="email" placeholder="ایمیل" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-ink-900" dir="ltr" />
        <input type="password" required autoComplete="current-password" placeholder="رمز عبور" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-ink-900" dir="ltr" />
      </div>
      {err && <p className="mt-3 text-sm text-red-500">{err}</p>}
      <button disabled={busy} className="mt-6 w-full rounded-full bg-brand-500 py-2.5 font-medium text-white hover:bg-brand-600 disabled:opacity-50">
        {busy ? "در حال ورود…" : "ورود"}
      </button>
    </form>
  );
}
