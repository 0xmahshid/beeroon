"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Business } from "@/lib/types";

const statusLabel: Record<string, string> = {
  pending: "در انتظار تایید",
  approved: "فعال",
  rejected: "رد شده",
};

export default function Dashboard() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function load() {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      router.push("/admin");
      return;
    }
    const { data } = await supabase
      .from("businesses")
      .select("*")
      .order("created_at", { ascending: false });
    setBusinesses((data as Business[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: string) {
    await supabase.from("businesses").update({ status }).eq("id", id);
    load();
  }

  async function remove(id: string) {
    if (!confirm("حذف بشه؟")) return;
    await supabase.from("businesses").delete().eq("id", id);
    load();
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin");
  }

  if (loading) return <p className="p-10 text-center">در حال بارگذاری…</p>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">مدیریت کسب‌وکارها</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/dashboard/new"
            className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            + افزودن کسب‌وکار
          </Link>
          <button
            onClick={logout}
            className="rounded-full border border-black/10 px-4 py-2 text-sm dark:border-white/10"
          >
            خروج
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {businesses.map((b) => (
          <div
            key={b.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/5 bg-white p-4 dark:border-white/5 dark:bg-ink-900"
          >
            <div>
              <p className="font-semibold">{b.name}</p>
              <p className="text-xs text-ink-900/50 dark:text-ink-50/50">
                {statusLabel[b.status]} · {b.address}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              {b.status !== "approved" && (
                <button
                  onClick={() => setStatus(b.id, "approved")}
                  className="chip border-green-500/30 text-green-600"
                >
                  تایید
                </button>
              )}
              {b.status !== "rejected" && (
                <button
                  onClick={() => setStatus(b.id, "rejected")}
                  className="chip border-amber-500/30 text-amber-600"
                >
                  رد
                </button>
              )}
              <Link href={`/admin/dashboard/edit/${b.id}`} className="chip border-black/10 dark:border-white/10">
                ویرایش
              </Link>
              <button onClick={() => remove(b.id)} className="chip border-red-500/30 text-red-600">
                حذف
              </button>
            </div>
          </div>
        ))}
        {businesses.length === 0 && (
          <p className="py-16 text-center text-ink-900/50 dark:text-ink-50/50">
            هنوز کسب‌وکاری ثبت نشده.
          </p>
        )}
      </div>
    </div>
  );
}
