"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const email = stringValue(formData, "email");
  const password = stringValue(formData, "password");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?error=${encodeURIComponent("Credenziali non valide.")}`);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  redirect(profile?.role === "admin" ? "/admin" : "/club");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const firstName = stringValue(formData, "first_name");
  const lastName = stringValue(formData, "last_name");
  const email = stringValue(formData, "email");
  const phone = stringValue(formData, "phone");
  const birthday = stringValue(formData, "birthday");
  const favoriteCategory = stringValue(formData, "favorite_category");
  const password = stringValue(formData, "password");
  const marketingConsent = formData.get("marketing_consent") === "on";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim(),
        phone,
        birthday,
        favorite_category: favoriteCategory,
        marketing_consent: marketingConsent
      }
    }
  });

  if (error) redirect(`/register?error=${encodeURIComponent(error.message)}`);
  redirect("/login?message=Controlla la tua email oppure accedi se la conferma non e attiva.");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function updateCustomerProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const firstName = stringValue(formData, "first_name");
  const lastName = stringValue(formData, "last_name");
  const phone = stringValue(formData, "phone");
  const birthday = stringValue(formData, "birthday") || null;
  const favoriteCategory = stringValue(formData, "favorite_category");
  const marketingConsent = formData.get("marketing_consent") === "on";

  await supabase
    .from("customers")
    .update({
      first_name: firstName,
      last_name: lastName,
      phone,
      birthday,
      favorite_category: favoriteCategory,
      marketing_consent: marketingConsent
    })
    .eq("user_id", user.id);

  await supabase
    .from("profiles")
    .update({ full_name: `${firstName} ${lastName}`.trim(), phone })
    .eq("id", user.id);

  revalidatePath("/club");
  revalidatePath("/club/profile");
}

export async function addCheckin(formData: FormData) {
  const supabase = await createClient();
  const customerId = stringValue(formData, "customer_id");
  await supabase.from("checkins").insert({ customer_id: customerId, source: "manuale_admin" });
  revalidatePath("/admin");
  revalidatePath(`/admin/customers/${customerId}`);
}

export async function redeemReward(formData: FormData) {
  const supabase = await createClient();
  const customerId = stringValue(formData, "customer_id");

  const { data: reward } = await supabase
    .from("rewards")
    .select("*")
    .eq("active", true)
    .order("required_checkins")
    .limit(1)
    .single();

  if (!reward) return;

  const { data: lastRedemption } = await supabase
    .from("customer_rewards")
    .select("redeemed_at")
    .eq("customer_id", customerId)
    .eq("reward_id", reward.id)
    .eq("redeemed", true)
    .order("redeemed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let checkinsQuery = supabase
    .from("checkins")
    .select("created_at")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: true })
    .limit(reward.required_checkins);

  if (lastRedemption?.redeemed_at) {
    checkinsQuery = checkinsQuery.gt("created_at", lastRedemption.redeemed_at);
  }

  const { data: checkinsToSpend } = await checkinsQuery;
  if (!checkinsToSpend || checkinsToSpend.length < reward.required_checkins) return;

  const cutoffCheckin = checkinsToSpend[reward.required_checkins - 1];

  await supabase.from("customer_rewards").insert({
    customer_id: customerId,
    reward_id: reward.id,
    redeemed: true,
    redeemed_at: cutoffCheckin.created_at
  });

  revalidatePath("/admin");
  revalidatePath("/club");
  revalidatePath(`/admin/customers/${customerId}`);
}

export async function removeLastCheckin(formData: FormData) {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();
  const customerId = stringValue(formData, "customer_id");
  if (!adminSupabase) return;

  const { data: latestCheckin } = await adminSupabase
    .from("checkins")
    .select("id")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latestCheckin) return;

  await adminSupabase.from("checkins").delete().eq("id", latestCheckin.id);

  const { data: newLatestCheckin } = await adminSupabase
    .from("checkins")
    .select("created_at")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  await adminSupabase
    .from("customers")
    .update({ last_visit_at: newLatestCheckin?.created_at ?? null })
    .eq("id", customerId);

  revalidatePath("/admin");
  revalidatePath("/club");
  revalidatePath(`/admin/customers/${customerId}`);
}

export async function addNote(formData: FormData) {
  const supabase = await createClient();
  const customerId = stringValue(formData, "customer_id");
  const content = stringValue(formData, "content");
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user && content) {
    await supabase.from("notes").insert({
      customer_id: customerId,
      admin_id: user.id,
      content
    });
  }

  revalidatePath(`/admin/customers/${customerId}`);
}

export async function addTagToCustomer(formData: FormData) {
  const supabase = await createClient();
  const customerId = stringValue(formData, "customer_id");
  const tagName = stringValue(formData, "tag_name").toLowerCase();
  if (!tagName) return;

  const { data: tag } = await supabase
    .from("tags")
    .upsert({ name: tagName }, { onConflict: "name" })
    .select("id")
    .single();

  if (tag) {
    await supabase
      .from("customer_tags")
      .upsert({ customer_id: customerId, tag_id: tag.id });
  }

  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${customerId}`);
}

export async function removeTagFromCustomer(formData: FormData) {
  const supabase = await createClient();
  const customerId = stringValue(formData, "customer_id");
  const tagId = stringValue(formData, "tag_id");

  await supabase
    .from("customer_tags")
    .delete()
    .eq("customer_id", customerId)
    .eq("tag_id", tagId);

  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${customerId}`);
}
