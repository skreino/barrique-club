import { requireAdmin } from "@/lib/auth";
import { SectionTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { CustomerCard } from "@/components/admin/customer-card";

export default async function InactivePage() {
  const { supabase } = await requireAdmin();
  const inactiveBefore = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: customers } = await supabase
    .from("customers")
    .select("*, customer_tags(tags(id, name))")
    .or(`last_visit_at.is.null,last_visit_at.lt.${inactiveBefore}`)
    .order("last_visit_at", { ascending: true, nullsFirst: true });

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Ritorni" title="Clienti da risentire.">
        Persone che non passano da almeno 30 giorni o non hanno ancora una visita registrata.
      </SectionTitle>
      <div className="space-y-3">
        {customers?.length ? (
          customers.map((customer) => <CustomerCard key={customer.id} customer={customer} />)
        ) : (
          <EmptyState title="Nessun inattivo" text="Bel segnale: al momento non ci sono clienti da riattivare." />
        )}
      </div>
    </div>
  );
}
