"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErr("ایمیل یا رمز عبور اشتباهه.");
    else router.push("/admin/dashboard");
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm px-4 py-24">
      <h1 className="text-center text-xl font-bold">ورود مدیریت</h1>
      <div className="mt-6 space-y-3">
        <input
          type="email"
          required
          placeholder="ایمیل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-ink-900"
          dir="ltr"
        />
        <input
          type="password"
          required
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-ink-900"
          dir="ltr"
        />
      </div>
      {err && <p className="mt-3 text-sm text-red-500">{err}</p>}
      <button className="mt-6 w-full rounded-full bg-brand-500 py-2.5 font-medium text-white hover:bg-brand-600">
        ورود
      </button>
    </form>
  );
}
