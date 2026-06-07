import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getSessionProfile() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { supabase, user, profile };
}

export async function requireCustomer() {
  const context = await getSessionProfile();
  if (!context.user) redirect("/login");
  if (context.profile?.role === "admin") redirect("/admin");
  return context;
}

export async function requireAdmin() {
  const context = await getSessionProfile();
  if (!context.user) redirect("/login");
  if (context.profile?.role !== "admin") redirect("/club");
  return context;
}
