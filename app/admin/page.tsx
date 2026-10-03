"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const DEFAULT_NEXT = "/admin/dashboard";

function isSafeNextPath(value: string | null): value is string {
  return Boolean(value && value.startsWith("/") && !value.startsWith("//"));
}

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [nextPath, setNextPath] = useState(DEFAULT_NEXT);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (isSafeNextPath(next)) setNextPath(next);
    if (params.get("error") === "not-authorized") {
      setNotice("این حساب اجازه‌ی ورود به پنل مدیریت بیرون را ندارد.");
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setNotice("");
    setBusy(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || data.user?.app_metadata?.role !== "admin") {
      if (!error) await supabase.auth.signOut();
      setBusy(false);
      setErr(error ? "ایمیل یا رمز عبور درست نیست." : "این حساب اجازه‌ی ورود به پنل مدیریت را ندارد.");
      return;
    }

    setBusy(false);
    router.replace(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm px-4 py-24">
      <h1 className="text-center text-xl font-bold">ورود مدیریت</h1>
      <p className="mt-2 text-center text-sm text-ink-900/50">ورود به این بخش فقط برای مدیران بیرون است.</p>
      <div className="mt-6 space-y-3">
        <input type="email" required autoComplete="email" placeholder="ایمیل" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-ink-900" dir="ltr" />
        <input type="password" required autoComplete="current-password" placeholder="رمز عبور" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-ink-900" dir="ltr" />
      </div>
      {notice && <p className="mt-3 text-sm text-amber-600">{notice}</p>}
      {err && <p className="mt-3 text-sm text-red-500">{err}</p>}
      <button disabled={busy} className="mt-6 w-full rounded-full bg-brand-500 py-2.5 font-medium text-white hover:bg-brand-600 disabled:opacity-50">
        {busy ? "در حال ورود…" : "ورود"}
      </button>
    </form>
  );
}
