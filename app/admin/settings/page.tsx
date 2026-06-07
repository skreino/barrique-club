import { Card, SectionTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Setup" title="Impostazioni operative.">
        Le scelte minime per tenere il club ordinato mentre cresce.
      </SectionTitle>
      <Card className="space-y-4">
        <h2 className="font-display text-2xl text-vellum">Promuovere il titolare ad admin</h2>
        <p className="text-sm leading-6 text-pewter">
          Dopo aver creato l'account da registrazione, esegui questa query in Supabase sostituendo l'email.
        </p>
        <pre className="overflow-x-auto rounded-md border border-champagne/15 bg-[#100b09] p-4 text-xs text-crema">
{`update public.profiles
set role = 'admin'
where email = 'titolare@caffebarrique.it';`}
        </pre>
      </Card>
      <Card className="space-y-4">
        <h2 className="font-display text-2xl text-vellum">Premio fidelity</h2>
        <p className="text-sm leading-6 text-pewter">
          Lo schema crea un premio attivo da 10 visite chiamato Premio Barrique. Puoi modificarlo da SQL se cambi campagna.
        </p>
        <pre className="overflow-x-auto rounded-md border border-champagne/15 bg-[#100b09] p-4 text-xs text-crema">
{`update public.rewards
set name = 'Calice della casa', required_checkins = 10
where active = true;`}
        </pre>
      </Card>
    </div>
  );
}
