import { Cake } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { SectionTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { CustomerCard } from "@/components/admin/customer-card";

export default async function BirthdaysPage() {
  const { supabase } = await requireAdmin();
  const month = new Date().getMonth() + 1;

  const { data: customers } = await supabase
    .from("customers")
    .select("*, customer_tags(tags(id, name))")
    .filter("birthday", "not.is", null)
    .order("birthday", { ascending: true });

  const birthdays = (customers ?? []).filter((customer) => {
    if (!customer.birthday) return false;
    return Number(customer.birthday.slice(5, 7)) === month;
  });

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Compleanni" title="Inviti da fare bene.">
        Un messaggio piccolo, personale, al momento giusto. Niente automatismi freddi.
      </SectionTitle>
      <div className="flex items-center gap-2 rounded-lg border border-champagne/20 bg-champagne/10 p-4 text-sm text-crema">
        <Cake className="h-5 w-5 text-champagne" />
        {birthdays.length} clienti compiono gli anni questo mese.
      </div>
      <div className="space-y-3">
        {birthdays.length ? (
          birthdays.map((customer) => <CustomerCard key={customer.id} customer={customer} />)
        ) : (
          <EmptyState title="Nessun compleanno questo mese" text="Quando ci saranno compleanni, li troverai qui pronti da contattare." />
        )}
      </div>
    </div>
  );
}
