import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin?next=%2Fadmin%2Fdashboard");
  if (user.app_metadata?.role !== "admin") redirect("/admin?error=not-authorized");

  return children;
}
