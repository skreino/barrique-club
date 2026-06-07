import { Wine, CalendarDays } from "lucide-react";
import { requireCustomer } from "@/lib/auth";
import { Card, SectionTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { CustomerQr } from "@/components/club/customer-qr";
import { ProgressCard } from "@/components/club/progress-card";
import { favoriteLabels, formatDate } from "@/lib/utils";

export default async function ClubPage() {
  const { supabase, user } = await requireCustomer();

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  if (!customer) {
    return (
      <EmptyState
        title="Card in preparazione"
        text="Il profilo cliente non e ancora stato creato. Se hai appena confermato l'email, prova a rientrare tra qualche istante."
      />
    );
  }

  const [{ count: visits }, { data: reward }, { data: checkins }] = await Promise.all([
    supabase.from("checkins").select("id", { count: "exact", head: true }).eq("customer_id", customer.id),
    supabase.from("rewards").select("*").eq("active", true).order("required_checkins").limit(1).single(),
    supabase
      .from("checkins")
      .select("*")
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false })
      .limit(8)
  ]);

  const required = reward?.required_checkins ?? 10;
  const fullName = `${customer.first_name} ${customer.last_name}`.trim();

  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Area cliente" title={`Ciao, ${customer.first_name}.`}>
        Ogni passaggio da Barrique conta. Qui trovi card, visite e premio.
      </SectionTitle>

      <Card className="overflow-hidden p-0">
        <div className="relative p-5">
          <div className="absolute inset-x-0 top-0 h-1 bg-champagne" />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-champagne">Fidelity card</p>
              <h2 className="mt-4 font-display text-3xl font-semibold text-vellum">{fullName}</h2>
              <p className="mt-2 text-sm text-pewter">
                Preferenza: {favoriteLabels[customer.favorite_category] ?? "Da scoprire"}
              </p>
            </div>
            <CustomerQr value={`barrique-customer:${customer.id}`} />
          </div>
        </div>
      </Card>

      <ProgressCard visits={visits ?? 0} required={required} />

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-pewter">Storico visite</p>
            <h2 className="font-display text-2xl text-vellum">Ultimi passaggi</h2>
          </div>
          <Wine className="h-5 w-5 text-champagne" />
        </div>
        {checkins?.length ? (
          <div className="space-y-3">
            {checkins.map((checkin) => (
              <div key={checkin.id} className="flex items-center gap-3 rounded-md border border-champagne/15 bg-crema/5 p-3">
                <CalendarDays className="h-4 w-4 text-champagne" />
                <div>
                  <p className="text-sm text-vellum">{formatDate(checkin.created_at)}</p>
                  <p className="text-xs text-pewter">Check-in registrato al banco</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-md border border-champagne/15 bg-crema/5 p-4 text-sm leading-6 text-pewter">
            Nessuna visita registrata per ora. La prossima volta chiedi al banco di segnare il tuo passaggio.
          </p>
        )}
      </Card>
    </div>
  );
}
