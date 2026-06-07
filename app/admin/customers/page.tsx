import { Search } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { SectionTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, inputClass } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CustomerCard } from "@/components/admin/customer-card";

export default async function CustomersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; preference?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").toLowerCase();
  const preference = params.preference ?? "";
  const tag = (params.tag ?? "").toLowerCase();
  const { supabase } = await requireAdmin();

  const { data: customers } = await supabase
    .from("customers")
    .select("*, customer_tags(tags(id, name))")
    .order("created_at", { ascending: false });

  const filtered = (customers ?? []).filter((customer) => {
    const text = `${customer.first_name} ${customer.last_name} ${customer.email} ${customer.phone ?? ""}`.toLowerCase();
    const matchesText = !q || text.includes(q);
    const matchesPreference = !preference || customer.favorite_category === preference;
    const matchesTag =
      !tag ||
      customer.customer_tags?.some((item: { tags: { name: string } | null }) =>
        item.tags?.name.toLowerCase().includes(tag)
      );
    return matchesText && matchesPreference && matchesTag;
  });

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Clienti" title="Rubrica Barrique.">
        Cerca persone, preferenze e piccoli segnali utili prima di scrivere o segnare un passaggio.
      </SectionTitle>
      <form className="barrique-panel grid gap-3 rounded-lg p-4 sm:grid-cols-[1fr_180px_160px_auto]">
        <Field label="Cerca">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-champagne" />
            <input className={`${inputClass} pl-10`} name="q" placeholder="Nome, email, telefono" defaultValue={params.q ?? ""} />
          </div>
        </Field>
        <Field label="Preferenza">
          <select className={inputClass} name="preference" defaultValue={preference}>
            <option value="">Tutte</option>
            <option value="colazione">Colazione</option>
            <option value="aperitivo">Aperitivo</option>
            <option value="vino">Vino</option>
            <option value="cocktail">Cocktail</option>
          </select>
        </Field>
        <Field label="Tag">
          <input className={inputClass} name="tag" placeholder="vip, vino..." defaultValue={params.tag ?? ""} />
        </Field>
        <Button className="self-end" type="submit">Filtra</Button>
      </form>
      <div className="space-y-3">
        {filtered.length ? (
          filtered.map((customer) => <CustomerCard key={customer.id} customer={customer} />)
        ) : (
          <EmptyState title="Nessun cliente trovato" text="Prova a togliere un filtro o cerca con meno dettagli." />
        )}
      </div>
    </div>
  );
}
