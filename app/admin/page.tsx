import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { SectionTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { StatCard } from "@/components/admin/stat-card";

export default async function AdminPage() {
  const { supabase } = await requireAdmin();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const inactiveBefore = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const month = now.getMonth() + 1;

  const [customers, checkins, newCustomers, birthdayRows, inactive] = await Promise.all([
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("checkins").select("id", { count: "exact", head: true }),
    supabase.from("customers").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
    supabase.from("customers").select("birthday").filter("birthday", "not.is", null),
    supabase
      .from("customers")
      .select("id", { count: "exact", head: true })
      .or(`last_visit_at.is.null,last_visit_at.lt.${inactiveBefore}`)
  ]);
  const birthdayCount =
    birthdayRows.data?.filter((customer) => Number(customer.birthday?.slice(5, 7)) === month).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionTitle eyebrow="Banco titolare" title="Il club, a colpo d'occhio.">
          Numeri essenziali per curare ritorni, compleanni e clienti da risentire.
        </SectionTitle>
        <ButtonLink href="/admin/customers">Apri clienti</ButtonLink>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Clienti totali" value={customers.count ?? 0} hint="Card create nel club" />
        <StatCard label="Check-in totali" value={checkins.count ?? 0} hint="Passaggi registrati" />
        <StatCard label="Nuovi questo mese" value={newCustomers.count ?? 0} hint="Ingressi recenti" />
        <StatCard label="Compleanni" value={birthdayCount} hint="Da invitare con garbo" />
        <StatCard label="Inattivi 30 giorni" value={inactive.count ?? 0} hint="Da riaccendere" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link className="barrique-panel rounded-lg p-5" href="/admin/birthdays">
          <p className="font-display text-2xl text-vellum">Compleanni del mese</p>
          <p className="mt-2 text-sm leading-6 text-pewter">Una lista pronta per inviti piccoli, personali, senza rumore.</p>
        </Link>
        <Link className="barrique-panel rounded-lg p-5" href="/admin/inactive">
          <p className="font-display text-2xl text-vellum">Clienti inattivi</p>
          <p className="mt-2 text-sm leading-6 text-pewter">Chi manca da un po', con contatto rapido e contesto.</p>
        </Link>
      </div>
    </div>
  );
}
